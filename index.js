const { Telegraf } = require('telegraf')
const token = '6122214810:AAH2HudmeBy4Akoda9RL1xRtSx72pBI04SA'
const bot = new Telegraf(process.env.token)

bot.launch()
  .then(() => console.log('Bot started'))
  .catch((err) => console.error(err))

//do cmd that will send message to everyone whomuse bot (and to the terminal)
const users = [] // store users who have used the bot
// Your code to add users to this list goes here

const message = "Hello everyone!"

users.forEach(user => {
  console.log(`Sending message "${message}" to ${user}`)
  // Your code to send the message to each user goes here
})

console.log(`Message sent: "${message}"`) // display message in the terminal
