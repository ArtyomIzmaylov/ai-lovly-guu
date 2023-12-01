const {Scenes, Telegraf, session, Markup} = require("telegraf");
const {botConfig, databaseConfig} = require("../config");
const Database = require("./DatabaseService");
const CreateProfileScene = require("./scenes/createProfileScene");
const FindProfileScene = require("./scenes/findProfileScene");
const MatchScene = require("./scenes/matchScene");

const db = Database.getInstance(databaseConfig);


function mainBot2() {

    const createProfileWizard = new CreateProfileScene().createScene()
    const findProfileWizard = new FindProfileScene().createScene()
    const matchWizard = new MatchScene().createScene()
    const stage = new Scenes.Stage([createProfileWizard, findProfileWizard, matchWizard] );
    const bot = new Telegraf(botConfig.botToken);
    bot.use(session())
    bot.use(stage.middleware())
    bot.hears('Создать анкету', ctx => ctx.scene.enter('createProfileWizard'))
    bot.hears('Поиск', ctx => ctx.scene.enter('findProfileScene'))
    bot.hears('Взаимные симпатии', ctx => ctx.scene.enter('matchScene'))
    bot.start(async (ctx) => {
        try {
            await ctx.reply("Выбери", Markup.keyboard([
                ['Создать анкету'],
                ['Поиск', 'Взаимные симпатии']]).oneTime().resize())
        }
        catch (e) {
            console.log(e)
        }
    })
    bot.launch()
}



mainBot2()

