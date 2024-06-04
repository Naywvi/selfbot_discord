const fs = require('fs');

module.exports = {
    name: "create",
    description: "Ajoute la configuration d'un serveur existant à partir d'un fichier JSON",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!create')) {
                const args = message.content.split(' ');
                const baseFileName = args[1];
                const targetGuildId = args[2] || message.guild.id; // Utiliser l'ID du serveur actuel si non spécifié

                if (!baseFileName) {
                    // Lister les fichiers JSON disponibles dans le dossier /src/cloneServers
                    const files = fs.readdirSync('./src/cloneServers')
                        .filter(file => file.endsWith('.json'))
                        .map(file => '> ### ' + file.replace('.json', ''));
                    if (files.length === 0) {
                        if (message.channel) {
                            message.channel.send('# Aucun fichier JSON trouvé dans le dossier /src/cloneServers.');
                        }
                    } else {
                        if (message.channel) {
                            message.channel.send('# Fichiers de configuration disponibles :\n' + files.join('\n'));
                        }
                    }
                    return;
                }

                const filePath = `./src/cloneServers/${baseFileName}.json`;
                if (!fs.existsSync(filePath)) {
                    if (message.channel) {
                        message.channel.send(`# erreur\nLe fichier ${baseFileName}.json n'existe pas dans le dossier /src/cloneServers.`);
                    }
                    return;
                }

                const guildData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const targetGuild = client.guilds.cache.get(targetGuildId);

                if (!targetGuild) {
                    if (message.channel) {
                        message.channel.send(`# erreur\nLe serveur avec l'ID ${targetGuildId} n'a pas été trouvé.`);
                    }
                    return;
                }

                // Supprimer les canaux existants
                await Promise.all(targetGuild.channels.cache.map(channel => channel.delete()));

                // Supprimer les rôles existants (sauf les rôles de base)
                await Promise.all(targetGuild.roles.cache.filter(role => role.id !== targetGuild.id).map(role => role.delete()));

                // Créer les rôles
                for (const roleData of guildData.roles) {
                    await targetGuild.roles.create({
                        name: roleData.name,
                        color: roleData.color,
                        hoist: roleData.hoist,
                        permissions: BigInt(roleData.permissions),
                        position: roleData.position
                    });
                }

                // Fonction pour ajouter un délai
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

                // Créer les catégories en premier
                const createdCategories = {};
                for (const category of guildData.channels.filter(channel => channel.type === 'GUILD_CATEGORY')) {
                    const createdCategory = await targetGuild.channels.create(category.name, {
                        type: 'GUILD_CATEGORY',
                        position: category.position
                    });
                    createdCategories[category.id] = createdCategory.id;
                    await delay(1000); // Délai de 1 seconde entre les créations de canaux
                }

                // Créer les autres canaux et les placer dans les bonnes catégories
                for (const channelData of guildData.channels.filter(channel => channel.type !== 'GUILD_CATEGORY')) {
                    await targetGuild.channels.create(channelData.name, {
                        type: channelData.type,
                        parent: channelData.parentID ? createdCategories[channelData.parentID] : null,
                        position: channelData.position
                    });
                    await delay(1000); // Délai de 1 seconde entre les créations de canaux
                }

                // if (message.channel) {
                //     message.channel.send('Configuration du serveur appliquée avec succès.');
                // }
            }
        } catch (err) {
            console.log(err);
            if (message.channel) {
                message.channel.send('# erreur\nUne erreur est survenue lors de l\'application de la configuration du serveur.');
            }
        }
    }
}
