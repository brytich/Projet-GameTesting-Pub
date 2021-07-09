const adminDataMapper = require('../dataMappers/adminDataMapper');
const emailValidator = require('email-validator');

module.exports = {

    async getLoginPage (_,res) {
        res.render('login');
    },
    async login(req,res){

        try {
                const formData = req.body;
                
                if (!emailValidator.validate(formData.email)) {
                    throw new Error(`Email invalid`);
                }
    
                if (formData.password.length < 3) {
                    throw new Error(`Le mot de passe doit contenir au moins 3 caractères.`);
                }
    
                const user = await adminDataMapper.findAdminInDatabase(formData.email)
                if (!user) {
                    throw new Error("Combinaison email/password incorrect");
                }
                if(user.password != formData.password) {
                    throw new Error("Combinaison email/password incorrect"); 
                }
                req.session.user = user;
                delete req.session.user.password;
    
                return res.redirect('/admin/home');

            } catch (error) {
                if (error instanceof Error) {
                    res.render('login', { error: error.message });
                } else {
                    console.error(error);
                    return res.status(500).render('login', { error: errorServerStr });
                }
            }
    },
    async homePage (_,res) {
        res.render('home');
    },
    async getAllReports(_,res){
            const reports = await adminDataMapper.getAllReports();
            console.log(reports);
            res.render('reports', {reports});
    },
    async getAllMessage(_,res){
            const messages = await adminDataMapper.getAllMessages();
            console.log(messages);
            res.render('messages' , {messages});
    },
    async deleteReview(req,res){
            const reviewId = parseInt(req.params.reviewId,10);
            const reviewDelete = await adminDataMapper.deleteReviewReported(reviewId); 
            res.redirect('/admin/reports');
    },
    async cleanBadReport(req,res){
            const reviewId = parseInt(req.params.reviewId,10);
            const reviewClean = await adminDataMapper.cleanReviewReportedForNothing(reviewId); 
            res.redirect('/admin/reports');
    },
    async logOut(req,res){
        delete req.session.user;
        res.redirect('/admin/login');

    }
}