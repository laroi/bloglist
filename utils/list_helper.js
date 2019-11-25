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
module.exports = {
	dummy,
    totalLikes,
    favoriteBlog
};
