export type RoleType = 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status?: 'active' | 'inactive';
  created_at?: string;
}

export interface FinancialRecord {
  id: string;
  amount: number | string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
  created_by?: string;
  deleted_at?: string | null;
  created_at?: string;
  creator_name?: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recordCount: number;
  savingsRate?: number;
}

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expenses: number;
  net?: number;
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
  percentage?: number;
  type?: 'income' | 'expense';
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'checking';
  database: 'connected' | 'disconnected';
  latency: string;
  server_time?: string;
  database_name?: string;
}
