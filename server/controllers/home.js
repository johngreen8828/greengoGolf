module.exports = {
    get: (req, res) => {
        res.render('home/layout', req.session);
    },
    partials: {
        index: (req, res) => {
            res.render('home/index', req.session);
        },
        about: (req, res) => {
            res.render('home/about', req.session);
        },
        video: (req, res) => {
            res.render('home/video', req.session);
        },
        teacher: (req, res) => {
            res.render('home/teacher', req.session);
        },
        student: (req, res) => {
            res.render('home/student', req.session);
        }
    }
};