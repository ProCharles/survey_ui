const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Read data from survey.json
function getSurveyData() {
    try {
        const rawData = fs.readFileSync('survey.json');
        return JSON.parse(rawData);
    } catch (error) {
        return []; // Return an empty array if the file doesn't exist
    }
}

// Create - POST method
app.post('/survey/add', (req, res) => {
    const surveyData = req.body;

    // Validate data (you can add more checks)
    if (!surveyData.fullName || !surveyData.email) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Read existing data
    const existingData = getSurveyData();

    // Append new survey data to the array
    existingData.push(surveyData);

    // Write to survey.json
    fs.writeFileSync('survey.json', JSON.stringify(existingData, null, 2));

    res.status(201).json({ message: 'Survey data added successfully' });
});

// Read - GET method
app.get('/survey', (req, res) => {
    const surveyData = getSurveyData();
    res.status(200).json(surveyData);
});

// Start your server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
