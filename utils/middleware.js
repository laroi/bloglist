const logger = require('./logger');
const Blog = require('../models/blog');

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};
const jwt = require('jsonwebtoken');
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const getTokenFrom = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    } 
    next();
};
const verifyToken = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) {
        next({name: 'JsonWebTokenError'}); 
        return;
    }
    req.body.userId = decodedToken.id;
    next();
};
const verifyOwner = async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (blog.user.toString() === req.body.userId.toString()) {
        next();
        return;
    }
    next({name: 'Forbidden'});
};
const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    } else if (error.name === 'Forbidden') {
        return response.status(403).json({ error: 'Forbidden' });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    getTokenFrom,
    verifyToken,
    verifyOwner
};
