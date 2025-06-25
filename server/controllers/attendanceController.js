import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudentAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        classStudentId: Number(id)
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        classStudent: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            class: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Attendance logs fetched successfully',
      data: attendanceLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch attendance logs',
      error: error.message
    });
  }
};

export const getStudentAttendanceByStudentId = async (req, res) => {
  const { studentId } = req.params;
  try {
    const classStudents = await prisma.classStudent.findMany({
      where: {
        studentId: Number(studentId)
      }
    });

    const classStudentIds = classStudents.map(cs => cs.id);
    
    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        classStudentId: {
          in: classStudentIds
        }
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        classStudent: {
          include: {
            class: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Attendance logs fetched successfully',
      data: attendanceLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch attendance logs',
      error: error.message
    });
  }
};

export const getClassAttendance = async (req, res) => {
  const { classId } = req.params;
  try {
    const classStudents = await prisma.classStudent.findMany({
      where: {
        classId: Number(classId)
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const classStudentIds = classStudents.map(cs => cs.id);
    
    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        classStudentId: {
          in: classStudentIds
        }
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        classStudent: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      message: 'Class attendance logs fetched successfully',
      data: attendanceLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch class attendance logs',
      error: error.message
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendanceLogs = await prisma.attendanceLog.findMany({
      include: {
        classStudent: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            class: {
              select: {
                id: true,
                section: true,
                sport: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json({
      message: 'Attendance logs fetched successfully',
      data: attendanceLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch attendance logs',
      error: error.message
    });
  }
};

export const addAttendance = async (req, res) => {
  const { classStudentId } = req.params;
  const { date, status, note } = req.body;
  if (classStudentId === "undefined" || !status || !date) {
    return res.status(400).json({
      message: 'ClassStudent ID and status are required'
    });
  }

  const validStatuses = ['attended', 'not_attended', 'with_report', 'day_off'];
  if (!validStatuses.includes(status)) {
    console.log(status);
    return res.status(400).json({
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
    });
  }

  try {
    console.log(classStudentId);

    const classStudent = await prisma.classStudent.findFirst({
      where: {
        id: Number(classStudentId)
      },
      include: {
        student: true
      }
    });

    // if the classStudent is not found, return 404
    if (!classStudent) {
      console.log('Class-Student relationship not found');
      return res.status(404).json({
        message: 'Class-Student relationship not found'
      });
    }

    const attendanceLog = await prisma.attendanceLog.create({
      data: {
        classStudentId: Number(classStudentId),
        date: date ? new Date(date) : new Date(),
        status,
        note
      }
    });

    res.status(201).json({
      message: 'Attendance log created successfully',
      data: attendanceLog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create attendance log',
      error: error.message
    });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (status) {
    const validStatuses = ['attended', 'not_attended', 'with_report', 'day_off'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
  }

  try {
    const updatedAttendanceLog = await prisma.attendanceLog.update({
      where: {
        id: Number(id)
      },
      data: {
        ...(status && { status }),
        ...(note !== undefined && { note })
      }
    });

    res.status(200).json({
      message: 'Attendance log updated successfully',
      data: updatedAttendanceLog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update attendance log',
      error: error.message
    });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.attendanceLog.delete({
      where: {
        id: Number(id)
      }
    });

    res.status(200).json({
      message: 'Attendance log deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete attendance log',
      error: error.message
    });
  }
}; 