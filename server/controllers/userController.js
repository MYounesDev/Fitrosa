import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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
        profileImage: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transformedUser = {
      ...user,
      role: user.role.roleName,
      gender: user.gender?.genderName || null
    };

    res.status(200).json({
      message: 'Profile fetched successfully',
      data: transformedUser
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.user;
  
  // Remove sensitive fields that shouldn't be updated through this endpoint
  const { password, email, role, roleId, active, ...safeUpdateData } = req.body;


  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: safeUpdateData,
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
        profileImage: true,
        active: true,
        updatedAt: true
      }
    });

    const transformedUser = {
      ...updatedUser,
      role: updatedUser.role.roleName,
      gender: updatedUser.gender?.genderName || null
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      data: transformedUser
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}; 