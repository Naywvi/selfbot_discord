module.exports = {
    name: "clear",
    description: "Supprime les messages de x à l'infini",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!clear')) {
                const args = message.content.split(' ');
                const numberToDelete = parseInt(args[1], 10) || 100;

                message.channel.messages.fetch({ limit: numberToDelete })
                    .then(messages => {
                        const myMessages = messages.filter(msg => msg.author.id === client.user.id);
                        const deletePromises = myMessages.map(msg => msg.delete().catch(err => console.log("Error lors de la supression des messages. Ils ont tous été supprimés.")));
                        return Promise.all(deletePromises);
                    })
                    .then(deletedMessages => {
                        message.channel.send(`Supprimé ${deletedMessages.length} messages.`).then(msg => {
                            setTimeout(() => msg.delete().catch(err => console.log("Error lors de la suppréssion du message du bot.")), 1000);
                        });
                    })
                    .catch(err => {
                        // console.log(err);
                        message.channel.send('Impossible de supprimer certains messages. Peut-être sont-ils trop anciens.');
                    });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
