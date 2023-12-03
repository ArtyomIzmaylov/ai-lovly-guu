const {Composer, Markup, Scenes} = require("telegraf");
const {UserManager} = require("../ManagerServices");
const {UserRepository} = require("../DatabaseRepository");
const {startMenu, firstMenu} = require("../Menu");

class DeleteProfileScene {

    createScene() {
        const start = new Composer();
        const choice = new Composer()
        const userManager = new UserManager()
        const userRepository = new UserRepository()
        start.on('text', async (ctx) => {
            try {
                const keyboardOptions = {
                    columns: 2, // Количество столбцов кнопок
                };
                await ctx.reply('При удалении анкеты ты выходишь из поиска, и чтобы вернутся обратно, нужно будет создать новую')
                const choiceKeyboard = Markup.keyboard(['Да', 'Нет'], keyboardOptions)
                await ctx.reply('Ты действительно хочешь удалить?', choiceKeyboard.oneTime().resize());
                return ctx.wizard.next();
            }
            catch (e) {
                await ctx.reply(`Произошла ошибка, ${e}`)
                return ctx.scene.leave()
            }
        })
        choice.hears('Да', async(ctx) => {
            try {
                const user = await userRepository.findByTelegramId(ctx.from.id)
                if (user !== null) {
                    await userManager.delete(user.id)
                    ctx.reply('Анкета удалена успешно!', firstMenu.oneTime().resize())
                }
                else {
                    ctx.reply('Анкета не найдена')
                }
                return ctx.scene.leave()
            }
            catch (e) {
                await ctx.reply(`Произошла ошибка, ${e}`)
                return ctx.scene.leave()
            }
        })
        choice.hears('Нет', async(ctx) => {
            await ctx.reply(':)', startMenu.oneTime().resize())
            return ctx.scene.leave()
        })
        return new Scenes.WizardScene('deleteProfile', start, choice)

    }

}

module.exports = DeleteProfileScene
