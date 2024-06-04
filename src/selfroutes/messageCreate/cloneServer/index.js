const fs = require('fs');

module.exports = {
    name: "clone",
    description: "Clone un serveur et enregistre sa configuration dans un fichier .json",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!clone')) {
                // Supprimer le message de commande
                await message.delete();

                // Obtenir les arguments
                const args = message.content.split(' ');
                const targetGuildId = args[1] || message.guild.id; // Utiliser l'ID du serveur spécifié ou le serveur actuel

                const guild = client.guilds.cache.get(targetGuildId);
                if (!guild) {
                    message.channel.send(`# erreur\nLe serveur avec l'ID ${targetGuildId} n'a pas été trouvé.`);
                    return;
                }

                // Obtenir les informations du serveur
                const guildData = {
                    name: guild.name,
                    id: guild.id.toString(),
                    channels: [],
                    roles: [],
                    members: []
                };

                // Obtenir les canaux
                guild.channels.cache.forEach(channel => {
                    guildData.channels.push({
                        id: channel.id.toString(),
                        name: channel.name,
                        type: channel.type,
                        parentID: channel.parentID ? channel.parentID.toString() : null,
                        position: channel.position
                    });
                });

                // Obtenir les rôles
                guild.roles.cache.forEach(role => {
                    guildData.roles.push({
                        id: role.id.toString(),
                        name: role.name,
                        color: role.color,
                        hoist: role.hoist,
                        position: role.position,
                        permissions: role.permissions.bitfield.toString()
                    });
                });

                // Obtenir les membres
                guild.members.cache.forEach(member => {
                    guildData.members.push({
                        id: member.id.toString(),
                        username: member.user.username,
                        discriminator: member.user.discriminator,
                        roles: member.roles.cache.map(role => role.id.toString())
                    });
                });

                // Fonction de sérialisation pour gérer les BigInt
                const replacer = (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                };

                // Enregistrer les données dans un fichier .json avec le nom du serveur
                const fileName = `${guild.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
                fs.writeFileSync(`./src/cloneServers/${fileName}`, JSON.stringify(guildData, replacer, 2), 'utf-8');
                message.channel.send(`Configuration du serveur sauvegardée avec succès dans ${fileName}.`);
            }
        } catch (err) {
            console.log(err);
            message.channel.send('# erreur\nUne erreur est survenue lors de la sauvegarde de la configuration du serveur.');
        }
    }
}
