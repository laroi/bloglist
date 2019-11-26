const blogRouter = require('express').Router();
const Blog = require('../models/blog');
blogRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({});
        response.json(blogs)
    } catch (e) {
        res.status(500).send();
    }
})

blogRouter.post('/', async(request, response) => {
    const blog = new Blog(request.body)
    try {
        const result = await blog.save();
        res.status(201).send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = blogRouter;
