const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadAsciiArt = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const displayShy = async (message, frames, sleep) => {
    // Phase 1: Superimpose the frames
    let fullMessage = frames[0];
    const sentMessage = await message.channel.send(`\`\`\`${fullMessage}\`\`\``);
    for (let i = 1; i < frames.length; i++) {
        await sleep(500);
        fullMessage += `\n${frames[i]}`;
        await sentMessage.edit(`\`\`\`${fullMessage}\`\`\``);
    }

    // Phase 2: Gradually delete the frames
    for (let i = 0; i < frames.length; i++) {
        await sleep(500);
        fullMessage = fullMessage.split('\n').slice(1).join('\n');
        if (fullMessage) {
            await sentMessage.edit(`\`\`\`${fullMessage}\`\`\``);
        } else {
            await sentMessage.delete().catch(err => console.log(err));
            break;
        }
    }
};

module.exports = {
    name: "ascii",
    description: "Displays ASCII art from a specified JSON file",
    execute: async (message, client) => {
        try {
            if (message.content.startsWith('!ascii')) {
                const args = message.content.split(' ');
                const artName = args[1];
                if (!artName) {
                    return message.channel.send('Veuillez fournir le nom de l\'ASCII art. Exemple: !ascii hello');
                }

                const jsonFilePath = path.resolve(__dirname, `../../../asciiArt/${artName}.json`);
                if (!fs.existsSync(jsonFilePath)) {
                    return message.channel.send('Le fichier spécifié n\'existe pas.');
                }

                const asciiData = loadAsciiArt(jsonFilePath);
                if (!asciiData.ascii || asciiData.ascii.length === 0) {
                    return message.channel.send('Aucun ASCII trouvé dans le fichier spécifié.');
                }

                const frames = asciiData.ascii;
                const frameCount = asciiData.frames_number;
                const displayMode = asciiData.display || 'replace';

                if (displayMode === 'shy') {
                    await displayShy(message, frames, sleep);
                } else {
                    let fullMessage = frames[0];
                    const sentMessage = await message.channel.send(`\`\`\`${fullMessage}\`\`\``);

                    for (let i = 1; i < frameCount; i++) {
                        await sleep(500);  // Adjust delay as needed

                        if (displayMode === 'superimposed') {
                            fullMessage += `\n${frames[i]}`;
                            await sentMessage.edit(`\`\`\`${fullMessage}\`\`\``);
                        } else {
                            await sentMessage.edit(`\`\`\`${frames[i]}\`\`\``);
                        }
                    }
                }

                await message.delete().catch(err => console.log(err)); // Delete the command message
            }
        } catch (err) {
            console.log(`Command execution failed: ${err}`);
            message.channel.send('Échec de l\'envoi du message. Veuillez réessayer plus tard.');
        }
    }
};
