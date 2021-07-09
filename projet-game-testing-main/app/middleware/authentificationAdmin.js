module.exports = {

    checkAdmin: (req, res, next) => {

        if (!req.session.user) {
            return res.redirect('/admin/login');
        }
        next();
    },

    userToLocals: (req, res, next) => {

        if(req.session){
            res.locals = req.session;
        }
        next();
    }
}