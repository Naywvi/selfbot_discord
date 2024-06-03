const fs = require('fs');
const path = require('path');
const blacklistPath = path.resolve(__dirname, '../../../../blacklist.json');

module.exports = {
    name: "checkInsult",
    description: "Vérifie les insultes dans le message et les remplace par [INSULTE]",
    execute: async (message, client) => {
        try {
            let blacklist = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
            let tempMessage = message.content;
            let containsInsult = false;

            // Vérifiez si le message contient des mots de la liste noire
            blacklist.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                if (regex.test(tempMessage)) {
                    containsInsult = true;
                    tempMessage = tempMessage.replace(regex, '[INSULTE]');
                }
            });

            if (containsInsult) {
                message.delete().catch(err => console.log(err)); // Supprime le message original
                message.channel.send(tempMessage).catch(err => console.log(err)); // Envoie le message modifié
            }
        } catch (err) {
            console.log(err);
        }
    }
}
