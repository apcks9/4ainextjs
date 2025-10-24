const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Claude API proxy
app.post('/api/claude', async (req, res) => {
  try {
    const { message, messages, apiKey } = req.body;

    // Support both single message and conversation history
    const messageArray = messages || [{ role: 'user', content: message }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: messageArray
      })
    });

    const data = await response.json();
    console.log('Claude API Response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// OpenAI API proxy
app.post('/api/openai', async (req, res) => {
  try {
    const { message, apiKey } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Grok API proxy
app.post('/api/grok', async (req, res) => {
  try {
    const { message, apiKey } = req.body;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-4',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Grok API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
