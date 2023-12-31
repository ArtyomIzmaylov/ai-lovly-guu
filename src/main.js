
const {Scenes, Telegraf, session, Markup} = require("telegraf");
const {botConfig, databaseConfig} = require("./config");
const Database = require("./services/DatabaseService");
const CreateProfileScene = require("./services/scenes/createProfileScene");
const FindProfileScene = require("./services/scenes/findProfileScene");
const MatchScene = require("./services/scenes/matchScene");
const {UserRepository} = require("./services/DatabaseRepository");
const {startMenu, firstMenu} = require("./services/Menu");
const DeleteProfileScene = require("./services/scenes/deleteProfileScene");
const LikeScene = require("./services/scenes/likeScene");

const db = Database.getInstance(databaseConfig);

function mainBot2() {
    const createProfileWizard = new CreateProfileScene().createScene()
    const findProfileWizard = new FindProfileScene().createScene()
    const matchWizard = new MatchScene().createScene()
    const deleteProfileWiard = new DeleteProfileScene().createScene()
    const likeWizard = new LikeScene().createScene()
    const stage = new Scenes.Stage([createProfileWizard, findProfileWizard, matchWizard, deleteProfileWiard] );
    const bot = new Telegraf(botConfig.botToken);
    const userRepository = new UserRepository()
    bot.use(session())
    bot.use(stage.middleware())
    bot.hears('Создать анкету', ctx => ctx.scene.enter('createProfileWizard'))
    bot.hears('Пересоздать анкету', ctx => ctx.scene.enter('createProfileWizard'))
    bot.hears('Поиск', ctx => ctx.scene.enter('findProfileScene'))
    bot.hears('Взаимные симпатии', ctx => ctx.scene.enter('matchScene'))
    bot.hears('Удалить анкету', ctx => ctx.scene.enter('deleteProfile'))
    bot.start(async (ctx) => {
        try {
            const result = await userRepository.findByTelegramId(ctx.from.id)
            if (result !== null) {
                await ctx.reply(":)", startMenu.oneTime().resize())
            }
            else {
                await ctx.reply("Создай анкету :)", firstMenu.oneTime().resize())
            }
        }
        catch (e) {
            console.log(e)
        }
    })
    bot.launch()

}

mainBot2()
