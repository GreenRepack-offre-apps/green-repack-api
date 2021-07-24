const express = require('express');
const app = express();

const port = process.env.PORT | 3000;

app.get('/', (req, res) => {
    res.send('--- Green-Repack api START !!! ---');
  });

app.listen(port, () => {
    console.log('Green-Repack app listening at http://localhost:${port}');
});