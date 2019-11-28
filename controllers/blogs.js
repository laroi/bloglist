const blogRouter = require('express').Router();
const Blog = require('../models/blog');
blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({});
        response.json(blogs);
    } catch (e) {
        next(e);
    }
});

blogRouter.post('/', async(request, response, next) => {
    const blog = new Blog(request.body);
    try {
        const result = await blog.save();
        response.status(201).send(result.toJSON());
    } catch (e) {
        next(e);
    }
});

blogRouter.delete('/:id', async(request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).send();
    } catch (e) {
        next(e);
    }
});

blogRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const blog = {};
    if (body.title) {
        blog.title=body.title;
    }
    if (body.author) {
        blog.author=body.author;
    }
    if (body.url) {
        blog.url=body.url;
    }
    if (body.likes) {
        blog.likes=body.likes;
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog.toJSON());
        })
        .catch(error => next(error));
});

module.exports = blogRouter;
