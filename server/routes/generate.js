const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const Replicate = require('replicate');
const { authMiddleware } = require('../middleware/auth');
const { history } = require('../db');

const router = express.Router();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Style prompts
const STYLE_PROMPTS = {
  thai: {
    label: '泰式风格',
    tone: 'vibrant, tropical Thai street food style with warm colors and exotic flavors emphasis',
    imageStyle: 'Thai street food market, vibrant colors, tropical decorations, warm lighting, banana leaves',
  },
  premium: {
    label: '高级风格',
    tone: 'elegant fine dining, sophisticated and luxurious with refined language',
    imageStyle: 'fine dining restaurant, elegant plating, dark moody lighting, gold accents, minimalist luxury',
  },
  street: {
    label: '烟火气',
    tone: 'authentic street food vibes, warm, nostalgic, homey and comforting',
    imageStyle: 'bustling night market, steam rising, neon signs, crowded food stall, authentic street atmosphere',
  },
};

// Generate copy
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { dishName, price, style } = req.body;
    if (!dishName || !price || !style) {
      return res.status(400).json({ error: 'dishName, price, and style are required' });
    }

    const styleConfig = STYLE_PROMPTS[style];
    if (!styleConfig) {
      return res.status(400).json({ error: 'Invalid style. Use: thai, premium, or street' });
    }

    const imageFile = req.file ? req.file.filename : null;

    // Generate text content with OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const textPrompt = `You are a professional food marketing copywriter. Create marketing copy for a dish with these details:
- Dish name: ${dishName}
- Price: RM ${price}
- Style/Tone: ${styleConfig.tone}

Generate the following in JSON format:
{
  "facebook_en": "English Facebook post (2-3 sentences, engaging, with emojis, include price)",
  "facebook_zh": "Chinese Facebook post (2-3 sentences, engaging, with emojis, include price)",
  "xiaohongshu": "小红书风格文案 (use trending xiaohongshu style with hashtags, emojis, line breaks, 3-4 short paragraphs, include price)"
}

Return ONLY valid JSON, no markdown.`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: textPrompt }],
      temperature: 0.8,
    });

    let generatedText;
    try {
      generatedText = JSON.parse(chatResponse.choices[0].message.content);
    } catch {
      generatedText = {
        facebook_en: chatResponse.choices[0].message.content,
        facebook_zh: '',
        xiaohongshu: '',
      };
    }

    // Generate poster image with Replicate
    let posterUrl = null;
    try {
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

      const posterPrompt = `Professional food marketing poster for "${dishName}", priced at RM ${price}. ${styleConfig.imageStyle}. Beautiful food photography style, appetizing, commercial quality, clean layout with space for text overlay. No text in the image.`;

      const output = await replicate.run(
        'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
        {
          input: {
            prompt: posterPrompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
          },
        }
      );

      posterUrl = Array.isArray(output) ? output[0] : output;
    } catch (err) {
      console.error('Replicate error:', err.message);
    }

    // Save to history
    const record = {
      userId: req.userId,
      dishName,
      price,
      style,
      styleLabel: styleConfig.label,
      imageFile,
      generatedText,
      posterUrl,
      createdAt: new Date().toISOString(),
    };
    const saved = await history.insert(record);

    res.json({
      id: saved._id,
      ...record,
    });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: 'Generation failed: ' + err.message });
  }
});

module.exports = router;
