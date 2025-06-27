import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all auth logs with pagination
export const getAuthLogs = async (req, res) => {
    try {

        
        const [logs, total] = await Promise.all([
            prisma.authLog.findMany({

                orderBy: {
                    created_at: 'desc'
                }
            }),
            prisma.authLog.count()
        ]);

        res.status(200).json({
            data: {
                logs,
                total,
            }
        });
    } catch (error) {
        console.error('Error fetching auth logs:', error);
        res.status(500).json({ message: 'Error fetching auth logs' });
    }
};

