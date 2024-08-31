import express from 'express';
import { scrape } from './scrape.js';
const app = express();
const PORT = 3001;

app.get('/scrape', async (req, res) => {
  const url = req.query.url; // Pass the URL as a query parameter

  try {
    scrape(url);
      } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
