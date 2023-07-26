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

function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(localPath);
    https.get(url, (response) => {
      // Log the HTTPS status code
      console.log(`Status Code: ${response.statusCode}, URL: ${url}`);
      
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
//   const downloadFolder = './Download';
  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
  }
}

async function checkAndDownloadFile(assetId, fileUrl, filePath, status) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log(`Asset ID: ${assetId}, Status: ${status}, File already exists: ${path.basename(filePath)}`);
      resolve();
    } else {
      downloadFile(fileUrl, filePath)
        .then(() => {
          // Check if the file is a PDF and log its size
          if (path.extname(filePath).toLowerCase() === '.pdf') {
            const fileSizeInBytes = fs.statSync(filePath).size;
            console.log(`Asset ID: ${assetId}, Status: ${status}, Downloaded PDF: ${path.basename(filePath)}, Size: ${fileSizeInBytes} bytes`);
          } else {
            console.log(`Asset ID: ${assetId}, Status: ${status}, Downloaded: ${path.basename(filePath)}`);
          }
          resolve();
        })
        .catch((err) => {
          console.error(`Asset ID: ${assetId}, Status: ${status}, Error downloading: ${path.basename(filePath)}`, err);
          resolve();
        });
    }
  });
}

async function downloadAssets() {
  await createDownloadFolder();

  const downloadPromises = [];
  for (const resource of data.roomResourceList) {
    for (const asset of resource.roomAssetList) {
      const assetId = asset.id;
      const status = asset.status;
      const fileUrl = asset.domain + asset.uri;
      const fileName = path.basename(asset.downloadToPath);
      const filePath = path.join('./Download', fileName);
      downloadPromises.push(checkAndDownloadFile(assetId, fileUrl, filePath, status));
    }
  }

  await Promise.all(downloadPromises);
}

downloadAssets();

module.exports = data;
