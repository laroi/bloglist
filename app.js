const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = require('./controllers/blogs');
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.info('error connection to MongoDB:', error.message);
    });
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(middleware.getTokenFrom);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;
