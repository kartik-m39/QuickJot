import fetch from 'node-fetch';

export default async function handler(req, res) {
  const api_url = 'https://zenquotes.io/api/random';

  try {
    const response = await fetch(api_url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Return the data as JSON
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
}
