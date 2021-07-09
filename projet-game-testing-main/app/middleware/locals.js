module.exports = (req, res, next) => {

    if (req.body) {
        res.locals.formData = req.body;
    } else {
        res.locals.formData = {};
    }

    next();
}