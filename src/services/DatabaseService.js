const pgPromise = require('pg-promise');

class Database {
    constructor(config) {
        const pgp = pgPromise();
        this.db = pgp(config);
    }
    static getInstance(config) {
        if (!Database.instance) {
            Database.instance = new Database(config);
        }
        return Database.instance;
    }
    getDB() {
        return this.db;
    }
    async query(sql, values) {
        try {
            return await this.db.any(sql, values);
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
}

module.exports = Database;
