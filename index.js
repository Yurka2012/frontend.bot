const TelegramBot = require('node-telegram-bot-api');
// импортирую библеотеку для создания бота в телеграм
const bot = new TelegramBot('6122214810:AAH2HudmeBy4Akoda9RL1xRtSx72pBI04SA', { polling: true });
//token
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет! Я твой новый телеграм-бот!');
  });
  //помоги сделать команду для телеграм бота чтобы он при вводе /повтор повторял а /стоп-повтор переставал повторять
  
let repeatMessage = "";
let isRepeatOn = false;

function repeat(bot, message) {
    if (isRepeatOn) {
        bot.sendMessage(message.chat.id, repeatMessage);
    }
}

bot.onText(/\/rpt (.+)/, (message, match) => {
    repeatMessage = match[1];
    isRepeatOn = true;
    bot.sendMessage(message.chat.id, "Повторение включено.");
});

bot.onText(/\/stop-rpt/, (message) => {
    isRepeatOn = false;
    bot.sendMessage(message.chat.id, "Повторение выключено.");
});

//добавь к этому коду сообщение которое я напишу после rpt  и убери /\/stop-rpt/  и покажи весь код с тем что ты добавишь