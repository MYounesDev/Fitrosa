import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all financial transactions
export const getAllTransactions = async (req, res) => {
  try {
    const {transaction_type, user_id, min_amount, max_amount, currency, start_date, end_date, search} = req.query;

    // Build the where clause based on filters
    const where = {};

    // Filter by transaction type
    if (transaction_type) {
      where.transaction_type = transaction_type;
    }

    // Filter by user ID
    if (user_id) {
      where.user_id = parseInt(user_id);
    }

    // Filter by amount range
    if (min_amount || max_amount) {
      where.amount = {};
      if (min_amount) {
        where.amount.gte = parseFloat(min_amount);
      }
      if (max_amount) {
        where.amount.lte = parseFloat(max_amount);
      }
    }

    // Filter by currency
    if (currency) {
      where.currency = currency;
    }

    // Filter by date range
    if (start_date || end_date) {
      where.transaction_date = {};
      if (start_date) {
        where.transaction_date.gte = new Date(start_date);
      }
      if (end_date) {
        // Set the end date to the end of the day
        const endDateObj = new Date(end_date);
        endDateObj.setHours(23, 59, 59, 999);
        where.transaction_date.lte = endDateObj;
      }
    }

    // Search in description
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive' // Case-insensitive search
      };
    }

    const transactions = await prisma.financialTransaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                id: true,
                roleName: true
              }
            },
            gender: true,
            profileImage: true,
            active: true,
          }
        }
      },
      orderBy: {
        transaction_date: 'desc'
      }
    });


    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};



// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const {transaction_type, user_id, amount, currency, description, transaction_date} = req.body;
    
    // Validate required fields
    if (!transaction_type || !amount || !currency || !description || !transaction_date) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields: transaction_type, amount, currency, description, transaction_date'
      });
    }

    if (!['income', 'expense', 'loss', 'salary', 'other'].includes(transaction_type)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid transaction type'
      });
    }

    if (['expense', 'loss', 'salary'].includes(transaction_type) && amount > 0){
      return res.status(400).json({
        status: 'fail',
        message: 'Amount must be negative for expense, loss, and salary transactions'
      });
    }

    if (['income'].includes(transaction_type) && amount < 0){
      return res.status(400).json({
        status: 'fail',
        message: 'Amount must be positive for income transactions'
      });
    }

    const newTransaction = await prisma.financialTransaction.create({
      data: {
        transaction_type,
        user_id: user_id ? parseInt(user_id) : null,
        amount: parseFloat(amount),
        currency,
        description,
        transaction_date: new Date(transaction_date)
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                id: true,
                roleName: true
              }
            }
          }
        }
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: newTransaction
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const {transaction_type, user_id, amount, currency, description, transaction_date} = req.body;
    
    const updatedTransaction = await prisma.financialTransaction.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        transaction_type: transaction_type,
        user_id: user_id ? parseInt(user_id) : null,
        amount: amount ? parseFloat(amount) : undefined,
        currency: currency,
        description: description,
        transaction_date: transaction_date ? new Date(transaction_date) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                id: true,
                roleName: true
              }
            },
            gender: true,
            profileImage: true,
            active: true,
          }
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    await prisma.financialTransaction.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get financial summary (totals by type, currency, etc.)
export const getFinancialSummary = async (req, res) => {
  try {
    // Get period from query parameter (all, year, month, week, day)
    const period = req.query.period || 'all';
    
    // Determine date filters based on period
    const dateFilter = {};
    const today = new Date();
    
    if (period !== 'all') {
      dateFilter.gte = new Date();
      
      if (period === 'year') {
        dateFilter.gte.setMonth(0, 1);
        dateFilter.gte.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        dateFilter.gte.setDate(1);
        dateFilter.gte.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        const day = dateFilter.gte.getDay();
        const diff = dateFilter.gte.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        dateFilter.gte.setDate(diff);
        dateFilter.gte.setHours(0, 0, 0, 0);
      } else if (period === 'day') {
        dateFilter.gte.setHours(0, 0, 0, 0);
      }
    }

    // Get all transactions for reference
    const allTransactions = await prisma.financialTransaction.count({
      where: period !== 'all' ? { 
        transaction_date: dateFilter 
      } : undefined
    });
    
    // Get total income
    const incomeTotal = await prisma.financialTransaction.aggregate({
      where: {
        transaction_type: {
          in: ['income']
        },
        amount: {
          gt: 0
        },
        ...(period !== 'all' && { transaction_date: dateFilter })
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // Get total expenses
    const expenseTotal = await prisma.financialTransaction.aggregate({
      where: {
        transaction_type: {
          in: ['expense', 'loss', 'salary']
        },
        amount: {
          lt: 0
        },
        ...(period !== 'all' && { transaction_date: dateFilter })
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // Get totals by transaction type
    const typeBreakdown = await prisma.financialTransaction.groupBy({
      by: ['transaction_type'],
      where: period !== 'all' ? { 
        transaction_date: dateFilter 
      } : undefined,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // Get totals by currency
    const currencyBreakdown = await prisma.financialTransaction.groupBy({
      by: ['currency'],
      where: period !== 'all' ? { 
        transaction_date: dateFilter 
      } : undefined,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // Get monthly summary for the current year
    const currentYear = new Date().getFullYear();
    const monthlySummary = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const month = i + 1;
        const startDate = new Date(currentYear, i, 1);
        const endDate = new Date(currentYear, i + 1, 0);
        
        const monthlyIncome = await prisma.financialTransaction.aggregate({
          where: {
            transaction_date: {
              gte: startDate,
              lte: endDate
            },
            amount: {
              gt: 0
            }
          },
          _sum: {
            amount: true
          },
          _count: {
            id: true
          }
        });
        
        const monthlyExpense = await prisma.financialTransaction.aggregate({
          where: {
            transaction_date: {
              gte: startDate,
              lte: endDate
            },
            amount: {
              lt: 0
            }
          },
          _sum: {
            amount: true
          },
          _count: {
            id: true
          }
        });
        
        return {
          month,
          income: monthlyIncome._sum.amount || 0,
          expense: monthlyExpense._sum.amount || 0,
          incomeCount: monthlyIncome._count.id || 0,
          expenseCount: monthlyExpense._count.id || 0,
          net: (monthlyIncome._sum.amount || 0) + (monthlyExpense._sum.amount || 0)
        };
      })
    );
    
    // Get recent transactions
    const recentTransactions = await prisma.financialTransaction.findMany({
      take: 5,
      orderBy: {
        transaction_date: 'desc'
      },
      where: period !== 'all' ? { 
        transaction_date: dateFilter 
      } : undefined,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                id: true,
                roleName: true
              }
            }
          }
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      period,
      data: {
        totalTransactions: allTransactions,
        incomeTotal: {
          amount: incomeTotal._sum.amount || 0,
          count: incomeTotal._count.id || 0
        },
        expenseTotal: {
          amount: expenseTotal._sum.amount || 0,
          count: expenseTotal._count.id || 0
        },
        netTotal: (incomeTotal._sum.amount || 0) + (expenseTotal._sum.amount || 0),
        typeBreakdown,
        currencyBreakdown,
        monthlySummary,
        recentTransactions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
