module.exports = {
    name: "tmp",
    description: "Envoie un message temporaire",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!tmp')) {
                const args = message.content.split(' ');
                let time = 10;
                let tempMessage = '';

                // Vérifier si le deuxième argument est un nombre
                if (!isNaN(args[1])) {
                    time = parseInt(args[1]) || 10;
                    tempMessage = args.slice(2).join(' ');
                } else {
                    tempMessage = args.slice(1).join(' ');
                }

                // Envoie le message temporaire
                message.channel.send(tempMessage).then(sentMessage => {
                    // Supprime le message après le temps spécifié
                    setTimeout(() => {
                        sentMessage.delete().catch(err => console.log(err));
                    }, time * 1000); // Convertit les secondes en millisecondes

                    // Supprime le message de commande
                    message.delete().catch(err => console.log(err));
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
