const RPC = require('discord-rpc');
const clientId = ''; // Remplacez par l'ID de votre application Discord

RPC.register(clientId);


const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
    rpc.setActivity({
        state: 'Playing Solo',
        details: 'Competitive',
        startTimestamp: 1507665886,
        endTimestamp: 1507665886,
        largeImageKey: 'kindpng_1016305', // Clé de la grande image
        largeImageText: "Numbani",
        smallImageKey: '115774-navi-hd-image-free', // Clé de la petite image
        smallImageText: "Rogue - Level 100",
        partyId: 'ae488379-351d-4a4f-ad32-2b9b01c91657',
        partySize: 1,
        partyMax: 5,
        joinSecret: 'MTI4NzM0OjFpMmhuZToxMjMxMjM='
    });

    console.log('Rich Presence updated');
});


// Connexion au client RPC avec l'ID de l'application
rpc.login({ clientId }).catch(console.error);

//https://www.veryicon.com/icons/commerce-shopping/flat-icons-for-business-and-finance/