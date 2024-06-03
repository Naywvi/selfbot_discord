const fs = require('fs');
const path = require('path');
const blacklistPath = path.resolve(__dirname, '../../../../blacklist.json');

module.exports = {
    name: "addword",
    description: "Ajoute un mot à la liste noire",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!addword ')) {
                const newWord = message.content.split(' ')[1];
                let blacklist = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
                if (!blacklist.includes(newWord)) {
                    blacklist.push(newWord);
                    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 4));
                    message.channel.send(`Le mot "${newWord}" a été ajouté à la liste noire.`);
                } else {
                    message.channel.send(`Le mot "${newWord}" est déjà dans la liste noire.`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}
