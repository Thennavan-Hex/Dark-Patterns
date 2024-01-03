const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/api/store-url', (req, res) => {
  const { url } = req.body;
  console.log('Received URL:', url);
  res.json({ status: 'success', message: 'URL received successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
