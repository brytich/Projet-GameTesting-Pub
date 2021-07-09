require('dotenv').config()
const client = require('../client');

module.exports = {
   async findAdminInDatabase (email) {
        const result = await client.query(`
        SELECT * FROM "admin" WHERE "email" = $1`,[email])
        return result.rows[0];
   },
   async getAllReports() {
        const result = await client.query(`
        SELECT * FROM "review"
        WHERE "report" > 0`);
        return result.rows;
   },
   async getAllMessages() {
       const result = await client.query(`
       SELECT * FROM "message"`);
       return result.rows
   },
   async deleteReviewReported(reviewId) {
       const result = await client.query(`
       DELETE FROM review WHERE "id" = $1`,[reviewId]);
       return result.rows[0];
   },
   async cleanReviewReportedForNothing(reviewId) {
        const result = await client.query(`UPDATE "review" SET "report" = 0 WHERE "id" = $1 RETURNING *`,[reviewId]);
        return result.rows[0];
   }
}