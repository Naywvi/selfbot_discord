const fs = require('fs');
const path = require('path');
const clc = require('cli-color');

const loadRoutes = async (dir, client) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file.endsWith('.js')) {
            const route = require(fullPath);
            if (route.name && route.execute) {
                client.commands.set(route.name, route);
                console.log(`\n ${clc.green('[✓]')} ${clc.cyan('Route loaded')}: ${clc.magenta(route.name)} \n ${clc.green('↳')} ${clc.cyan('Description')} : ${clc.magenta(route.description)} \n ${clc.green('↳')} ${clc.cyan('Path')} : ${clc.magenta(fullPath)}`);
            } else {
                console.error(`\n ${clc.bgRedBright.white.bold(`[╳] - Route config is missing required properties in file ${file} \n ↳ ${fullPath}`)}`);
            }
        } else if (fs.lstatSync(fullPath).isDirectory()) {
            await loadRoutes(fullPath, client);
        }
    }
}

const initializeRoutes = async (client) => {
    console.log(clc.greenBright(`
--------------------------------------------------
[📂] - Initializing SELF routes...
--------------------------------------------------`))

    await loadRoutes(path.join(__dirname, 'messageCreate'), client);

    console.log(clc.greenBright(`
--------------------------------------------------
[📂] - SELF routes load successful !
--------------------------------------------------\n`))


};

module.exports = { initializeRoutes };
