const {Markup} = require("telegraf");
const firstMenu  = Markup.keyboard([
    ['Создать анкету']

]);
const startMenu = Markup.keyboard([
    ['Поиск', 'Взаимные симпатии'],
    ['Пересоздать анкету', 'Удалить анкету']
]);

const matchMenu = Markup.keyboard([
    ['Перейти к следующей анкете'], ['Выйти']
])

const likeSceneMenu = Markup.keyboard([
    ['Лайк', 'Дизлайк'], ['Выйти']
])
module.exports = {
    startMenu,
    firstMenu,
    likeSceneMenu,
    matchMenu
}