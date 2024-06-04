const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "geo",
    description: "Fetches geolocation information for an IP address and displays a map",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!find ')) {
                const args = message.content.split(' ');
                const ipAddress = args[1];
                if (!ipAddress) return message.channel.send('Veuillez fournir une adresse IP.');

                const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
                const data = response.data;

                const geoInfo = `json
IP Address: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country}
Location: ${data.loc}
Organization: ${data.org}
Postal: ${data.postal}
Timezone: ${data.timezone}`;

                // Split location into latitude and longitude
                const [latitude, longitude] = data.loc.split(',');

                // Fetch map from OpenStreetMap Static API
                const mapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&z=10&l=map&size=450,450&pt=${longitude},${latitude},pm2rdm`;

                const mapResponse = await fetch(mapUrl);
                const buffer = await mapResponse.buffer();
                const mapPath = path.resolve(__dirname, `../../../../${ipAddress}_map.png`);

                fs.writeFileSync(mapPath, buffer);

                // Create the attachment
                const attachment = new AttachmentBuilder(mapPath);

                // Send the map and geolocation info
                await message.channel.send({
                    content: `# Informations de géolocalisation pour ${ipAddress}:\n\`\`\`${geoInfo}\`\`\`\n# Map:`,
                    files: [attachment]
                });

                // Delete the map file after sending
                fs.unlinkSync(mapPath);

                // Delete the command message
                message.delete().catch(err => console.log(err));
            }
        } catch (err) {
            console.log(err);
            message.channel.send('Échec de la récupération des informations de géolocalisation. Veuillez réessayer plus tard.');
        }
    }
}
