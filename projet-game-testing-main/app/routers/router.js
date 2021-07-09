const express = require('express');
const auth = require('../middleware/auth');
const gameController = require('../controllers/gameController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authentificationAdmin');
const localsMiddleware = require('../middleware/locals');

const router = express.Router();

router.route('/')
/**
 * Main Page
 * @route GET /
 * @returns {gamesMoreRecent , gamesTopRated , gamesMorePopular , categories , platforms} 200 - Objects for main page
 * @returns {Error} 500 - Server error
 */
    .get(gameController.homePage);
router.route('/games')
/**
 * All games limit 100
 * @route GET /games
 * @returns {games} 200 - All games 
 * @returns {Error} 500 - Server error
 */
    .get(gameController.getAllGames);
router.route('/games/category/:categoryId(\\d+)')
/**
 * Games by category
 * @route GET /games/category/{categoryId}
 * @param {number} categoryId - Category Id
 * @returns {gamesByCategory} 200 - Games by category
 * @returns {Error} 500 - Server error
 */
    .get(gameController.getAllGamesByCategories);
router.route('/games/platform/:platformId(\\d+)')
/**
 * Games by platform
 * @route GET /games/platform/{platformId}
 * @param {number} platformId , Id of platform
 * @returns {gamesByPlatform} 200 - Games by platform
 * @returns {Error} 500 - Server error
 */
    .get(gameController.getAllGamesByPlatforms);
router.route('/games/:id(\\d+)')
/**
 * Game by Id
 * @route GET /games/{id}
 * @param {number} gameId - Id of game
 * @returns {game , popularity} 200 - Game and popularity by Id
 * @returns {Error} 500 - Server error
 */
    .get(gameController.getAllInfoOfOneGame);
router.route('/games/:id(\\d+)/review')
/**
 * Reviews of Game
 * @route GET /games/{id}/review
 * @param {number} gameId - Id of game
 * @returns {reviews} 200 - Reviews of Game
 * @returns {Error} 500 - Server error
 */
    .get(reviewController.getAllReviewsOfAGame);
router.route('/search')
/**
 * Find Game by Name
 * @route POST /search
 * @param {NameOfGame} NameofGame - required
 * @returns {gameByName} 200 - Game by Name
 * @returns {Error} 500 - Server error
 */
    .post(gameController.searchGame);
router.route('/signup')
/**
 * Signup visitor
 * @route POST /signup
 * @param {FormData} FormData - required
 * @returns {User has created} 201 - User created
 * @returns {Error} 500 - Server error
 */
    .post(userController.signUp);
router.route('/login')
/**
 * Connexion for member
 * @route POST /login
 * @param {FormData} FormData - required
 * @returns {JWT token} - JWT Token required
 * @returns {Error input} 400 - Error input
 * @returns {Error} 500 - Server error
 */
    .post(userController.login);
router.route('/contact')
/**
 * Send message to admin
 * @route POST /contact
 * @param {email} Email - required
 * @param {content} Content - required
 * @returns {Message has sended} 201 - Message sended
 * @returns {Error input} 400 - Error input
 * @returns {Error} 500 - Server error
 */
    .post(userController.sendMessage);

/* ACCES MEMBRE */
router.route('/profile')
/**
 * Get Profile of User
 * @route GET /profile
 * @param {JWT token} Token - required
 * @returns {User} 200 - Infos of user
 * @returns {Error input} 400 - Error input
 * @returns {Error} 500 - Server error
 */
    .get(auth.authenticateToken,userController.getProfile)
/**
 * Modify profile
 * @route PATCH /profile
 * @param {JWT token} - required
 * @returns {User} 200 - New info for user
 * @returns {Error input} 400 - Error input
 * @returns {Error} 500 - Server error
 */
    .patch(auth.authenticateToken,userController.updateProfile);
router.route('/games/:id/review')
/**
 * Send a review of a game
 * @route POST /games/{id}/review
 * @param {JWT token} - required
 * @param {number} id
 * @param {number + string} - notes + content
 * @returns {review} 201 - Review created
 * @returns {Error} 500 - Server error
 */
    .post(auth.authenticateToken,reviewController.postReview);
router.route('/games/:id(\\d+)/review/:reviewId(\\d+)')
/**
 * Modify a review send by User
 * @route PATCH /games/{id}/review/{reviewId}
 * @param {JWT token} - required
 * @param {number} id
 * @param {review} reviewId
 * @param {number + string} - notes + content
 * @param {notes + content} -
 * @returns {review} 201 - Review modified
 * @returns {Error} 500 - Server error
 */
    .patch(auth.authenticateToken,reviewController.updateReview);

router.route('/games/:id(\\d+)/review/:reviewId(\\d+)/report')

/**
 * Report an unsuitable review
 * @route PATCH /games/{id}/review/{reviewId}/report
 * @param {JWT token} - required
 * @param {number} id
 * @param {review} reviewId
 * @returns {Review has report} 200 - Review reported
 * @returns {Error} 500 - Server error
 */
    .patch(auth.authenticateToken,reviewController.reportReview);

router.route('/games/:id(\\d+)/review/:reviewId(\\d+)/upvote')
/**
 * Upvote good review
 * @route PATCH /games/{id}/review/{reviewId}/upvote
 * @param {JWT token} - required
 * @param {number} id - 
 * @param {review} reviewId
 * @returns {Review has upvote} 200 - Review has upvote 
 * @returns {Error} 500 - Server error
 */
    .patch(auth.authenticateToken,reviewController.upVoteReview);

router.route('/games/:id(\\d+)/review/:reviewId(\\d+)/downvote')
/**
 * Downvote bad review
 * @route PATCH /games/{id}/review/{reviewId}/downvote
 * @param {JWT token} - required
 * @param {number} id
 * @param {review} reviewId
 * @returns {Review has downvote} 200 - Review has downvote
 * @returns {Error} 500 - Server error
 */
    .patch(auth.authenticateToken,reviewController.downVoteReview);

/* ADMIN */


router.use(localsMiddleware);
router.use(authMiddleware.userToLocals);

router.route('/admin/login')
    .get(adminController.getLoginPage)
    .post(adminController.login);
router.route('/admin/home')
    .get(authMiddleware.checkAdmin,adminController.homePage);
router.route('/admin/reports')
    .get(authMiddleware.checkAdmin,adminController.getAllReports);
router.route('/admin/messages')
    .get(authMiddleware.checkAdmin,adminController.getAllMessage);
router.route('/admin/reports/:reviewId/delete')
    .get(authMiddleware.checkAdmin,adminController.deleteReview)
router.route('/admin/reports/:reviewId/clean')
    .get(authMiddleware.checkAdmin,adminController.cleanBadReport);
router.route('/logout')
    .get(authMiddleware.checkAdmin,adminController.logOut);

module.exports = router;