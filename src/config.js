const path = require('path');
const Process = require("process");
const dotenvPath = path.resolve(__dirname, '../','.env'); // Замените 'config' на ваш путь
require('dotenv').config({ path: dotenvPath });



const databaseConfig = {
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST,
    port : parseInt(process.env.DB_PORT),
    database : process.env.DATABASE
}

const botConfig = {
    botToken : process.env.BOT_TOKEN2
}


module.exports = {
    databaseConfig, botConfig
}
