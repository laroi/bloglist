const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((sum, x)=> sum+x.likes, 0);
};

const favoriteBlog = (blogs) => {
    const maxLike = Math.max.apply(Math, blogs.map(function(o) { return o.likes; }));
    return blogs.find(x => x.likes === maxLike) 
};
const mostBlogs = (blogs) => {
    const res = blogs.reduce((acc, x) => {
        const key = x.author;
        if (!acc[key]) {
            acc[key] = {author: key, count: 1};
        }
        acc[key].count += 1;
        return acc;
    }, {})
    const arr = Object.keys(res).map(x=> res[x]);
    const maxCount = Math.max.apply(Math, arr.map(function(o) { return o.count; }))
    return arr.find(x=> x.count === maxCount);
}

const mostLikes = (blogs) => {
    const res = blogs.reduce((acc, x) => {
        const key = x.author;
        if (!acc[key]) {
            acc[key] = {author: key, likes: x.likes};
        } else {
            acc[key].likes += x.likes;
        }
        return acc;
    }, {})
    const arr = Object.keys(res).map(x=> res[x]);
    const maxLikes = Math.max.apply(Math, arr.map(function(o) { return o.likes; }))
    return arr.find(x=> x.likes === maxLikes);
}
module.exports = {
	dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
