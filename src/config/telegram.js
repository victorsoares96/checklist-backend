const { TelegramClient } = require('messaging-api-telegram');

const telegram = new TelegramClient({
  accessToken: process.env.TELEGRAM_BOT_TOKEN,
});

module.exports = telegram;