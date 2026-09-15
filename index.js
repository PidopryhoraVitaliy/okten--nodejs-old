// Створити папку "baseFolder".
// В ній створити 5 папок
// в кожній з яких створити по 5 файлів з розширенням txt.
// Вивести в консоль шляхи до кожного файлу чи папки, також вивести поряд інформацію про те, чи є це файл чи папка.

const path = require('node:path');
const fs = require('node:fs/promises');

const creator = async () => {
    const basePath = path.join(__dirname, 'baseFolder');
    await fs.mkdir(basePath, { recursive: true });

    for (let folderCounter = 1; folderCounter <= 5; folderCounter++) {
        const folderPath = path.join(basePath, `folder-${folderCounter.toString()}`);
        await fs.mkdir(folderPath, {recursive: true});

        for (let fileCount = 1; fileCount <= 5; fileCount++) {
            const data = `some data!\nfolder-${folderCounter.toString()}\nfile-${fileCount.toString()}`;
            const pathToFile = path.join(folderPath, `file-${fileCount.toString()}.txt`);
            await fs.writeFile(pathToFile, data, {encoding: 'utf8'});
        }
    }
}

void creator();