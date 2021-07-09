const client = require('../client');

module.exports = {
    async getAllReviewsOfOneGame(gameId) {
        const result = await client.query(`
        SELECT to_char("review"."create_date", 'DD-MM-YYYY HH:MM') AS review_date,
        "review".*,
        "user"."pseudo",
        "user"."picture_url"
        FROM "review"
        JOIN "user" ON "user"."id" = "review"."userId" 
        WHERE "gameId" = $1
        ORDER BY "up_vote" DESC`,[gameId]);
        return result.rows;
    },
    async getAllReviewsOfUser(userId){
        const result = await client.query(`
        SELECT * FROM "review" 
        WHERE "userId" = $1`,[userId]);
        return result.rows;
    },
    async insertReviewOnGame(data,userId,gameId){
        const result = await client.query(`
        INSERT INTO "review" ("content","gameplay_note","soundtrack_note","graphism_note","global_note","userId","gameId")
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,

        [
            data.content,
            data.gameplay_note,
            data.soundtrack_note,
            data.graphism_note,
            data.global_note,
            userId,
            gameId
        ]);

        return result.rows[0]
    },
    async updateReview(field,value,id) {
        const result = await client.query(`UPDATE "review" SET ${field} = $1 WHERE "id" = $2 RETURNING *`,[value,id]);
        return result.rows[0];
    },
    async getPopularityOfOneGame(gameId) {
       const result = await client.query(`
       SELECT COUNT(*),
       ROUND(AVG("gameplay_note")) AS gameplay_note_global,
       ROUND(AVG("soundtrack_note")) AS soundtrack_note_global,  
       ROUND(AVG("graphism_note")) AS graphism_note_global, 
       ROUND(AVG("global_note")) AS global_note_global
       FROM "review" WHERE "gameId"=$1;`,[gameId]);
       return result.rows[0]; 
    },
    async getGlobalNote(gameId){
    const result = await client.query(`
       SELECT COUNT(*), 
       ROUND(AVG("global_note")) AS global_note_global
       FROM "review" WHERE "gameId"=$1;`,[gameId]);
       return result.rows[0]
    },
    async reportReview(id) {
        const result = await client.query(`UPDATE "review" SET "report" = ("report"+1) WHERE "id" = $1 RETURNING *`,[id]);
        return result.rows[0]
    },
    async upVoteReview(id) {
        const result = await client.query(`UPDATE "review" SET "up_vote" = ("up_vote"+1) WHERE "id" = $1 RETURNING *`,[id]);
        return result.rows[0]
    },
    async downVoteReview(id) {
        const result = await client.query(`UPDATE "review" SET "down_vote" = ("down_vote"+1) WHERE "id" = $1 RETURNING *`,[id]);
        return result.rows[0]
    }
}