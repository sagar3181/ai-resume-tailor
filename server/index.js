// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const fs = require('fs');
// const pdf = require('pdf-parse');

// dotenv.config();
// const app = express();
// console.log('🔥 App starting...');

// // ✅ Enable CORS
// app.use(cors());

// // ✅ Middleware for form data and JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Multer setup for PDF upload
// const upload = multer({ dest: 'uploads/' });

// // ✅ Upload Resume + Extract Text
// app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       console.log('❌ No file received.');
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     console.log('✅ File received:', req.file.originalname);

//     const fileBuffer = await fs.promises.readFile(req.file.path);
//     const data = await pdf(fileBuffer);

//     res.json({ text: data.text });

//     // ✅ Clean up temp file after response
//     fs.promises.unlink(req.file.path).catch((err) => {
//       console.warn('⚠️ Failed to delete file:', err.message);
//     });

//   } catch (err) {
//     console.error('❌ PDF parse failed:', err);
//     res.status(500).json({ error: 'Failed to extract text from PDF' });
//   }
// });

// // ✅ Add a test route (optional)
// app.get('/test', (req, res) => {
//   res.send('🟢 Backend is running!');
// });

// console.log("🧪 Upload route registered ✅");

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

// // ✅ Crash guards (optional)
// process.on('exit', (code) => {
//   console.log(`🚪 Process exiting with code ${code}`);
// });
// process.on('SIGINT', () => {
//   console.log('👋 Received SIGINT');
//   process.exit(0);
// });
// process.on('SIGTERM', () => {
//   console.log('👋 Received SIGTERM');
//   process.exit(0);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

dotenv.config();
const app = express();
console.log('🔥 App starting...');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('❌ No file received.');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ File received:', req.file);

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(fileBuffer);
    fs.unlinkSync(req.file.path);
    res.json({ text: data.text });
  } catch (err) {
    console.error('❌ PDF parse failed:', err);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
});

const PORT = process.env.PORT || 5050;  // ✅ Change to 5050
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
