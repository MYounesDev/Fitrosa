import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to log authentication attempts
export const logAuthAttempt = async (logData) => {
    try {
        await prisma.authLog.create({
            data: logData
        });
    } catch (error) {
        console.error('Error logging auth attempt:', error);
    }
}; 