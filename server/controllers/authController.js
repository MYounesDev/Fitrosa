import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecretKey = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req, res) => {
    const { email, password, firstName, lastName, gender, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        const roleId = (await prisma.role.findFirst({
            where: { roleName: role }
        })).id;

        if (!roleId) {
            return res.status(500).json({
                message: 'Role configuration error'
            });
        }

        const genderId = (await prisma.gender.findFirst({
            where: { genderName: gender }
        })).id;

        if (!genderId) {
            return res.status(500).json({
                message: 'Gender configuration error'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roleId: roleId,
                firstName: firstName || '',
                lastName: lastName || '',
                genderId: genderId,
                active: false
            },
            include: {
                role: true,
                gender: true
            }
        });


        res.status(201).json({
        message: 'Registration successful'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password required'
        });
    }

    try {
        console.log('Attempting login for email:', email);

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: {
                    select: {
                        roleName: true
                    }
                },
                gender: {
                    select: {
                        genderName: true
                    }
                },
                profileImage: true,
                active: true,
                passwordChangedAt: true,
                session: true,
                section: true,
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role.roleName,
                tokenCreatedAt: new Date()
            },
            jwtSecretKey,
            { expiresIn: '1h' }
        );

        const { password: _, role, gender, ...restUserData } = user;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                ...restUserData,
                role: role.roleName,
                gender: gender?.genderName || null
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: {
                    select: {
                        roleName: true
                    }
                },
                gender: {
                    select: {
                        genderName: true
                    }
                },
                profileImage: true,
                active: true,
                passwordChangedAt: true,
                session: true,
                section: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: id },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date()
            }
        });


        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role.roleName,
                tokenCreatedAt: new Date()
            },
            jwtSecretKey,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Password changed successfully',
            token,
            user: {
                ...user,
                role: user.role.roleName,
                gender: user.gender?.genderName || null
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to change password',
            error: error.message
        });
    }
}; 