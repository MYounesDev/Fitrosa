import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendPasswordSetupEmail, generatePasswordSetupToken } from '../utils/emailService.js';
import { logAuthAttempt } from '../utils/authLogHelper.js';

const prisma = new PrismaClient();
const jwtSecretKey = process.env.JWT_SECRET || "your_jwt_secret";

export const isAuthenticated = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    return res.status(200).json({ message: 'User is authenticated', token: token });
};


export const register = async (req, res) => {
    try {
        const { email, firstName, lastName, role, gender } = req.body;

        if (!email || !firstName || !lastName || !role || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('Email address already in use');
            return res.status(409).json({ message: 'Email address already in use' });
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
        
        const passwordSetupToken = generatePasswordSetupToken();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                roleId,
                genderId,
                passwordResetToken: passwordSetupToken,
                passwordResetExpires: tokenExpires,
                active: false
            },
        });

        const emailSent = await sendPasswordSetupEmail(email, passwordSetupToken, firstName);

        if (!emailSent) {
            await prisma.user.delete({ where: { id: user.id } });
            return res.status(500).json({ message: 'Failed to send activation email' });
        }

        res.status(201).json({ 
            message: 'Account created. Please check your email to activate your account.',
            userId: user.id 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating account' });
    }
};

export const setupPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password setup token' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                active: true,
                passwordChangedAt: new Date()
            }
        });

        res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
        console.error('Password setup error:', error);
        res.status(500).json({ message: 'Error setting up password' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    if (!email || !password) {
        await logAuthAttempt({
            email,
            status: "fail",
            ip_address,
            user_agent,
            failure_reason: "Email and password required"
        });
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
                passwordChangedAt: true
            }
        });

        if (!user) {
            await logAuthAttempt({
                email,
                status: "fail",
                ip_address,
                user_agent,
                failure_reason: "User not found"
            });
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            await logAuthAttempt({
                email,
                status: "fail",
                ip_address,
                user_agent,
                failure_reason: "Wrong password"
            });
            return res.status(401).json({
                message: 'Invalid email or password'
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

        // Log successful login
        await logAuthAttempt({
            email,
            status: "success",
            ip_address,
            user_agent
        });

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
        await logAuthAttempt({
            email,
            status: "fail",
            ip_address,
            user_agent,
            failure_reason: error.message
        });
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