const express = require('express');
const cors = require('cors');

const app = express();



// multi - origin resource sharing
app.use(cors());

// Converting into JSON
app.use(express.json());
