const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const PORT = 3000;

// Security: In production, this key should come from process.env.GEMINI_API_KEY
// For this local demo, it is stored here on the server-side, never sent to the client.
const API_KEY = 'AIzaSyBP-Fu2UOHtlrSgtrMk9E4gsMD9UyiRHow';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/'))); // Serve static files

// API Proxy Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const payload = req.body;

        // Forward request to Google Gemini
        const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running securely at http://localhost:${PORT}`);
});
