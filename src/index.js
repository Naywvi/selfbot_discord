const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const { initializeRoutes } = require('./selfroutes');
const clc = require('cli-color');
const dotenv = require('dotenv');
dotenv.config();

client.commands = new Map();

// Charger toutes les routes
initializeRoutes(client);

client.on('ready', () => {
    console.log(`${clc.bgRedBright.white.bold(`💥  ${client.user.username} IS READY 💥 `)}`);
});

client.on('messageCreate', message => {
    if (message.author.id === client.user.id) {
        client.commands.forEach(command => {
            if (command.execute) {
                command.execute(message, client);
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN); 