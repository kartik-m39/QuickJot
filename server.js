// server.js

import express from 'express';   // ES module import syntax
import fetch from 'node-fetch';  // ES module import syntax
import cors from 'cors';         // ES module import syntax

const app = express();
const port = 3000;

// Enable CORS to allow frontend to communicate with this server
app.use(cors());

// Create a route to handle the request for quotes
app.get('/api/quote', async (req, res) => {
  const api_url = 'https://zenquotes.io/api/random';
  
  try {
    const response = await fetch(api_url);  // Fetch the quote data from ZenQuotes

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Send the quote data back to the client
    res.json(data);
  } catch (error) {
    // Handle any error that may occur while fetching the data
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
