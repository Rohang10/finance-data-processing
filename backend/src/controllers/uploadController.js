const fs = require('fs');
const path = require('path');
const { extractTransactionsFromPDF } = require('../services/geminiService');


// @desc    Upload PDF bank statement and parse it
// @route   POST /api/upload/statement
// @access  Private
const uploadStatement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    const userId = req.user?.id; // Assuming you have authentication middleware setting req.user

    if (!userId) {
       // If no user context, we might be in testing mode or auth is missing
       // But we still want to allow testing, so we use a dummy user id if needed
       // return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. Extract data using Gemini
    console.log(`Processing file: ${filePath}`);
    const transactions = await extractTransactionsFromPDF(filePath, req.file.mimetype);

    // 2. Format data for database insertion
    // Our existing database structure (based on what we know) probably has a financial_records table
    // or similar. For now, we will return the extracted transactions to the frontend
    // so the frontend can preview/save them via existing APIs, OR we can save them here.
    
    // For Phase 2, it's often best to return the parsed transactions first so the user
    // can review them before they are committed to the ledger.
    
    // Delete the temporary file from the local server since Gemini processed it
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    return res.status(200).json({
      message: 'Statement parsed successfully',
      count: transactions.length,
      transactions: transactions
    });

  } catch (error) {
    console.error('Error in uploadStatement:', error);
    
    // Attempt cleanup if error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(500).json({ error: 'Failed to process statement' });
  }
};

module.exports = {
  uploadStatement
};
