const Database = require('./DatabaseService')

class UserRepository {
    constructor() {this.db = Database.getInstance();
    }

    async findByTelegramId(telegram_id) {
        const result = await this.db.query(`SELECT * FROM "user" WHERE telegram_id = $1`, [telegram_id]);
        return result[0] || null;
    }
    async find(id) {
        const result = await this.db.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
        return result[0] || null;
    }

    async findAll() {
        return await this.db.query(`SELECT * FROM "user"`);
    }
}

class LikeRepository {
    constructor() {
        this.db = Database.getInstance();
    }

    async findMatch(id) {
        const result = await this.db.query(`
    SELECT * 
    FROM "like"
    WHERE 
      EXISTS (
        SELECT 1 
        FROM "like" AS t2
        WHERE 
          t2.user_id = "like".who_liked_user
          AND t2.who_liked_user = "like".user_id
          AND t2.rate = true
      )
      AND rate = true 
      AND "like".user_id =$1
      AND "like".is_done <> true 
        LIMIT 1 OFFSET $2;
  `, [id, 0]);
        return result || null;
    }
    async findAllMatch() {
        return await this.db.query(`
    SELECT * 
    FROM "like"
    WHERE 
      EXISTS (
        SELECT 1 
        FROM "like" AS t2
        WHERE 
          t2.user_id = "like".who_liked_user
          AND t2.who_liked_user = "like".user_id
          AND t2.rate = true
      )
      AND rate = true 
  `);
    }
    async findNoLike(user_id, gender, offset) {
        return await this.db.query(`SELECT "user".*
   FROM "user"
   LEFT JOIN "like" ON "user".id = "like".who_liked_user AND "like".user_id = $1
   WHERE "like".id IS NULL AND "user".id != $1 AND "user".gender <> $2 LIMIT 1 OFFSET $3;`, [user_id, gender, offset])
    }
}


module.exports = {
    UserRepository, LikeRepository
}
