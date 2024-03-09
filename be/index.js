const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./src/database/config');
database.connect();
require('dotenv').config();
const port = 3000

// Express Config
app.use(express.json({ limit: '10mb' }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded({
    limit: '10mb',
    extended: true
}));
// CORS config
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
// Config Router
const accountRouter = require('./src/routes/account.router');
const adminRouter = require('./src/routes/admin.router');
const userRouter = require('./src/routes/user.router');
const doctorRouter = require('./src/routes/doctor.router');

// config controller

app.use('/api/account', accountRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})