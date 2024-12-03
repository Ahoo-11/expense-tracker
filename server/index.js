import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// In-memory storage (replace with a real database in production)
let transactions = [];
let users = [];

// Schemas
const TransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['EXPENSE', 'INCOME']),
  category: z.enum([
    'SALARY',
    'FREELANCE',
    'INVESTMENT',
    'FOOD',
    'TRANSPORT',
    'UTILITIES',
    'ENTERTAINMENT',
    'HEALTHCARE',
    'SHOPPING',
    'OTHER',
  ]),
  description: z.string(),
  date: z.string(),
  userId: z.string(),
});

// Middleware
const authenticate = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  next();
};

const isAdmin = (req, res, next) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Routes
app.post('/api/transactions', authenticate, async (req, res) => {
  try {
    const transaction = TransactionSchema.parse(req.body);
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...transaction,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/transactions', authenticate, (req, res) => {
  const userTransactions = transactions.filter((t) => t.userId === req.userId);
  res.json(userTransactions);
});

app.patch('/api/transactions/:id/status', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transaction.status = status;
  res.json(transaction);
});

// AI Insights endpoint (mock)
app.get('/api/insights', authenticate, (req, res) => {
  const userTransactions = transactions.filter((t) => t.userId === req.userId);
  
  // Mock insights based on transaction patterns
  const insights = [
    {
      type: 'SPENDING_PATTERN',
      message: 'Your food expenses have increased by 20% this month',
      impact: 'HIGH',
      category: 'FOOD',
    },
    {
      type: 'BUDGET_RECOMMENDATION',
      message: 'Consider setting a monthly entertainment budget of $200',
      impact: 'MEDIUM',
      category: 'ENTERTAINMENT',
    },
    {
      type: 'SAVING_OPPORTUNITY',
      message: 'You could save $150 by optimizing your utility usage',
      impact: 'LOW',
      category: 'UTILITIES',
    },
  ];

  res.json(insights);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});