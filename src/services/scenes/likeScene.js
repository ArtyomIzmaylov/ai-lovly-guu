const Database = require("../DatabaseService");
const {databaseConfig} = require("../../config");
const {Composer, Markup, Scenes} = require("telegraf");
const {UserRepository, LikeRepository} = require("../DatabaseRepository");
const {LikeManager} = require("../ManagerServices");
const {startMenu, createMenu, likeSceneMenu} = require("../Menu");


class LikeScene {
    constructor() {
        this.db = Database.getInstance(databaseConfig);
    }
    createScene() {
        const start = new Composer()
        const choice = new Composer()
        const likeRepository = new LikeRepository()
        const userRepository = new UserRepository()
        const likeManager = new LikeManager()

        start.on('text', async (ctx) => {
            try {
                const currentUser = await userRepository.findByTelegramId(ctx.from.id)
                console.log(currentUser)
                const likeValue = await likeRepository.findLikeSender(currentUser.id) //WHO_LIKED_USER = currentUser
                if (likeValue[0] === undefined) {
                    await ctx.reply('Лайков пока нет...')
                    await ctx.reply('Но не переживай, скоро появятся :)', startMenu.oneTime().resize())
                    return ctx.scene.leave()
                }

                const likeSender = await userRepository.find(likeValue[0].user_id)
                ctx.wizard.state.data = {
                    user_id : likeValue[0].user_id, //like sender
                    who_liked_user: likeValue[0].who_liked_user, //current user
                    likeSenderUsername : likeSender.username
                }
                const formattedUserInfo = `
║ *Имя:* ${likeSender.name}
║ *Возраст:* ${likeSender.age}
║ *Институт:* ${likeSender.faculty}
║ *Курс:* ${likeSender.course}
║ *Описание:* ${likeSender.description}
`;
                try {
                    await ctx.replyWithPhoto(likeSender.photo, {
                        caption: formattedUserInfo,
                        parse_mode: 'Markdown'
                    });
                }
                catch (e) {
                    console.log(e)
                }
                await ctx.reply("ヽ(°□° )ノ", likeSceneMenu.oneTime().resize())
                return ctx.wizard.next()

            }
            catch(e) {

            }
        })
        choice.hears('Лайк', async (ctx) => {
            await likeManager.delete(ctx.wizard.state.data.who_liked_user, ctx.wizard.state.data.user_id)
            await likeManager.create({
                user_id : ctx.wizard.state.data.who_liked_user, //current user 17
                who_liked_user: ctx.wizard.state.data.user_id, //like sender 18
                rate : true,
                is_done : false,
                is_like : false
            })
            await likeManager.updateLike(ctx.wizard.state.data.who_liked_user, ctx.wizard.state.data.user_id)
            await likeManager.updateDone(ctx.wizard.state.data.who_liked_user, ctx.wizard.state.data.user_id)
            await ctx.reply(`Ник :) @${ctx.wizard.state.data.likeSenderUsername}`)
            return ctx.scene.enter('likeScene')
        })
        choice.hears('Дизлайк', async (ctx) => {

            await likeManager.create({
                user_id : ctx.wizard.state.data.who_liked_user,
                who_liked_user: ctx.wizard.state.data.user_id,
                rate : false,
                is_done: false,
                is_like : false
            })
            await likeManager.updateLike(ctx.wizard.state.data.user_id, ctx.wizard.state.data.who_liked_user)
            await likeManager.updateDone(ctx.wizard.state.data.user_id, ctx.wizard.state.data.who_liked_user)

            return ctx.scene.enter('likeScene')
        })
        choice.hears('Выйти', async(ctx) => {
            await ctx.reply(':)', startMenu.oneTime().resize())
            return ctx.scene.leave()
        })

        return new Scenes.WizardScene('likeScene', start, choice)


    }

}

module.exports = LikeScene
