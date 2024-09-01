const express = require('express');
const { scrape } = require('./scrape.js');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/scrape', async (req, res) => {
  const url = req.query.url; // Pass the URL as a query parameter

  try {
    const productData = await scrape(url); // Get the scraped data
    res.json(productData); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
