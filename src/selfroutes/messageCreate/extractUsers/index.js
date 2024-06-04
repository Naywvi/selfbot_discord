const fs = require('fs');

module.exports = {
    name: "extractUsers",
    description: "Aspire tous les utilisateurs d'un serveur et enregistre leurs informations dans un fichier JSON",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!extractUsers')) {
                // Supprimer le message de commande
                await message.delete();

                const args = message.content.split(' ');
                const targetGuildId = args[1] || message.guild.id; // Utiliser l'ID du serveur spécifié ou le serveur actuel

                const guild = client.guilds.cache.get(targetGuildId);
                if (!guild) {
                    message.channel.send(`# erreur\nLe serveur avec l'ID ${targetGuildId} n'a pas été trouvé.`);
                    return;
                }

                // Assurer le cache des membres est rempli
                await guild.members.fetch();

                // Obtenir les informations des utilisateurs
                const usersData = guild.members.cache.map(member => ({
                    id: member.user.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                    roles: member.roles.cache.map(role => role.id)
                }));

                // Fonction de sérialisation pour gérer les BigInt
                const replacer = (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                };

                // Enregistrer les données dans un fichier .json avec le nom du serveur
                const fileName = `users_${guild.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
                fs.writeFileSync(`./src/cloneServers/${fileName}`, JSON.stringify(usersData, replacer, 2), 'utf-8');
                message.channel.send(`Informations des utilisateurs du serveur sauvegardées avec succès dans ${fileName}.`);
            }
        } catch (err) {
            console.log(err);
            if (message.channel) {
                message.channel.send('# erreur\nUne erreur est survenue lors de la sauvegarde des informations des utilisateurs.');
            }
        }
    }
}
