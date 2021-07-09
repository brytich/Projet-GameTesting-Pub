const reviewDataMapper = require('../dataMappers/reviewDataMapper');
const userDataMapper = require('../dataMappers/userDataMapper');
const sanitizeHtml = require('sanitize-html');
module.exports = {
    async getAllReviewsOfAGame (req,res,next) {
        try {

            const gameId = parseInt(req.params.id,10);

            if(!gameId) {
                return next();
            }

            const reviews = await reviewDataMapper.getAllReviewsOfOneGame(gameId);

            if(!reviews) {
                res.status(404).json("Ressource not found");
            }
            res.status(200).json(reviews);
        } catch (error) {
            console.error(error)
            res.status(500).json("Error server")
        } 
    },
    async postReview (req,res,next) {
        try {
            const gameId = parseInt(req.params.id, 10);
            const userId = await userDataMapper.getIdOfMember(req.user);
            const data = req.body;

            if(!data){
                return next();
             }

            data.content = sanitizeHtml(data.content);

            const review = await reviewDataMapper.insertReviewOnGame(data,userId.id,gameId);
            res.status(201).json(review);

        } catch (error) {
            console.error(error);
            return res.status(500).json('Server error')
        }
    },
    async updateReview (req,res,next) {

        try {
            const reviewId = req.params.reviewId;
            const data = req.body;
            if(!data) {
                return next();
            }
            for(const property in data){
                await reviewDataMapper.updateReview(property,data[property],reviewId);
            }
            res.json(`review has modified .`);


        } catch(error) {
        
            console.error(error)
            res.status(500).json("Error server");
        }
    },
    async reportReview(req,res) {
        try {
            const reviewId = parseInt(req.params.reviewId,10);
            if(!reviewId) {
                return next();
            }
            const report = await reviewDataMapper.reportReview(reviewId);
            res.status(200).json(`review has reported .`);

        } catch(error) {
        
            console.error(error)
            res.status(500).json("Error server");
        }

    },
    async upVoteReview(req,res) {
        try {
            const reviewId = parseInt(req.params.reviewId,10);
            if(!reviewId) {
                return next();
            }
            const report = await reviewDataMapper.upVoteReview(reviewId);
            res.status(200).json(`Thanks for vote !.`);

        } catch(error) {
        
            console.error(error)
            res.status(500).json("Error server");
        }

    },
    async downVoteReview(req,res) {
        try {
            const reviewId = parseInt(req.params.reviewId,10);
            if(!reviewId) {
                return next();
            }
            const report = await reviewDataMapper.downVoteReview(reviewId);
            res.status(200).json(`Thanks for vote !.`);

        } catch(error) {
        
            console.error(error)
            res.status(500).json("Error server");
        }
    }
}