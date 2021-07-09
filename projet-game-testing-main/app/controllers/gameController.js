const gamesDataMapper = require('../dataMappers/gamesDataMapper');
const reviewDataMapper = require('../dataMappers/reviewDataMapper');
const sanitizeHtml = require('sanitize-html');
module.exports = {
    async homePage(_,res) {
        try {
            const gamesMoreRecent = await gamesDataMapper.getFiveMoreRecentGames();
            const gamesTopRated = await gamesDataMapper.getFiveTopRatedGames();
            const gamesMorePopular = await gamesDataMapper.getFiveMorePopularGames();
            const categories = await gamesDataMapper.getAllCategories();
            const platforms = await gamesDataMapper.getAllPlatforms();
            res.status(200).json({ gamesMoreRecent , gamesTopRated , gamesMorePopular , categories , platforms });


        } catch(error) {
            console.error(error);
            res.status(500).json('Error server');
        }

    },
    async getAllGames(_,res) {
        try {
            const games = await gamesDataMapper.getAllGames();
            res.status(200).json(games);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    },
    async getAllCategories (_ , res) {
        try {
            const categories = await gamesDataMapper.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    },
    async getAllPlatforms (_,res) {
        try {
            const platforms = await gamesDataMapper.getAllPlatforms();
            res.status(200).json(platforms);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }

    },
    async getFiveMoreRecentGames(_,res) {
        try {
            const gamesMoreRecent = await gamesDataMapper.getFiveMoreRecentGames();
            res.status(200).json(gamesMoreRecent);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    },
    async getFiveTopRatedGames(_,res) {
        try {
            const gamesTopRated = await gamesDataMapper.getFiveTopRatedGames();
            res.status(200).json(gamesTopRated);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    },
    async getFiveMorePopularGames(_,res) {
        try {
            const gamesMorePopular = await gamesDataMapper.getFiveMorePopularGames();
            res.status(200).json(gamesMorePopular);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        } 
    },
    async getAllInfoOfOneGame (req,res,next) {
        try {

            const gameId = parseInt(req.params.id,10);

            if(!gameId) {
                return next();
            }

            const game = await gamesDataMapper.getAllInformationsofOneGame(gameId);
            const popularity = await reviewDataMapper.getPopularityOfOneGame(gameId);

            if(!game) {
                res.status(404).json("Ressource not found");
            }
            res.status(200).json({game,popularity});
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        } 
    },
    async getAllGamesByCategories(req,res,next) {

        try {
            const categoryId = parseInt(req.params.categoryId,10);

            if(!categoryId) {
                return next();
            }

            const gamesByCategories = await gamesDataMapper.getAllGamesByCategories(categoryId);

            if(!gamesByCategories) {
                res.status(404).json("Ressource not found");
            }
            res.status(200).json(gamesByCategories);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        } 

    },
    async getAllGamesByPlatforms(req,res,next) {

        try {

            const platformId = parseInt(req.params.platformId,10);

            if(!platformId) {
                return next();
            }

            const gamesByPlatform = await gamesDataMapper.getAllGamesByPlatforms(platformId);

            if(!gamesByPlatform) {
                res.status(404).json("Ressource not found");
            }
            res.status(200).json(gamesByPlatform);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    },
    async searchGame(req,res,next) {
        try {

            let gameName = req.body.name;

            if(!gameName) {
                return next();
            }
            gameName = sanitizeHtml(gameName);
            const gameByName = await gamesDataMapper.getGameByName(gameName);

            if(!gameByName) {
                res.status(404).json("Ressource not found");
            }
            res.status(200).json(gameByName);
        } catch (error) {
            console.error(error);
            res.status(500).json("Error server");
        }
    }

}
