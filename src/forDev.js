const CreateProfileScene = require("./services/scenes/createProfileScene");
const FindProfileScene = require("./services/scenes/findProfileScene");
const MatchScene = require("./services/scenes/matchScene");
const {Scenes, Telegraf, session, Markup} = require("telegraf");
const {botConfig, databaseConfig} = require("./config");
const Database = require("./services/DatabaseService");

const db = Database.getInstance(databaseConfig);

function mainBot2() {
    const createProfileWizard = new CreateProfileScene().createScene()
    const findProfileWizard = new FindProfileScene().createScene()
    const matchWizard = new MatchScene().createScene()
    const bot = new Telegraf(botConfig.botToken);

    bot.on('message', async(ctx) => {
        ctx.reply('Сейчас идут технические работы, пожалуйста, подождите немного, скоро все заработает :)')
    })
    bot.launch()
}

mainBot2()
