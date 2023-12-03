const {Markup} = require("telegraf");
const firstMenu  = Markup.keyboard([
    ['Создать анкету']

]);
const startMenu = Markup.keyboard([
    ['Поиск', 'Взаимные симпатии'],
    ['Пересоздать анкету', 'Удалить анкету']

]);

module.exports = {
    startMenu,
    firstMenu
}