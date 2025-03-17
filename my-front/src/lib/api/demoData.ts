
import { v4 as uuidv4 } from 'uuid';
import { User, Transaction } from './types';
import { saveToken } from './apiClient';

// Demo users
const demoUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: 'https://i.pravatar.cc/150?u=john'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profileImage: 'https://i.pravatar.cc/150?u=jane'
  }
];

// Demo transactions
const demoTransactions: Record<string, Transaction[]> = {
  '1': [
    {
      id: '101',
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      description: 'Grocery Shopping',
      amount: 65.50,
      type: 'expense',
      category: 'food'
    },
    {
      id: '102',
      date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      description: 'Salary',
      amount: 3200,
      type: 'income',
      category: 'work'
    },
    {
      id: '103',
      date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
      description: 'Netflix Subscription',
      amount: 12.99,
      type: 'expense',
      category: 'entertainment'
    },
    {
      id: '104',
      date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      description: 'Freelance Payment',
      amount: 850,
      type: 'income',
      category: 'work'
    },
    {
      id: '105',
      date: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
      description: 'Restaurant',
      amount: 45.80,
      type: 'expense',
      category: 'food'
    }
  ],
  '2': [
    {
      id: '201',
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      description: 'Office Supplies',
      amount: 28.75,
      type: 'expense',
      category: 'work'
    },
    {
      id: '202',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      description: 'Consulting Fee',
      amount: 1200,
      type: 'income',
      category: 'work'
    }
  ]
};

// Generate a demo JWT token
const generateToken = (userId: string) => {
  return `demo-jwt-${userId}-${Date.now()}`;
};

// Demo API handlers
interface DemoHandler {
  url: string;
  method: string;
  handler: (body?: any, token?: string | null) => any;
}

export const demoHandlers: DemoHandler[] = [
  {
    url: '/api/register',
    method: 'POST',
    handler: (body) => {
      // Check if email is already taken
      if (demoUsers.some(user => user.email === body.email)) {
        throw new Error('Email is already taken');
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        profileImage: `https://i.pravatar.cc/150?u=${body.email}`
      };
      
      demoUsers.push(newUser);
      
      // Generate token
      const token = generateToken(newUser.id);
      saveToken(token);
      
      return {
        user: newUser,
        token
      };
    }
  },
  {
    url: '/api/login',
    method: 'POST',
    handler: (body) => {
      // In demo mode, any email works with any password as long as the email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        throw new Error('Invalid email format');
      }
      
      // Find user or use the first demo user
      let user = demoUsers.find(u => u.email === body.email);
      
      if (!user) {
        user = demoUsers[0];
      }
      
      // Generate token
      const token = generateToken(user.id);
      saveToken(token);
      
      return {
        user,
        token
      };
    }
  },
  {
    url: '/api/logout',
    method: 'POST',
    handler: () => {
      return { success: true };
    }
  },
  {
    url: '/api/users/me',
    method: 'GET',
    handler: (_, token) => {
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Extract user ID from token
      const matches = token.match(/demo-jwt-(.*?)-/);
      const userId = matches ? matches[1] : '1';
      
      const user = demoUsers.find(u => u.id === userId) || demoUsers[0];
      
      return {
        user
      };
    }
  }
];

// Add dynamic transaction handlers
demoHandlers.push({
  url: '/api/users/:id/transactions',
  method: 'GET',
  handler: (_, token) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Extract user ID from token
    const matches = token.match(/demo-jwt-(.*?)-/);
    const userId = matches ? matches[1] : '1';
    
    return {
      transactions: demoTransactions[userId] || []
    };
  }
});

demoHandlers.push({
  url: '/api/users/:id/transactions',
  method: 'POST',
  handler: (body, token) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Extract user ID from token
    const matches = token.match(/demo-jwt-(.*?)-/);
    const userId = matches ? matches[1] : '1';
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString(),
      description: body.description,
      amount: body.amount,
      type: body.type,
      category: body.category || 'other'
    };
    
    // Initialize user transactions array if it doesn't exist
    if (!demoTransactions[userId]) {
      demoTransactions[userId] = [];
    }
    
    // Add new transaction
    demoTransactions[userId].unshift(newTransaction);
    
    return {
      transaction: newTransaction
    };
  }
});
