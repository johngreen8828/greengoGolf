module.exports = {
    get: (req, res) => {
        res.render('home', req.session);
    },
    post: (req, res) => {
        res.send('Add a book');
    },
    put: (req, res) => {
        res.send('Update the book');
    }
};