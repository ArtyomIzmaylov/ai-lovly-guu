const {Composer, Markup, Scenes} = require("telegraf");
const {UserManager} = require("../ManagerServices");
const {UserRepository} = require("../DatabaseRepository");

class CreateProfileScene {
    createScene() {
        const start = new Composer();
        const faculty = new Composer();
        const course = new Composer();
        const gender = new Composer();
        const name = new Composer();
        const age = new Composer();
        const photo = new Composer();
        const description = new Composer();
        const userManager = new UserManager();
        const userRepository = new UserRepository();
        const startMenu = Markup.keyboard([
            ['Создать анкету'],
            ['Поиск', 'Взаимные симпатии']
        ]).oneTime().resize();

        start.on('text', async (ctx) => {
            try {
                ctx.wizard.state.data = {};
                await ctx.reply('Введите ваше имя:');
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        name.on('text', async (ctx) => {
            try {
                const name = ctx.message.text;
                const isValidName = /^[a-zA-Zа-яА-ЯёЁ]+$/.test(name);
                console.log(name)
                if (name.length > 30) {
                    await ctx.reply('Имя слишком длинное. Максимальная длина - 30 символов. Попробуйте снова.');
                    return;
                }
                if (!isValidName) {
                    await ctx.reply('Имя может содержать только русские или английские буквы. Попробуйте снова.');
                    return;
                }
                ctx.wizard.state.data.name = name;
                await ctx.reply('Введите ваш возраст:');
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        age.on('text', async (ctx) => {
            try {
                const age = ctx.message.text;

                if (isNaN(age) || age <= 0 || age > 65) {
                    await ctx.reply('Некорректный возраст. Пожалуйста, введите число от 1 до 65.');
                    return;
                }

                ctx.wizard.state.data.age = age;
                await ctx.reply('Выберите ваш пол:', Markup.keyboard([['Мужской'], ['Женский']]).oneTime().resize());
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        gender.hears(['Мужской', 'Женский'], async (ctx) => {
            try {
                ctx.wizard.state.data.gender = ctx.message.text;
                const keyboardOptions = {
                    columns: 2, // Количество столбцов кнопок
                };

                const facultyKeyboard = Markup.keyboard(['💻ИИС', '💹ИЭФ', '🤝ИУПСиБК', '📈ИМ', '🏭ИОМ', '⚖ИГУиП'], keyboardOptions)

                await ctx.reply('Выберите факультет:', facultyKeyboard.oneTime().resize());
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        faculty.hears(['💻ИИС', '💹ИЭФ', '🤝ИУПСиБК', '📈ИМ', '🏭ИОМ', '⚖ИГУиП'], async (ctx) => {
            try {
                ctx.wizard.state.data.faculty = ctx.message.text;
                const keyboardOptions = {
                    columns: 2, // Количество столбцов кнопок
                };
                const courseKeyboard = Markup.keyboard(['1', '2', '3', '4', '1М', '2М'], keyboardOptions).oneTime().resize();
                await ctx.reply('Выберите курс:', courseKeyboard);
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        course.hears(['1', '2', '3', '4', '1М', '2М'], async (ctx) => {
            try {
                ctx.wizard.state.data.course = ctx.message.text;
                await ctx.reply('Отправьте фотографию:');
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });
        photo.on('text', async (ctx) => {
            try {
                await ctx.reply('Я жду фото!!!!');
            } catch (e) {
                console.log(e);
            }
        })
        photo.on('photo', async (ctx) => {
            try {
                ctx.wizard.state.data.photo = ctx.message.photo[0].file_id;
                await ctx.reply('Расскажите о себе:');
                return ctx.wizard.next();
            } catch (e) {
                console.log(e);
            }
        });

        description.on('text', async (ctx) => {
            try {
                const description = ctx.message.text;
                const sanitizedDescription = description
                    .replace(/<.*?>/g, '')  // Удалить HTML-теги
                    .replace(/\/\w+/g, '')
                    .replace(/@/g, '')
                    .replace(/https ?:\/\/\S+/g, '')
                if (description.length > 250) {
                    await ctx.reply('Описание слишком длинное. Максимальная длина - 250 символов. Попробуйте снова.');
                    return;
                }
                ctx.wizard.state.data.description = sanitizedDescription;
                const user = await userRepository.findByTelegramId(ctx.from.id);
                if (user !== null) {
                    await userManager.delete(user.id);
                }

                await userManager.create({
                    name: ctx.wizard.state.data.name,
                    age: ctx.wizard.state.data.age,
                    gender: ctx.wizard.state.data.gender,
                    faculty: ctx.wizard.state.data.faculty,
                    course: ctx.wizard.state.data.course,
                    photo: ctx.wizard.state.data.photo,
                    description: ctx.wizard.state.data.description,
                    telegram_id: ctx.from.id,
                    username: ctx.from.username
                });

                const formattedDescription = `
║ *Имя:* ${ctx.wizard.state.data.name}
║ *Возраст:* ${ctx.wizard.state.data.age}
║ *Пол:* ${ctx.wizard.state.data.gender}
║ *Факультет:* ${ctx.wizard.state.data.faculty}
║ *Курс:* ${ctx.wizard.state.data.course}
║ *Описание:* ${ctx.wizard.state.data.description}
║ *Пол:* ${ctx.wizard.state.data.gender}
║ *Факультет:* ${ctx.wizard.state.data.faculty}
║ *Курс:* ${ctx.wizard.state.data.course}
║ *Описание:* ${ctx.wizard.state.data.description}
`;
                await ctx.replyWithPhoto(ctx.wizard.state.data.photo, {
                    caption: formattedDescription,
                    parse_mode: 'Markdown'
                });

                await ctx.reply('Супер! Анкета создана :)', startMenu)
                return ctx.scene.leave();
            } catch (e) {
                console.log(e);
            }
        });

        return new Scenes.WizardScene('createProfileWizard', start, name, age, gender, faculty, course, photo, description);
    }
}

module.exports = CreateProfileScene
