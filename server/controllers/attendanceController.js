import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudentAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        studentId: Number(id)
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

export const getAllAttendance = async (req, res) => {
  try {
    const attendanceLogs = await prisma.attendanceLog.findMany({
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true
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
  const { id } = req.params;
  const { date, status, note } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      message: 'Student ID and status are required'
    });
  }

  const validStatuses = ['attended', 'not_attended', 'with_report', 'day_off'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
    });
  }

  try {
    const student = await prisma.user.findFirst({
      where: {
        id: Number(id),
        role: {
          roleName: 'student'
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    const attendanceLog = await prisma.attendanceLog.create({
      data: {
        studentId: Number(id),
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