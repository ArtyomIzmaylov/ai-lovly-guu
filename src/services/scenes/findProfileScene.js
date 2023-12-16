const {Composer, Scenes, Markup} = require("telegraf");
const Database = require("../DatabaseService");
const {databaseConfig} = require("../../config");
const {UserRepository, LikeRepository} = require("../DatabaseRepository");
const {LikeManager} = require("../ManagerServices");
const {startMenu} = require("../Menu");


class FindProfileScene {
    constructor() {
        this.db = Database.getInstance(databaseConfig);
        this.offset = 0

    }
    createScene() {
        const start = new Composer()
        const choice = new Composer()
        const userRepository = new UserRepository()
        const likeRepository = new LikeRepository()
        const likeManager = new LikeManager()
        const findMenu = Markup.keyboard([
            ['Лайк','Дизлайк'], ['Остановить поиск']
        ])
        start.on('text', async (ctx) =>{
            const currentUser = await userRepository.findByTelegramId(ctx.from.id)
            if (currentUser === null) {
                await ctx.reply("Нужно создать анкету)", Markup.keyboard([
                    ['Создать анкету']
                ]).oneTime().resize())
                return ctx.scene.leave()
            }
            const result = await likeRepository.findNoLike(currentUser.id, currentUser.gender, this.offset)
            const user = result[0]
            if (user === undefined) {
                await ctx.reply('Записи в БД закончились, новых анкет пока не создали...')
                await ctx.reply('Но не переживай, скоро появятся :)', startMenu.oneTime().resize())
                return ctx.scene.leave()
            }
            ctx.wizard.state.data = {
                user_id : currentUser.id,
                who_liked_user: user.id,
                offset : this.offset
            }
            const userInfo = `
║ *Имя:* ${user.name}
║ *Возраст:* ${user.age}
║ *Институт:* ${user.faculty}
║ *Курс:* ${user.course}
║ *Описание:* ${user.description}
`;
            try {
                await ctx.replyWithPhoto(user.photo, {
                    caption : userInfo,
                    parse_mode : 'Markdown'
                })
            }
            catch (e){
                console.log(e)
            }
            await ctx.reply("ヽ(°□° )ノ", findMenu.oneTime().resize())
            return ctx.wizard.next()
        })
        choice.hears('Остановить поиск', async (ctx) => {
            await ctx.reply(':)', startMenu.oneTime().resize())
            return ctx.scene.leave()
        })
        choice.hears('Лайк', async (ctx) => {
            await likeManager.create({
                user_id : ctx.wizard.state.data.user_id,
                who_liked_user: ctx.wizard.state.data.who_liked_user,
                rate : true,
                is_done : false,
                is_like : false
            })
            const likeRecipient = await userRepository.find(ctx.wizard.state.data.who_liked_user)
            console.log(likeRecipient, 'лайкер')
            try {
                await ctx.telegram.sendMessage(likeRecipient.telegram_id, 'Тебя кто-то лайкнул :)')
            }
            catch (e) {
                console.log(e)
            }
            return ctx.scene.enter('findProfileScene')
        })
        choice.hears('Дизлайк', async (ctx) => {
            await likeManager.create({
                user_id : ctx.wizard.state.data.user_id,
                who_liked_user: ctx.wizard.state.data.who_liked_user,
                rate : false,
                is_done : false,
                is_like : false
            })
            return ctx.scene.enter('findProfileScene')
        })

        return new Scenes.WizardScene('findProfileScene', start, choice)
    }

}


module.exports = FindProfileScene
