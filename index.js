const Sharp = require('sharp');
const Path = require('path');
const Fs = require('fs');
const Process = require('process');

async function prompt(question) {
    Process.stdout.write(question);
    return await new Promise( 
        (resolve,reject) => {
            Process.stdin.on(
                'data',
                (data) => {
		            const input = data.toString().trim();
                    resolve(input);
                }
            )
        }
    )
}


async function main() {
    // Get main input
    const directory = Path.resolve(await prompt('Folder path to texture pack blocks folder: '));
    if (!Fs.existsSync(directory)) {
        console.error(`Directory not found!`);
        Process.exit();
    }
    const imageFile = Path.resolve(await prompt('File path to specific image: '));
    if (!Fs.existsSync(imageFile)) {
        console.error(`Image file not found!`);
        Process.exit();
    }
    // Confirm
    const confirm = await prompt(`This will replace all *.png files in '${directory}' with the image at '${imageFile}' recursively!!\nIf you wish to continue type "yes": `)
    if (confirm.toLowerCase() !== 'yes') {
        console.error('Aborted.');
        Process.exit();
    }
    // Do the replacing
    const imageData = Sharp(imageFile);
    Fs.readdirSync(directory,{recursive: true,withFileTypes: true}).forEach((value) => {
        if (value.isFile() && Path.extname(value.name) === '.png') {
            const filePath = Path.join(value.parentPath,value.name);
            console.log(`Processing '${filePath}'.`);
            imageData.toFile(filePath,(err,info) => {
                if (err) {
                    console.error(`Error when processing '${Path.join(value.parentPath,value.name)}'!`);
                    console.error(`${err}`);
                }
            });
        }
    });
    await prompt('Press ENTER to continue.');
    Process.exit();
}

main();