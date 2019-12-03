const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');
blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user');
        response.json(blogs);
    } catch (e) {
        next(e);
    }
});

blogRouter.post('/', middleware.verifyToken, async(request, response, next) => {
    const body = request.body;
    const user = await User.findById(body.userId) 
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });
    try {
        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id);
        await user.save();
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
