const client = require('../client');

module.exports = {
   async getEmailInDatabase(email) {
        const result = await client.query('SELECT email FROM "user" WHERE email = $1',[email]);
        return result.rows[0];
   },
   async createUser(data) {
       const result = await client.query(
           `INSERT INTO "user" (pseudo,email,password)
            VALUES ($1,$2,$3) RETURNING *`,
            [
                data.pseudo,
                data.email,
                data.password
            ]
        );
        return result.rows[0];
   },
   async FindUserInDatabase(email) {
        const result = await client.query(`SELECT * FROM "user" WHERE "email" = $1`,[email])
        return result.rows[0];
   },
   async getProfile(pseudo) {
       const result = await client.query(`SELECT * FROM "user" WHERE pseudo = $1`, [pseudo]);
       return result.rows[0];
   },
   async getIdOfMember(pseudo) {
    const result = await client.query(`SELECT id FROM "user" WHERE pseudo = $1`, [pseudo]);
    return result.rows[0];
   },
   async updateProfile(field,value,id) {
    const result = await client.query(`UPDATE "user" SET ${field} = $1 WHERE "id" = $2 RETURNING *`,[value,id]);
    return result.rows[0];
   },
   async messageToAdmin(data) {
    const result = await client.query(
        `INSERT INTO "message" (email,content)
         VALUES ($1,$2) RETURNING *`,
         [
             data.email,
             data.content
         ]
     );

   }
}