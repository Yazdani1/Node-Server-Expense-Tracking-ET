const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('./model/db');

app.use(cors());
app.use(express.json({ limit: '4.5mb' }));

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./router/user'));
app.use('/api', require('./router/ExpenseBook'));
app.use('/api', require('./router/ExpenseCategory'));
app.use('/api', require('./router/ExpenseList'));
app.use('/api', require('./router/NationaId'));
app.use('/api', require('./router/Income'));
app.use('/api', require('./router/Course'));
app.use('/api', require('./router/Lecture'));
app.use('/api', require('./router/CourseEnrolment'));
app.use('/api', require('./router/Job'));
app.use('/api', require('./router/JobWishList'));

app.listen(port, (req, res) => {
  console.log('Server connected');
});
