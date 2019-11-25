const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((sum, x)=> sum+x.likes, 0);
}
module.exports = {
	dummy,
    totalLikes
};
