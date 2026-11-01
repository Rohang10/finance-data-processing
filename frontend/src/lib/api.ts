import { DashboardSummary, FinancialRecord, MonthlyTrendItem, CategoryBreakdownItem, SystemHealth, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('finance_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponseError(res: Response, defaultMessage: string) {
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finance_token');
      localStorage.removeItem('finance_user');
      window.location.href = '/login';
    }
  }
  const errorData = await res.json().catch(() => ({}));
  throw new Error(errorData.error || errorData.message || defaultMessage);
}

// ─── Health API ─────────────────────────────────────────────────────────────
export async function getSystemHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// ─── Authentication API ─────────────────────────────────────────────────────
export async function loginApi(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to authenticate');
  }
  return await res.json();
}

export async function signupApi(name: string, email: string, password: string, role: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to register account');
  }
  return await res.json();
}

// ─── Dashboard APIs ─────────────────────────────────────────────────────────
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) await handleResponseError(res, 'Failed to fetch dashboard summary');
  const json = await res.json();
  const dbData = json.data || {};
  const income = parseFloat(dbData.total_income) || 0;
  const expenses = parseFloat(dbData.total_expenses) || 0;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  return {
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: parseFloat(dbData.net_balance) || (income - expenses),
    recordCount: parseInt(dbData.total_records) || 0,
    savingsRate,
  };
}

export async function getMonthlyTrend(): Promise<MonthlyTrendItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/monthly-trend`, {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) await handleResponseError(res, 'Failed to fetch monthly trend');
  const json = await res.json();
  const arr = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  return arr.map((d: any) => ({
    month: d.month,
    income: parseFloat(String(d.income)) || 0,
    expenses: parseFloat(String(d.expense || d.expenses)) || 0,
    net: parseFloat(String(d.net)) || ((parseFloat(String(d.income)) || 0) - (parseFloat(String(d.expense || d.expenses)) || 0)),
  }));
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdownItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/by-category`, {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) await handleResponseError(res, 'Failed to fetch category breakdown');
  const json = await res.json();
  const arr = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  return arr.map((d: any) => ({
    category: d.category,
    total: parseFloat(String(d.total)) || 0,
    type: (d.type as 'income' | 'expense') || 'expense',
  }));
}

// ─── Financial Records APIs ─────────────────────────────────────────────────
export async function getFinancialRecords(params?: { type?: string; category?: string; search?: string }): Promise<FinancialRecord[]> {
  const url = new URL(`${API_BASE_URL}/api/records`);
  if (params?.type) url.searchParams.append('type', params.type);
  if (params?.category) url.searchParams.append('category', params.category);

  const res = await fetch(url.toString(), {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) await handleResponseError(res, 'Failed to fetch records');
  
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
}

export async function createFinancialRecord(record: {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}): Promise<FinancialRecord> {
  const res = await fetch(`${API_BASE_URL}/api/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to create record (${res.status})`);
  }
  return await res.json();
}

export async function deleteFinancialRecord(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/records/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to delete record');
  }
  return true;
}

// ─── Users API (Admin) ──────────────────────────────────────────────────────
export async function getUsersApi(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return Array.isArray(data) ? data : data.users || [];
}

// ─── Upload API ─────────────────────────────────────────────────────────────
export async function uploadStatementApi(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('statement', file);

  const res = await fetch(`${API_BASE_URL}/api/upload/statement`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to parse statement');
  }
  return await res.json();
}
