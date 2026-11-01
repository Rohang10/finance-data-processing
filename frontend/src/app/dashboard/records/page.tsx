'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFinancialRecords, createFinancialRecord, deleteFinancialRecord } from '@/lib/api';
import { FinancialRecord } from '@/types';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
  Receipt,
  FileText,
  DollarSign,
  Shield,
  Layers,
} from 'lucide-react';

const CATEGORY_PRESETS = [
  'Enterprise Cloud Infrastructure',
  'SaaS Enterprise Subscriptions',
  'Executive Payroll & Benefits',
  'Global Marketing & Growth',
  'Legal, Compliance & Auditing',
  'Professional Services',
  'Office & Facilities',
  'Hardware & Equipment',
  'Other Corporate Operating',
];

export default function RecordsPage() {
  const { user, isLoading } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: CATEGORY_PRESETS[0],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const role = user?.role || 'admin';
  const canModify = role === 'admin' || role === 'analyst';

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getFinancialRecords({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      setRecords(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      loadRecords();
    }
  }, [typeFilter, categoryFilter, user, isLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setSubmitError('Please enter a valid amount greater than zero.');
      setSubmitting(false);
      return;
    }

    try {
      await createFinancialRecord({
        amount: amountNum,
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
      });

      setSuccessMsg('Record added successfully to PostgreSQL ledger!');
      setModalOpen(false);
      setFormData({
        amount: '',
        type: 'expense',
        category: CATEGORY_PRESETS[0],
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadRecords();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to record transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft-delete this record? (Data will be marked with deleted_at)')) {
      return;
    }

    try {
      await deleteFinancialRecord(id);
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  // Filter records in memory based on search query
  const filteredRecords = records.filter((r) => {
    const q = search.toLowerCase();
    const matchCat = r.category.toLowerCase().includes(q);
    const matchNotes = (r.notes || '').toLowerCase().includes(q);
    const matchName = (r.creator_name || '').toLowerCase().includes(q);
    return matchCat || matchNotes || matchName;
  });

  const effectiveItemsPerPage = itemsPerPage === 'all' ? (filteredRecords.length > 0 ? filteredRecords.length : 1) : itemsPerPage;
  const totalPages = Math.ceil(filteredRecords.length / effectiveItemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * effectiveItemsPerPage,
    currentPage * effectiveItemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Transaction Ledger & Audit</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40 dark:shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              Soft-Delete Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transaction records stored with NUMERIC(15,2) decimal precision.
          </p>
        </div>

        {canModify ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 dark:shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Viewer: Read-Only Ledger</span>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl glass-card p-4 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search category, notes, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-orange-400 shadow-[0_0_8px_rgba(37,99,235,0.15)] dark:shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {CATEGORY_PRESETS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Created By</th>
                {canModify && <th className="py-3 px-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-slate-400">
                    No transactions match your criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => {
                  const isIncome = rec.type === 'income';
                  const amount = typeof rec.amount === 'number' ? rec.amount : parseFloat(rec.amount);

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {new Date(rec.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {rec.type.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {rec.category}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'}>
                          {isIncome ? '+' : '-'}
                          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {rec.notes || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {rec.creator_name || 'System User'}
                      </td>

                      {canModify && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Soft-delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredRecords.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-slate-500 flex items-center gap-3">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-shadow"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value="all">All Records</option>
              </select>
              <span>
                Showing <span className="font-medium">{(currentPage - 1) * effectiveItemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * effectiveItemsPerPage, filteredRecords.length)}
                </span>{' '}
                of <span className="font-medium">{filteredRecords.length}</span> results
              </span>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium disabled:opacity-50 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border transition-colors shrink-0 ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 dark:bg-orange-600 dark:border-orange-600 text-white font-bold shadow-sm shadow-blue-600/20 dark:shadow-[0_0_10px_rgba(234,88,12,0.3)]'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium disabled:opacity-50 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-500 dark:text-orange-500" />
                <span>Record New Financial Transaction</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formData.type === 'income'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Income / Inflow</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formData.type === 'expense'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Expense / Outflow</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Effective Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Accounting Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Q4 vendor contract renewal"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-bold shadow-md shadow-blue-600/30 dark:shadow-[0_4px_16px_rgba(234,88,12,0.4)] disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Recording...' : 'Commit to Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
