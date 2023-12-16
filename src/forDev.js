const CreateProfileScene = require("./services/scenes/createProfileScene");
const FindProfileScene = require("./services/scenes/findProfileScene");
const MatchScene = require("./services/scenes/matchScene");
const {Scenes, Telegraf, session, Markup} = require("telegraf");
const {botConfig, databaseConfig} = require("./config");
const Database = require("./services/DatabaseService");
const {UserRepository} = require("./services/DatabaseRepository");

const db = Database.getInstance(databaseConfig);

function mainBot2() {
    const createProfileWizard = new CreateProfileScene().createScene()
    const findProfileWizard = new FindProfileScene().createScene()
    const matchWizard = new MatchScene().createScene()
    const bot = new Telegraf(botConfig.botToken);


    const userRepository = new UserRepository()

    const users1 = userRepository.findAll()
        .then(data => console.log(data.forEach(el => {
            bot.telegram.sendMessage(el.telegram_id, `

Привет! Провелись технические работы, список улучшений ниже:

- Взаимные симпатии теперь работаю корректно
- Когда тебя кто-то лайкает, приходит уведомление
- Анкету теперь можно удалить
            
Удачи :)
            `)
                .then(sentMessage => {
                    console.log('Message sent successfully:', sentMessage);
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                })
        })))


    bot.launch()
}

mainBot2()
