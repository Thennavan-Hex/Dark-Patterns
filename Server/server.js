const express = require('express');
const bodyParser = require('body-parser');
const { URL } = require('url');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

app.post('/api/get-url-score', async (req, res) => {
  const { url } = req.body;

  console.log('Received URL:', url);

  try {
    const totalScore = await getUrlScore(url);

    console.log('Total score fetched successfully for URL:', url, 'Total Score:', totalScore);
    res.json({ totalScore });
  } catch (error) {
    console.error('Error fetching total score:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.post('/api/report', async (req, res) => {
  const { url, userIp, report } = req.body;

  console.log('Received report for URL:', url, 'User IP:', userIp, 'Report:', report);

  try {
    // Get the URL ID from the 'url_data' table
    const urlId = await getUrlId(url);

    // Insert the user report into the 'user_reports' table
    await insertUserReport(urlId, userIp, report);

    res.json({ status: 'success', message: 'Report received successfully' });
  } catch (error) {
    console.error('Error receiving report:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

async function getUrlId(url) {
  try {
    // Validate and correct the URL before creating a URL object
    const correctedUrl = validateAndCorrectUrl(url);

    if (!correctedUrl) {
      console.error('Invalid URL:', url);
      throw new Error('Invalid URL');
    }

    const result = await client.query('SELECT id FROM url_data WHERE url = $1', [correctedUrl]);
    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    throw error;
  }
}

async function insertUserReport(urlId, userIp, report) {
  try {
    await client.query('INSERT INTO user_reports (url_id, user_ip, report, timestamp) VALUES ($1, $2, $3, NOW())', [urlId, userIp, report]);
  } catch (error) {
    throw error;
  }
}

async function getUrlScore(url) {
  try {
    // Fetch the score from the database based on the URL
    const result = await client.query('SELECT score FROM url_scores WHERE url = $1', [url]);
    return result.rows.length > 0 ? result.rows[0].score : null;
  } catch (error) {
    throw error;
  }
}

// Function to validate and correct URL
function validateAndCorrectUrl(inputUrl) {
  try {
    // Prepend "http://" if the URL doesn't have a scheme
    const correctedUrl = inputUrl.startsWith('http') ? inputUrl : `http://${inputUrl}`;
    new URL(correctedUrl);
    return correctedUrl;
  } catch (error) {
    return null;
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
