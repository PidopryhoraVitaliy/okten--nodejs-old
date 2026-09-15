// Створити папку "baseFolder".
// В ній створити 5 папок
// в кожній з яких створити по 5 файлів з розширенням txt.
// Вивести в консоль шляхи до кожного файлу чи папки, також вивести поряд інформацію про те, чи є це файл чи папка.

const path = require('node:path');
const fs = require('node:fs/promises');

const creator = async () => {
    const basePath = path.join(__dirname, 'baseFolder');
    await fs.mkdir(basePath, { recursive: true });
    const baseFolderStat = await fs.stat(basePath);
    console.log(`Creating folder ${basePath}`, `| isDirectory: ${baseFolderStat.isDirectory()} | isFile: ${baseFolderStat.isFile()}`);

    for (let folderCounter = 1; folderCounter <= 5; folderCounter++) {
        const folderPath = path.join(basePath, `folder-${folderCounter.toString()}`);
        await fs.mkdir(folderPath, {recursive: true});
        const folderStat = await fs.stat(folderPath);
        console.log(`Creating folder ${folderPath}`, `| isDirectory: ${folderStat.isDirectory()} | isFile: ${folderStat.isFile()}`);

        for (let fileCount = 1; fileCount <= 5; fileCount++) {
            const data = `some data!\nfolder-${folderCounter.toString()}\nfile-${fileCount.toString()}`;
            const pathToFile = path.join(folderPath, `file-${fileCount.toString()}.txt`);
            await fs.writeFile(pathToFile, data, {encoding: 'utf8'});
            const stat = await fs.stat(pathToFile);
            console.log(`Creating file ${pathToFile}`, `| isDirectory: ${stat.isDirectory()} | isFile: ${stat.isFile()}`);
        }
    }
}

void creator();