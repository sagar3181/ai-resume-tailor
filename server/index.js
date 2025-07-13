const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();
console.log('🔑 Loaded OpenRouter key prefix:', process.env.OPENROUTER_API_KEY?.slice(0, 5));

const app = express();
console.log('🔥 App starting...');

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// ✅ PDF Upload and Extraction
app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('❌ No file received.');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ File received:', req.file.originalname);

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(fileBuffer);
    fs.unlinkSync(req.file.path); // delete after read

    res.json({ text: data.text });
  } catch (err) {
    console.error('❌ PDF parse failed:', err);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
});

// ✅ Resume Tailoring with OpenRouter
app.post('/api/tailor-resume', async (req, res) => {
  const { resumeText, jobText } = req.body;

  if (!resumeText || !jobText) {
    return res.status(400).json({ error: 'Missing resume or job description.' });
  }

  const systemPrompt = `
You are a professional resume writer.
Your task is to improve and tailor the resume below for the job description.
✅ Preserve original experience, projects, and skills
✅ Modify wording to match the job's responsibilities and keywords
✅ Do NOT invent new jobs or remove projects
✅ Return the full improved resume only
`;

  const userPrompt = `
Resume:
${resumeText}

Job Description:
${jobText}
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // ✅ Free, reliable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    const tailoredText = data.choices?.[0]?.message?.content?.trim();

    if (!tailoredText) {
      console.warn('⚠️ No content returned from OpenRouter');
      return res.status(500).json({ error: 'No result returned from OpenRouter.' });
    }

    res.json({ result: tailoredText });
  } catch (err) {
    console.error('❌ OpenRouter API error:', err);
    res.status(500).json({ error: 'Failed to tailor resume.' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
