const TelegramBot = require('node-telegram-bot-api');
const htmlValidator = require('html-validator');
const { validate } = require('./node_modules/html-validator');


const botToken = '6122214810:AAH2HudmeBy4Akoda9RL1xRtSx72pBI04SA';
const bot = new TelegramBot(botToken, { polling: true });

const tags = {
  "html": [
    { "name": "<div>", "description": "Defines a section of the document" },
    { "name": "<p>", "description": "Defines a paragraph" },
    { "name": "<a>", "description": "Defines a hyperlink" },
    { "name": "<img>", "description": "Defines an image" },
    { "name": "<table>", "description": "Defines a table" },
    { "name": "<ul>", "description": "Defines an unordered list" },
    { "name": "<ol>", "description": "Defines an ordered list" },
    { "name": "<li>", "description": "Defines a list item" }
  ],
  "forms": [
    { "name": "<form>", "description": "Defines an HTML form for user input" },
    { "name": "<input>", "description": "Defines an input control" },
    { "name": "<select>", "description": "Defines a drop-down list" }
  ]
};

// Function to generate the keyboard with tags
function generateTagsKeyboard(category) {
  const tagsArray = tags[category];
  const keyboard = tagsArray.map(tag => [{ text: `${tag.name}` }]);
  keyboard.push([{ text: 'Back to categories', callback_data: 'back' }]);
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

// Function to generate the keyboard with categories
function generateCategoriesKeyboard() {
  const categories = Object.keys(tags);
  const keyboard = categories.map(category => [{ text: `${category}`, callback_data: `${category}` }]);
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

// Handle the command /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello! What tag or category would you like to know about?", generateCategoriesKeyboard());
});

// Handle callback queries from the inline keyboard
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  if (query.data === 'back') {
    bot.sendMessage(chatId, "What tag or category would you like to know about?", generateCategoriesKeyboard());
  } else if (tags.hasOwnProperty(query.data)) {
    bot.sendMessage(chatId, `Select a tag from the ${query.data} category:`, generateTagsKeyboard(query.data));
  } else {
    const tag = tags[query.data].find(t => t.name === query.message.text);
    bot.sendMessage(chatId, tag.description);
  }
});

// Handle any other text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  
  // Check if message is HTML code
  const isHTML = message.startsWith('<') && message.endsWith('>');
  
  if (isHTML) {
    // Validate HTML code
    const result = await htmlValidator({
      data: message,
      format: 'text'
    });
    
    if (result.length > 0) {
      // There are errors in the HTML code
      let errorMessage = 'The following errors were found:\n';
// Iterate over errors and fix them if possible
for (const error of result.errors) {
    if (error.ruleId === "tag-not-closed") {
      // If the error is about an unclosed tag, try to find the tag and close it
      const unclosedTag = error.element;
      const lastOpenTag = stack.pop();
      if (lastOpenTag && lastOpenTag.tagName === unclosedTag.tagName) {
        // If the last open tag matches the unclosed tag, close it
        lastOpenTag.closeTagIndex = unclosedTag.startIndex - 1;
        fixedCode = replaceTag(fixedCode, lastOpenTag);
      } else {
        // If there's no matching open tag, insert a closing tag before the unclosed tag
        const closingTag = createClosingTag(unclosedTag.tagName, unclosedTag.startIndex);
        fixedCode = insertClosingTag(fixedCode, closingTag);
      }
    } else if (error.ruleId === "tag-not-opened") {
      // If the error is about a tag not opened, try to find the tag and open it
      const unopenedTag = error.element;
      const openingTag = createOpeningTag(unopenedTag.tagName, unopenedTag.startIndex);
      fixedCode = insertOpeningTag(fixedCode, openingTag);
      stack.push(openingTag);
    }
  }
  
  // Send the fixed code back to the user
  bot.sendMessage(chatId, fixedCode);
// Handle the command /html
bot.onText(/\/html/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Please enter your HTML code:");
  });
  
  // Handle the user's HTML input
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const html = msg.text;
    
    // Validate the HTML using the W3C Markup Validation Service
    const https = require('https');
    const validatorURL = `https://validator.w3.org/nu/?out=json`;
    const postData = `<!DOCTYPE html><html><head><title>Test</title></head><body>${html}</body></html>`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
        'Content-Length': postData.length,
      },
    };
    const req = https.request(validatorURL, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body).messages;
          if (result.length === 0) {
            bot.sendMessage(chatId, "Your HTML is valid!");
          } else {
            let response = "Your HTML has the following issues:\n\n";
            for (const error of result) {
              response += `${error.type}: ${error.message}\n`;
              if (error.extract) {
                response += `${error.extract}\n`;
              }
              response += `\n`;
            }
            bot.sendMessage(chatId, response);
          }
        } catch (e) {
          console.error(e);
          bot.sendMessage(chatId, "Sorry, there was an error processing your HTML.");
        }
      });
    });
    req.on('error', (error) => {
      console.error(error);
      bot.sendMessage(chatId, "Sorry, there was an error processing your HTML.");
    });
    req.write(postData);
    req.end();
  });
}}})
