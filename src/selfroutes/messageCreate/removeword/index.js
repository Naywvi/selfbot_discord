const fs = require('fs');
const path = require('path');
const blacklistPath = path.resolve(__dirname, '../../../../blacklist.json');

module.exports = {
    name: "removeword",
    description: "Supprime un mot de la liste noire",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!removeword ')) {
                const wordToRemove = message.content.split(' ')[1];
                let blacklist = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
                if (blacklist.includes(wordToRemove)) {
                    blacklist = blacklist.filter(word => word !== wordToRemove);
                    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 4));
                    message.channel.send(`Le mot "${wordToRemove}" a été supprimé de la liste noire.`);
                } else {
                    message.channel.send(`Le mot "${wordToRemove}" n'est pas dans la liste noire.`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}
