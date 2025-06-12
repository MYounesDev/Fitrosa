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



export const setActive = async (req, res) => {
  const { id } = req.user;
  const { active } = req.body;

  if (!id || !active) {
    return res.status(400).json({ message: 'User ID and Active status are required' });
  }

  // if the role is coach check if the id is for student and assigned to one of the classes that the coach is assigned to
  if (req.user.role === 'coach') {
    // get student role id
    const studentRoleId = await prisma.role.findFirst({
      where: { roleName: 'student' }
    });
    if (!studentRoleId) {
      return res.status(400).json({ message: 'Student role not found' });
    }
    // check if the user is a student
    const checkStudent = await prisma.user.findUnique({
      where: { id: Number(id), roleId: studentRoleId.id }
    });
    if (!checkStudent) {
      return res.status(403).json({ message: 'You are not authorized to set active status for this user' });
    }
    // get all the classes that the coach is assigned to
    const coachClasses = await prisma.classCoach.findMany({
      where: { coachId: req.user.id },
      select: { classId: true }
    });
    // check if the student is assigned to one of the classes
    const studentClass = await prisma.classStudent.findFirst({
      where: { studentId: Number(id), classId: { in: coachClasses.map(c => c.classId) } }
    });
    if (!studentClass) {
      return res.status(403).json({ message: 'You are not authorized to set active status for this user' });
    }
  }



  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { active: active },
    });

    res.status(200).json({
      message: 'Active status updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Failed to set active:', error);
    res.status(500).json({ message: 'Failed to set active' });
  }
};
