import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSports = async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({
      select: {
        id: true,
        sportName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'Sports fetched successfully',
      sports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch sports',
      error: error.message
    });
  }
};

export const getSport = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      message: 'Sport ID is required'
    });
  }


  try {
    const sport = await prisma.sport.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        sportName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!sport) {
      return res.status(404).json({
        message: 'Sport not found'
      });
    }

    res.status(200).json({
      message: 'Sport fetched successfully',
      data: sport
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch sport',
      error: error.message
    });
  }
};

export const createSport = async (req, res) => {
  const { sportName } = req.body;
  
  if (!sportName) {
    return res.status(400).json({
      message: 'Sport name is required'
    });
  }

  try {
    const existingSport = await prisma.sport.findFirst({
      where: { sportName }
    });

    if (existingSport) {
      return res.status(400).json({
        message: 'Sport with this name already exists'
      });
    }

    const sport = await prisma.sport.create({
      data: { 
        sportName 
      }
    });

    res.status(201).json({
      message: 'Sport created successfully',
      data: sport
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create sport',
      error: error.message
    });
  }
};

export const updateSport = async (req, res) => {
  const { id } = req.params;
  const { sportName } = req.body;
  
  if (!sportName || !id) {
    return res.status(400).json({
      message: 'Sport name and ID are required'
    });
  }

  try {
    const sport = await prisma.sport.findUnique({
      where: { id: Number(id) }
    });

    if (!sport) {
      return res.status(404).json({
        message: 'Sport not found'
      });
    }

    const updatedSport = await prisma.sport.update({
      where: { id: Number(id) },
      data: { sportName }
    });

    res.status(200).json({
      message: 'Sport updated successfully',
      data: updatedSport
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update sport',
      error: error.message
    });
  }
};

export const deleteSport = async (req, res) => {
  const { id } = req.params;
 
  if (!id) {
    return res.status(400).json({
      message: 'Sport ID is required'
    });
  }

  try {
    const sport = await prisma.sport.findUnique({
      where: { id: Number(id) },
      include: {
        classes: true
      }
    });

    if (!sport) {
      return res.status(404).json({
        message: 'Sport not found'
      });
    }

    // Delete all classes related to this sport
    await prisma.$transaction([
      prisma.classCoach.deleteMany({
        where: {
          class: {
            sportId: Number(id)
          }
        }
      }),
      prisma.classStudent.deleteMany({
        where: {
          class: {
            sportId: Number(id)
          }
        }
      }),
      prisma.class.deleteMany({
        where: {
          sportId: Number(id)
        }
      }),
      prisma.sport.delete({
        where: { id: Number(id) }
      })
    ]);

    res.status(200).json({
      message: 'Sport and all related classes deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete sport',
      error: error.message
    });
  }
}; 