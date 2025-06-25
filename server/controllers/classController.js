import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllClasses = async (req, res) => {
  try {
    // Define the base query structure
    const baseQuery = {
      include: {
        sport: {
          select: {
            sportName: true
          }
        },
        coaches: {
          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    };

    // Add role-specific filtering
    if (req.user.role === 'coach') {
      baseQuery.where = {
        coaches: {
          some: {
            coachId: req.user.id
          }
        }
      };
    }

    const classes = await prisma.class.findMany(baseQuery);

    // Transform data to make it easier to use on frontend
    const transformedClasses = classes.map(classItem => ({
      id: classItem.id,
      sportId: classItem.sportId,
      sportName: classItem.sport.sportName,
      section: classItem.section,
      hasCoach: classItem.coaches.length > 0,
      coach: classItem.coaches[0]?.coach || null,
      createdAt: classItem.createdAt,
      updatedAt: classItem.updatedAt
    }));

    res.status(200).json({
      message: 'Classes fetched successfully',
      classes: transformedClasses
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      message: 'Failed to fetch classes',
      error: error.message
    });
  }
};

export const getClass = async (req, res) => {
  const { id } = req.params;
  //  if the role is coach check if the class is is pointing to a class that coach assigned to , if not return error code
  if (req.user.role === 'coach') {
    const checkCoach = await prisma.classCoach.findFirst({
      where: {
        coachId: req.user.id,
        classId: Number(id)
      }
    });
    if (!checkCoach) {
      return res.status(403).json({
        message: 'You are not authorized to access this class'
      });
    }
  }
  try {
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: {
        sport: {
          select: {
            sportName: true
          }
        },
        coaches: {
          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            attendanceLogs: true
          }
        }
      }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Transform data to make it easier to use on frontend
    const transformedClass = {
      id: classData.id,
      sportId: classData.sportId,
      sportName: classData.sport.sportName,
      section: classData.section,
      hasCoach: classData.coaches.length > 0,
      coach: classData.coaches[0]?.coach || null,
      students: classData.students.map(cs => ({
        ...cs.student,
        classStudentId: cs.id
      })),
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt
    };

    res.status(200).json({
      message: 'Class fetched successfully',
      data: transformedClass
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch class',
      error: error.message
    });
  }
};

export const createClass = async (req, res) => {
  const { sportId, section, coachId } = req.body;
  
  if (!sportId || !section) {
    // coachId is not required (the class can be created without a coach, and add the coach later)
    return res.status(400).json({
      message: 'Sport ID and section are required'
    });
  }

  try {
    // Verify sport exists
    const sport = await prisma.sport.findUnique({
      where: { id: Number(sportId) }
    });

    if (!sport) {
      return res.status(400).json({
        message: 'Invalid sport selected'
      });
    }

    // Check if coach exists when provided
    if (coachId) {
      const coachRole = await prisma.role.findFirst({
        where: { roleName: 'coach' }
      });
      
      if (!coachRole) {
        return res.status(500).json({
          message: 'Coach role not found'
        });
      }

      const coach = await prisma.user.findFirst({
        where: { 
          id: Number(coachId),
          roleId: coachRole.id
        }
      });

      if (!coach) {
        return res.status(400).json({
          message: 'Invalid coach selected'
        });
      }
    }
    // check if the class already exists
    const checkClass = await prisma.class.findFirst({
      where: { sportId: Number(sportId), section: section }
    });
    if (checkClass) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const newClass = await prisma.class.create({
      data: {
        sportId: Number(sportId),
        section
      }
    });

    // If coach is provided, assign them to the class
    if (coachId) {
      await prisma.classCoach.create({
        data: {
          classId: newClass.id,
          coachId: Number(coachId)
        }
      });
    }

    res.status(201).json({
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create class',
      error: error.message
    });
  }
};

export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { sportId, section } = req.body;
  
  try {
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Validate sport if provided
    if (sportId) {
      const sport = await prisma.sport.findUnique({
        where: { id: Number(sportId) }
      });

      if (!sport) {
        return res.status(400).json({
          message: 'Invalid sport selected'
        });
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data: {
        sportId: sportId ? Number(sportId) : undefined,
        section: section || undefined
      }
    });

    res.status(200).json({
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update class',
      error: error.message
    });
  }
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  
  try {
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Delete class and all related relations
    await prisma.$transaction([
      prisma.classCoach.deleteMany({
        where: { classId: Number(id) }
      }),
      prisma.classStudent.deleteMany({
        where: { classId: Number(id) }
      }),
      prisma.class.delete({
        where: { id: Number(id) }
      })
    ]);

    res.status(200).json({
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete class',
      error: error.message
    });
  }
};

export const assignCoach = async (req, res) => {
  const { id } = req.params;
  const { coachId } = req.body;
  
  if (!coachId) {
    return res.status(400).json({
      message: 'Coach ID is required'
    });
  }

  try {
    // Verify class exists
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Verify coach exists
    const coachRole = await prisma.role.findFirst({
      where: { roleName: 'coach' }
    });
    
    if (!coachRole) {
      return res.status(500).json({
        message: 'Coach role not found'
      });
    }

    const coach = await prisma.user.findFirst({
      where: { 
        id: Number(coachId),
        roleId: coachRole.id
      }
    });

    if (!coach) {
      return res.status(400).json({
        message: 'Invalid coach selected'
      });
    }

    // Check if the class already has a coach
    const existingCoach = await prisma.classCoach.findFirst({
      where: { classId: Number(id) }
    });

    if (existingCoach) {
      // Update existing coach
      await prisma.classCoach.update({
        where: { id: existingCoach.id },
        data: { coachId: Number(coachId) }
      });
    } else {
      // Create new coach assignment
      await prisma.classCoach.create({
        data: {
          classId: Number(id),
          coachId: Number(coachId)
        }
      });
    }

    res.status(200).json({
      message: 'Coach assigned successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to assign coach',
      error: error.message
    });
  }
};

export const getUnassignedClasses = async (req, res) => {
  try {
    // Find classes that don't have any entry in ClassCoach table
    const allClasses = await prisma.class.findMany({
      include: {
        sport: {
          select: {
            sportName: true
          }
        },
        coaches: true
      }
    });

    const unassignedClasses = allClasses
      .filter(c => c.coaches.length === 0)
      .map(c => ({
        id: c.id,
        sportId: c.sportId,
        sportName: c.sport.sportName,
        section: c.section,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));

    res.status(200).json({
      message: 'Unassigned classes fetched successfully',
      classes: unassignedClasses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch unassigned classes',
      error: error.message
    });
  }
};

export const assignStudent = async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;

  if(!studentId || !id) {
    return res.status(400).json({
      message: 'Student ID and Class ID are required'
    });
  }

  // if the role is coach check if the class is is pointing to a class that coach assigned to , if not return error code
  if (req.user.role === 'coach') {
    const checkCoach = await prisma.classCoach.findFirst({
      where: { coachId: req.user.id, classId: Number(id) }
    });
    if (!checkCoach) {
      return res.status(403).json({
        message: 'You are not authorized to access this class'
      });
    }
    
    // check if the student is assigend to one of the classes that the coach is assigned to

    // get all the classes that the coach is assigned to  
    const coachClasses = await prisma.classCoach.findMany({
      where: { coachId: req.user.id },
      select: { classId: true }
    });

    const checkStudentClass = await prisma.classStudent.findFirst({
      where: { studentId: Number(studentId), classId: { in: coachClasses.map(c => c.classId) } }
    });
    if (!checkStudentClass) {
      return res.status(403).json({
        message: 'You are not authorized to assign this student'
      });
    }
  }


    // check if the student is already assigned to the class
    const checkStudent = await prisma.classStudent.findFirst({
      where: { studentId: Number(studentId), classId: Number(id) }
    });
    if (checkStudent) {
      return res.status(400).json({
        message: 'Student is already assigned to this class'
      });
    }



  try {
    // Verify class exists
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Verify student exists
    const studentRole = await prisma.role.findFirst({
      where: { roleName: 'student' }
    });
    
    if (!studentRole) {
      return res.status(500).json({
        message: 'Student role not found'
      });
    }

    const student = await prisma.user.findFirst({
      where: { 
        id: Number(studentId),
        roleId: studentRole.id
      }
    });

    if (!student) {
      return res.status(400).json({
        message: 'Invalid student selected'
      });
    }

    // Check if student is already assigned to this class
    const existingAssignment = await prisma.classStudent.findFirst({
      where: {
        classId: Number(id),
        studentId: Number(studentId)
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Student is already assigned to this class'
      });
    }

    // Create new student assignment
    await prisma.classStudent.create({
      data: {
        classId: Number(id),
        studentId: Number(studentId)
      }
    });

    res.status(200).json({
      message: 'Student assigned successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to assign student',
      error: error.message
    });
  }
};

export const removeStudent = async (req, res) => {
  const { id, studentId } = req.params;
  // if the role is coach check if the class is is pointing to a class that coach assigned to , if not return error code
  if (req.user.role === 'coach') {
    const checkCoach = await prisma.classCoach.findFirst({
      where: { coachId: req.user.id, classId: Number(id) }
    });
    if (!checkCoach) {
      return res.status(403).json({
        message: 'You are not authorized to access this class'
      });
    }
  }


  try {
    // Check if the assignment exists
    const assignment = await prisma.classStudent.findFirst({
      where: {
        classId: Number(id),
        studentId: Number(studentId)
      }
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'Student is not assigned to this class'
      });
    }

    // Remove the student from the class
    await prisma.classStudent.delete({
      where: { id: assignment.id }
    });

    res.status(200).json({
      message: 'Student removed from class successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to remove student from class',
      error: error.message
    });
  }
}; 