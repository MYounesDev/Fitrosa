import { PrismaClient } from '@prisma/client';
import { sendPasswordSetupEmail, generatePasswordSetupToken } from '../utils/emailService.js';

const prisma = new PrismaClient();

export const getAllStudents = async (req, res) => {
  try {
    const studentRoleId = (await prisma.role.findFirst({
      where: { roleName: 'student' }
    })).id;

    if (!studentRoleId) {
      return res.status(500).json({
        message: 'Role configuration error'
      });
    }

    // Check if the requesting user is a coach
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let students = [];

    if (userRole === 'coach' && userId) {
      // Find classes assigned to the coach
      const coachClasses = await prisma.classCoach.findMany({
        where: { coachId: userId },
        select: { classId: true }
      });
      
      const classIds = coachClasses.map(cc => cc.classId);
      
      if (classIds.length === 0) {
        // Coach has no classes assigned
        students = [];
      } else {
        // Find students assigned to those classes
        const studentIds = await prisma.classStudent.findMany({
          where: { 
            classId: { 
              in: classIds 
            } 
          },
          select: { studentId: true }
        });
        
        const uniqueStudentIds = [...new Set(studentIds.map(s => s.studentId))];
        
        // Get the actual student data
        students = await prisma.user.findMany({
          where: { 
            id: { in: uniqueStudentIds },
            roleId: studentRoleId
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
            active: true,
            createdAt: true,
            updatedAt: true
          }
        });
      }
    } else {
      // For admin or other roles, show all students
      students = await prisma.user.findMany({
        where: { 
          roleId: studentRoleId
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
          active: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }

    res.status(200).json({
      message: 'Students fetched successfully',
      students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

export const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.user.findFirst({
      where: { 
        id: Number(id),
        role: {
          roleName: 'student'
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
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    const transformedStudent = {
      ...student,
      role: student.role.roleName,
      gender: student.gender?.genderName || null
    };

    res.status(200).json({
      message: 'Student fetched successfully',
      data: transformedStudent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      gender,
      birthDate,
      parentName,
      parentPhone,
      notes,
      classId 
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const studentRole = await prisma.role.findFirst({
      where: { roleName: 'student' }
    });

    if (!studentRole) {
      return res.status(500).json({ message: 'Student role not found' });
    }

    const genderId = (await prisma.gender.findFirst({
      where: { genderName: gender }
    })).id;

    if (!genderId) {
      return res.status(400).json({ message: 'Invalid gender selected' });
    }
    
    

    // Verify class exists
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId }
      });

      if (!classExists) {
        return res.status(400).json({ message: 'Invalid class selected' });
      }
    }

    const passwordSetupToken = generatePasswordSetupToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const student = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        roleId: studentRole.id,
        genderId: genderId,
        birthDate,
        parentName,
        parentPhone,
        notes,
        startDate: new Date(),
        passwordResetToken: passwordSetupToken,
        passwordResetExpires: tokenExpires,
        active: false
      },
    });

    // If class is specified, create the class-student relationship
    if (classId) {
      await prisma.classStudent.create({
        data: {
          classId,
          studentId: student.id
        }
      });
    }

    const emailSent = await sendPasswordSetupEmail(email, passwordSetupToken,firstName);

    if (!emailSent) {
      await prisma.user.delete({ where: { id: student.id } });
      return res.status(500).json({ message: 'Failed to send activation email' });
    }

    res.status(201).json({ 
      message: 'Student account created. Please check email to activate account.',
      studentId: student.id 
    });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Error creating student account' });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    const updatedStudent = await prisma.user.update({
      where: { 
        id: Number(id),
        role: 'student'
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
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update student',
      error: error.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.user.delete({
      where: { 
        id: Number(id),
        role: 'student'
      }
    });
    res.status(200).json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete student',
      error: error.message
    });
  }
}; 