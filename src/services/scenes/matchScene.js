const Database = require("../DatabaseService");
const {databaseConfig} = require("../../config");
const {Composer, Markup, Scenes} = require("telegraf");
const {UserRepository, LikeRepository} = require("../DatabaseRepository");
const {LikeManager} = require("../ManagerServices");
const {startMenu} = require("../Menu");


class MatchScene {
    constructor() {
        this.db = Database.getInstance(databaseConfig);
    }
    createScene() {
        const start = new Composer()
        const choice = new Composer()
        const likeRepository = new LikeRepository()
        const userRepository = new UserRepository()
        const likeManager = new LikeManager()
        const createMenu = Markup.keyboard([
            ['Перейти к следующей анкете'], ['Выйти']
        ])
        start.on('text', async (ctx) =>{
            try {
                const matchedUser = await userRepository.findByTelegramId(ctx.from.id)
                const likeValue = await likeRepository.findMatch(matchedUser.id)
                const user = await userRepository.find(likeValue[0].who_liked_user)
                ctx.wizard.state.data = {
                    user : user
                }
                console.log(user)
                const formattedUserInfo = `
║ *Имя:* ${user.name}
║ *Возраст:* ${user.age}
║ *Институт:* ${user.faculty}
║ *Курс:* ${user.course}
║ *Описание:* ${user.description}
`;
                console.log(user.photo)
                try {
                    await ctx.replyWithPhoto(user.photo, {
                        caption: formattedUserInfo,
                        parse_mode: 'Markdown'
                    });
                    await ctx.reply(`@${user.username}`)
                }
                catch (e) {
                    console.log(e)
                }

                await ctx.reply(":)", createMenu.oneTime().resize())
                return ctx.wizard.next()
            }
            catch (e) {
                const noLike = 'Cannot read properties of undefined (reading \'who_liked_user\')'
                if (e instanceof Error && e.message === noLike) {
                    await ctx.reply("Взаимных симпатий пока нет, но ты не растраивайся, будут-будут :)", startMenu.oneTime().resize())
                    return ctx.scene.leave()
                }
            }

        })
        choice.hears('Выйти', async (ctx) => {
            await ctx.reply(':)', startMenu.oneTime().resize())
            return ctx.scene.leave()
        })
        choice.hears('Перейти к следующей анкете', async (ctx) => {
            await likeManager.update(ctx.wizard.state.data.user.id, true)
            return ctx.scene.enter('matchScene')
        })

        return new Scenes.WizardScene('matchScene', start, choice)
    }

}

module.exports = MatchScene
