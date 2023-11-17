// server.js
const express = require('express');
const axios = require('axios');
const wtf = require('wtf_wikipedia');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/writer/:name', async (req, res) => {
    const writerName = req.params.name;
    try {
        // Use Wikipedia API to get raw HTML content
        const response = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${encodeURIComponent(writerName)}`
        );

        const htmlContent = response.data.parse.text['*'];

        // Use wtf_wikipedia to parse HTML content
        const parsedData = wtf(htmlContent);
        const writerInfo = parsedData.text();

        if (writerInfo !== undefined) {
            res.json({ writerInfo });
        } else {
            res.status(404).json({ error: 'Writer info not available' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
