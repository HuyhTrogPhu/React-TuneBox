const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const openai = new OpenAI({
  apiKey: 'tuneBoxTrackAITrongPhuXuanTruongQuocTrungGiaNhuGiaBaoHoaiPhong',
});

app.use(express.json());

app.post('/chat', async (req, res) => {
  const { input } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: input },
      ],
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).send('Error calling OpenAI API');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3001');
});
