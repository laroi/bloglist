const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('../utils/list_helper');
const api = supertest(app);
const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
];
let userId;
describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'test', password: 'sekret' })
        res = await user.save()
        userId = res._id;
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

describe('blogs apis', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        const blogObjects = initialBlogs.map(blog => new Blog(blog));
        const promiseArray = blogObjects.map(blog => blog.save());
        await Promise.all(promiseArray);
});

    test('blogs are returned as json', async () => {
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(res.body.length).toBe(2);
        expect(res.body[0].id).toBeDefined();
    });
    test('blogs are created succesfully in right number', async () => {
        console.log(userId);
        const res = await api
            .post('/api/blogs')
            .send({title:'test1', author:'testauth', url: 'testurl', userId: userId})
            .expect(201)
            .expect('Content-Type', /application\/json/);
        expect(res.body.title).toBe('test1');
        expect(res.body.author).toBe('testauth');
        expect(res.body.url).toBe('testurl');
        const reslatest = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(reslatest.body.length).toBe(3);
    });
    test('like defaults to zero', async () => {
        const res = await api
            .post('/api/blogs')
            .send({title:'test1', author:'testauth', userId: userId, url: 'testurl'})
            .expect(201)
            .expect('Content-Type', /application\/json/);
        expect(res.body.likes).toBe(0);
    });
    test('title and url missing should result 400', async () => {
        await api
            .post('/api/blogs')
            .send({author:'testauth', url: 'testurl', userId: userId})
            .expect(400)
            .expect('Content-Type', /application\/json/);
        await api
            .post('/api/blogs')
            .send({author:'testauth', title: 'testtitle'})
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });
});


afterAll(() => {
    mongoose.connection.close();
});
