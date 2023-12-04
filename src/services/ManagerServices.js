const Database = require('./DatabaseService');

class UserManager {
    constructor() {
        this.db = Database.getInstance();
    }

    async create(item) {
        try {
            const result = await this.db.getDB().one(
                'INSERT INTO "user"(name, age, photo, description, telegram_id, gender, username, faculty, course) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                [item.name, item.age, item.photo, item.description, item.telegram_id, item.gender, item.username, item.faculty, item.course]
            );
            console.log('Item created:', result);
            return result;
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    async update(id, updatedItem) {
        try {
            const result = await this.db.getDB().one(
                'UPDATE "user" SET name = $1, age = $2, photo = $3, description = $4 WHERE id = $5 RETURNING *',
                [updatedItem.name, updatedItem.age, updatedItem.photo, updatedItem.description, id]
            );
            console.log('Item updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await this.db.query('DELETE FROM "user" WHERE id = $1 RETURNING *', [id]);
            console.log('Item deleted:', result);
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }
}


class LikeManager {
    constructor() {
        this.db = Database.getInstance();
    }

    async create(likeData) {
        try {
            const result = await this.db.getDB().one(
                'INSERT INTO "like" (user_id, who_liked_user, rate, is_done, is_like) VALUES($1, $2, $3, $4, $5) RETURNING *',
                [likeData.user_id, likeData.who_liked_user, likeData.rate, likeData.is_done, likeData.is_like]
            );
            console.log('Like created:', result);
            return result;
        } catch (error) {
            console.error('Error creating like:', error);
            throw error;
        }
    }

    async update(user_id, isDone) {
        try {
            const result = await this.db.query(
                `UPDATE "like" SET is_done = $1 WHERE who_liked_user = $2 RETURNING *`,
                [isDone, user_id]
            );
            return result;
        } catch (error) {
            console.error('Error updating like:', error);
            throw error;
        }
    }

    async updateDone(user_id, who_liked_user) { //likeSender, currentUser
        try {
            const result = await this.db.query( //user_id = 17, who_liked_user = 18
                `UPDATE "like" SET is_done = true WHERE user_id = $1 AND who_liked_user = $2 RETURNING *`,
                [user_id, who_liked_user]
            );
            return result;
        } catch (error) {
            console.error('Error updating like:', error);
            throw error;
        }
    }
    async updateLike(user_id, who_liked_user) { //current user, likeSEnder
        try {
            const result = await this.db.query( //user_id = 17, who_liked_user = 18
                `UPDATE "like" SET is_like = true WHERE user_id = $1 AND who_liked_user = $2 RETURNING *`,
                [user_id, who_liked_user]
            );
            return result;
        } catch (error) {
            console.error('Error updating like:', error);
            throw error;
        }
    }


    async deleteLike(user_id, who_liked_user) { //likeSender, currentUser
        try {
            const result = await this.db.query( //user_id = 17, who_liked_user = 18
                `UPDATE "like" SET is_like = true WHERE user_id = $1 AND who_liked_user = $2 RETURNING *`,
                [user_id, who_liked_user]
            );
            return result;
        } catch (error) {
            console.error('Error updating like:', error);
            throw error;
        }
    }
    async delete(user_id) {
        try {
            const result = await this.db.query('DELETE FROM "like" WHERE user_id = $1 RETURNING *', [user_id]);
            console.log('Like deleted:', result);
            return result;
        } catch (error) {
            console.error('Error deleting like:', error);
            throw error;
        }
    }
}

module.exports = {
    LikeManager, UserManager
}
