require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors());

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

app.listen(process.env.PORT, console.info(`APP STARTED ON THE PORT ${process.env.PORT}`));