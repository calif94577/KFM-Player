const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CORS preflight handling
app.options('/proxy/*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Kenku-API-URL'
  });
  res.sendStatus(204); // No content for OPTIONS
});

// Proxy endpoint
app.all('/proxy/*', async (req, res) => {
  const userApiUrl = req.headers['x-kenku-api-url'] || 'http://127.0.0.1:3333/v1';
  const endpoint = req.url.replace('/proxy', '');
  const url = `${userApiUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Proxy running on port ${port}`));