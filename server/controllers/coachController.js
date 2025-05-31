import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

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
        session: true,
        section: true,
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
  const { email, firstName, lastName, gender: genderName, session, section } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    const coachRole = await prisma.role.findFirst({
      where: { roleName: 'coach' }
    });

    if (!coachRole) {
      return res.status(500).json({
        message: 'Role configuration error'
      });
    }

    let genderId = null;
    if (genderName) {
      const gender = await prisma.gender.findFirst({
        where: { genderName: { equals: genderName, mode: 'insensitive' } }
      });
      if (gender) {
        genderId = gender.id;
      }
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const newCoach = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        genderId,
        session,
        section,
        roleId: coachRole.id,
        active: true
      },
      include: {
        role: true,
        gender: true
      }
    });

    const { password: _, ...coachData } = newCoach;

    res.status(201).json({
      message: 'Coach added successfully',
      data: {
        ...coachData,
        temporaryPassword
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to add coach',
      error: error.message
    });
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
        session: true,
        section: true,
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