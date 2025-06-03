import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sendPasswordSetupEmail, generatePasswordSetupToken } from '../utils/emailService.js';

const prisma = new PrismaClient();

export const getAllCoaches = async (req, res) => {
  try {
    const coachRole = await prisma.role.findFirst({
      where: { roleName: 'coach' }
    });

    if (!coachRole) {
      return res.status(500).json({
        message: 'Role configuration error'
      });
    }

    const coaches = await prisma.user.findMany({
      where: { roleId: coachRole.id },
      select: {
        id: true,
        email: true,
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
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const transformedCoaches = coaches.map(coach => ({
      ...coach,
      role: coach.role.roleName,
      gender: coach.gender?.genderName || null
    }));

    res.status(200).json({
      message: 'Coaches fetched successfully',
      coaches: transformedCoaches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch coaches',
      error: error.message
    });
  }
};

export const getCoach = async (req, res) => {
  const { id } = req.params;
  try {
    const coach = await prisma.user.findFirst({
      where: { 
        id: Number(id),
        role: {
          roleName: 'coach'
        }
      },
      select: {
        id: true,
        email: true,
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
        session: true,
        section: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!coach) {
      return res.status(404).json({
        message: 'Coach not found'
      });
    }

    const transformedCoach = {
      ...coach,
      role: coach.role.roleName,
      gender: coach.gender?.genderName || null
    };

    res.status(200).json({
      message: 'Coach fetched successfully',
      data: transformedCoach
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch coach',
      error: error.message
    });
  }
};

export const addCoach = async (req, res) => {
  try {
    const { email, firstName, lastName, genderId } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const coachRole = await prisma.role.findFirst({
      where: { roleName: 'coach' }
    });

    if (!coachRole) {
      return res.status(500).json({ message: 'Coach role not found' });
    }

    const passwordSetupToken = generatePasswordSetupToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const coach = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        roleId: coachRole.id,
        genderId,
        passwordResetToken: passwordSetupToken,
        passwordResetExpires: tokenExpires,
        active: false
      },
    });

    const emailSent = await sendPasswordSetupEmail(email, passwordSetupToken);

    if (!emailSent) {
      await prisma.user.delete({ where: { id: coach.id } });
      return res.status(500).json({ message: 'Failed to send activation email' });
    }

    res.status(201).json({ 
      message: 'Coach account created. Please check email to activate account.',
      coachId: coach.id 
    });
  } catch (error) {
    console.error('Add coach error:', error);
    res.status(500).json({ message: 'Error creating coach account' });
  }
};

export const updateCoach = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    const updatedCoach = await prisma.user.update({
      where: { 
        id: Number(id),
        role: 'coach'
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        active: true,
        updatedAt: true
      }
    });
    res.status(200).json({
      message: 'Coach updated successfully',
      data: updatedCoach
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update coach',
      error: error.message
    });
  }
};

export const deleteCoach = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.user.delete({
      where: { 
        id: Number(id),
        role: 'coach'
      }
    });
    res.status(200).json({
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete coach',
      error: error.message
    });
  }
}; 