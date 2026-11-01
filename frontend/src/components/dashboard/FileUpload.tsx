'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

import { uploadStatementApi, createFinancialRecord } from '@/lib/api';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultData, setResultData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateCategory = (index: number, newCategory: string) => {
    const updatedTransactions = [...resultData.transactions];
    updatedTransactions[index].category = newCategory;
    setResultData({ ...resultData, transactions: updatedTransactions });
  };

  const handleSaveToLedger = async () => {
    if (!resultData?.transactions) return;
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      // Save all transactions sequentially (or in parallel if backend supports bulk)
      for (const tx of resultData.transactions) {
        const rawAmount = String(tx.amount).replace(/[^0-9.-]+/g, '');
        await createFinancialRecord({
          date: tx.date,
          amount: parseFloat(rawAmount) || 0,
          type: String(tx.type).toLowerCase() === 'credit' ? 'income' : 'expense',
          category: tx.category,
          notes: tx.description
        });
      }
      // After successful save, reset to let user upload another file
      setUploadStatus('idle');
      setFile(null);
      setResultData(null);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save transactions.');
    } finally {
      setIsSaving(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setUploadStatus('idle');
    setErrorMessage('');
    setResultData(null);

    if (fileRejections.length > 0) {
      setUploadStatus('error');
      setErrorMessage(fileRejections[0].errors[0].message || 'Invalid file');
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');
    setResultData(null);

    try {
      const response = await uploadStatementApi(file);
      setResultData(response);
      setUploadStatus('success');
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to process the bank statement. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <span>AI Statement Parser</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30 shadow-[0_0_10px_rgba(37,99,235,0.1)] dark:shadow-none">
            Powered by Advanced AI
          </span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          Upload a bank statement PDF to automatically extract and categorize transactions.
        </p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50 dark:border-orange-500 dark:bg-orange-500/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-orange-500/30 hover:bg-slate-50 dark:hover:bg-orange-500/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-orange-500/10 flex items-center justify-center text-blue-600 dark:text-orange-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.3)] dark:drop-shadow-none">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isDragActive ? 'Drop the PDF here...' : 'Click or drag PDF to upload'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Max size: 5MB. Strict privacy - processed securely.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!isUploading && uploadStatus !== 'success' && (
              <button
                onClick={removeFile}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {uploadStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-100 dark:border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {uploadStatus === 'success' && resultData?.transactions && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p className="font-semibold">Extraction complete! Review and adjust categories.</p>
                </div>
                <button
                  onClick={handleSaveToLedger}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-[0_0_10px_rgba(37,99,235,0.3)] disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-500 dark:shadow-[0_0_10px_rgba(234,88,12,0.3)]"
                >
                  {isSaving ? 'Saving...' : 'Save to Ledger'}
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Date</th>
                      <th className="px-3 py-2 font-semibold">Description</th>
                      <th className="px-3 py-2 font-semibold">Amount</th>
                      <th className="px-3 py-2 font-semibold">Type</th>
                      <th className="px-3 py-2 font-semibold text-right">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {resultData.transactions.map((tx: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 whitespace-nowrap">{tx.date}</td>
                        <td className="px-3 py-2 truncate max-w-[200px]" title={tx.description}>{tx.description}</td>
                        <td className={`px-3 py-2 font-mono font-bold ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'}`}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                        </td>
                        <td className="px-3 py-2 capitalize">{tx.type}</td>
                        <td className="px-3 py-2 text-right">
                          <select
                            value={tx.category}
                            onChange={(e) => updateCategory(idx, e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-xs outline-none focus:border-blue-500 dark:focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Housing">Housing</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Income">Income</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadStatus !== 'success' && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-sm
                ${isUploading 
                  ? 'bg-blue-400 cursor-not-allowed dark:bg-orange-400' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] dark:bg-orange-600 dark:hover:bg-orange-500 dark:hover:shadow-[0_0_15px_rgba(234,88,12,0.4)] active:scale-[0.98]'
                }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing via AI Engine...</span>
                </>
              ) : (
                <span>Extract Transactions</span>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
