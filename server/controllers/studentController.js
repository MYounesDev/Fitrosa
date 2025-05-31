import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

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

    // TODO: Add session and section filters
    // TO-DO: if user is admin, show all students
    // TO-DO: if user is coach, show students of the class


    const students = await prisma.user.findMany({
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
        session: true,
        section: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

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
        session: true,
        section: true,
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

    const studentRole = await prisma.role.findFirst({
      where: { roleName: 'student' }
    });

    if (!studentRole) {
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

    const newStudent = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        genderId,
        session,
        section,
        roleId: studentRole.id,
        active: true
      },
      include: {
        role: true,
        gender: true
      }
    });

    const { password: _, ...studentData } = newStudent;

    res.status(201).json({
      message: 'Student added successfully',
      data: {
        ...studentData,
        temporaryPassword
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to add student',
      error: error.message
    });
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
        session: true,
        section: true,
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