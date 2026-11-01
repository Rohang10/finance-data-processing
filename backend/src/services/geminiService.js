const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const ai = new GoogleGenAI({});
// Initialize Groq (it automatically picks up GROQ_API_KEY from .env)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

async function extractTransactionsFromPDF(filePath, mimeType = 'application/pdf') {
  const prompt = `
You are a highly accurate financial data extraction assistant. 
I am providing you with a bank statement document. 
Please extract ALL financial transactions from this statement.

Important constraints:
- Ignore non-transactional text (like account summaries, contact info, headers).
- Handle varying international date formats (e.g., DD/MM/YYYY vs MM/DD/YYYY) and output strictly as YYYY-MM-DD.
- Determine the transaction currency if possible (e.g., USD, EUR, INR).
- Categorize each transaction intelligently into ONE of these categories: 'Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Income', 'Other'.
- 'type' must be strictly 'credit' (money in) or 'debit' (money out).
- Output the result strictly as a valid JSON array of transaction objects, with NO markdown formatting, NO code blocks, just raw JSON.
`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date in YYYY-MM-DD format" },
        description: { type: "STRING", description: "Cleaned transaction description" },
        amount: { type: "NUMBER", description: "Absolute value of the transaction amount" },
        currency: { type: "STRING", description: "3-letter currency code, e.g., USD" },
        type: { type: "STRING", enum: ["credit", "debit"] },
        category: { type: "STRING", enum: ["Housing", "Food", "Transport", "Utilities", "Entertainment", "Income", "Other"] }
      },
      required: ["date", "description", "amount", "type", "category"]
    }
  };

  let uploadResult = null;

  try {
    // ---------------------------------------------------------
    // 1. PRIMARY ATTEMPT: GEMINI 3.7
    // ---------------------------------------------------------
    console.log(`Uploading file to Gemini API: ${filePath}`);
    uploadResult = await ai.files.upload({ file: filePath, mimeType: mimeType });
    console.log(`File uploaded successfully. URI: ${uploadResult.uri}`);

    console.log("Calling Gemini model for extraction...");
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { fileData: { fileUri: uploadResult.uri, mimeType: mimeType } },
        prompt
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1,
      }
    });

    console.log("Gemini Extraction complete.");

    if (uploadResult) {
      await ai.files.delete({ name: uploadResult.name }).catch(() => { });
    }

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);

  } catch (primaryError) {
    console.warn(`\n⚠️ Primary Gemini model failed: ${primaryError.message}`);
    console.log(`🔄 Fallback 1: Attempting Groq (qwen/qwen3.8-27b - OCR supported)...`);

    try {
      // ---------------------------------------------------------
      // 2. FALLBACK 1: GROQ (Qwen 3.8 - OCR supported)
      // ---------------------------------------------------------
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      const groqPrompt = prompt + "\n\nHere is the extracted text from the PDF bank statement:\n\n" + pdfData.text;

      const groqResponse = await groq.chat.completions.create({
        messages: [{ role: 'user', content: groqPrompt }],
        model: 'qwen/qwen3.8-27b',
        temperature: 0.1,
        max_tokens: 8192,
      });

      console.log("Groq Fallback 1 Extraction complete.");
      let rawText = groqResponse.choices[0]?.message?.content || '[]';
      console.log("---- RAW GROQ OUTPUT ----\n", rawText, "\n-------------------------");

      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const startArr = rawText.indexOf('[');
      const endArr = rawText.lastIndexOf(']');
      const startObj = rawText.indexOf('{');
      const endObj = rawText.lastIndexOf('}');

      // Auto-repair truncated JSON arrays
      if (startArr !== -1 && endArr === -1) {
        const lastBrace = rawText.lastIndexOf('}');
        if (lastBrace !== -1) {
          rawText = rawText.substring(startArr, lastBrace + 1) + ']';
          console.log("---- AUTO-REPAIRED TRUNCATED JSON ----\n");
        }
      } else if (startArr !== -1 && endArr !== -1 && endArr > startArr && (startObj === -1 || startArr < startObj)) {
        rawText = rawText.substring(startArr, endArr + 1);
      } else if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
        rawText = rawText.substring(startObj, endObj + 1);
      }

      console.log("---- CLEANED JSON ----\n", rawText);

      if (uploadResult) {
        await ai.files.delete({ name: uploadResult.name }).catch(() => { });
      }

      const parsedData = JSON.parse(rawText);
      if (parsedData.transactions && Array.isArray(parsedData.transactions)) {
        return parsedData.transactions;
      }
      return parsedData;

    } catch (fallbackError) {
      console.warn(`\n⚠️ Fallback 1 (Groq) also failed: ${fallbackError.message}`);
      console.log(`🔄 Fallback 2: Falling back to gemini-flash-latest...`);

      try {
        // ---------------------------------------------------------
        // 3. FALLBACK 2: GEMINI FLASH LATEST
        // ---------------------------------------------------------
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: [
            { fileData: { fileUri: uploadResult.uri, mimeType: mimeType } },
            prompt
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.1,
          }
        });

        console.log("Gemini Fallback 2 Extraction complete.");
        if (uploadResult) {
          await ai.files.delete({ name: uploadResult.name }).catch(() => { });
        }

        let rawText = fallbackResponse.text || '';
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(rawText);

      } catch (geminiFlashError) {
        if (uploadResult) {
          await ai.files.delete({ name: uploadResult.name }).catch(() => { });
        }
        console.error("❌ Gemini Fallback 2 also failed:", geminiFlashError.message);
        throw new Error("All extraction models failed.");
      }
    }
  }
}

module.exports = {
  extractTransactionsFromPDF
};
