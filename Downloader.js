const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to read and parse JSON file
function readJSONFile(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

const dataFilePath = './data.json';
const data = readJSONFile(dataFilePath);
// console.log(data);


function downloadFile(url, localPath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(localPath);
        https.get(url, (response) => {
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(localPath, () => reject(err));
        });
    });
}

async function createDownloadFolder(downloadFolder) {
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }
}

async function downloadAssets() {
    for (const resource of data.roomResourceList) {
        for (const asset of resource.roomAssetList) {
            const fileUrl = asset.domain + asset.uri;
            const fileName = asset.downloadToPath;
            const filePath = path.join('./Download', fileName);
            const filename = path.basename(asset.downloadToPath);
            const downloadfolder = filePath.replace("/"+filename,"");

            try {
                await createDownloadFolder(downloadfolder);
                await downloadFile(fileUrl, filePath);
                console.log(`Downloaded: ${fileName}`);
            } catch (err) {
                console.error(`Error downloading: ${fileName}`, err);
            }
        }
    }
}

downloadAssets();

module.exports = data;
