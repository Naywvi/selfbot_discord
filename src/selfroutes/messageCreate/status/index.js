module.exports = {
    name: "status",
    description: "Affiche le statut du bot",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!status')) {
                const startTime = Date.now();
                message.channel.send('🟢 Bot is active!').then(sentMessage => {
                    const endTime = Date.now();
                    const responseTime = endTime - startTime;
                    sentMessage.edit(`🟢 Bot is active! Réponse en ${responseTime} ms.`);
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
