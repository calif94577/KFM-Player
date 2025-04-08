const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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