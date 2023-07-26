const https = require('https');
const fs = require('fs');
const path = require('path');
const request = require('request');

const data = {
    "totalBytes": 31792,
    "status": 2,
    "id": 168364,
    "uri": "/1674/data/f89e44b7-35f1-4334-8310-803eb5de84cd/f89e44b7-35f1-4334-8310-803eb5de84cd.app",
    "name": "G3_Question Bank_Answer Keys_Chapter 01.pdf",
    "downloadToPath": "/data/content/168364.pdf",
    "domain": "https://content1.nexterp.in"
}

// function downloadFile(url, localPath) {
//     return new Promise((resolve, reject) => {
//         const fileStream = fs.createWriteStream(localPath);
//         https.get(url, (response) => {
//             response.pipe(fileStream);
//             fileStream.on('finish', () => {
//                 fileStream.close(resolve);
//             });
//         }).on('error', (err) => {
//             fs.unlink(localPath, () => reject(err));
//         });
//     });
// }

async function downloadFile(url, localPath) {
    return new Promise((resolve, reject) => {
        url = `${url}`; // Replace 5556 with the desired port number

        const fileStream = fs.createWriteStream(localPath);
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'chrome/nextedu_tn',
            },
        };

        const req = request.get(url, options);
        req.on('response', (response) => {
            if (response.statusCode === 200) {
                req.pipe(fileStream);
            } else {
                reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
            }
        });

        req.on('error', (err) => {
            fs.unlink(localPath, () => reject(err));
        });

        fileStream.on('finish', () => {
            fileStream.close(() => {
                const expectedSize = response.headers['content-length'];
                const downloadedSize = fs.statSync(localPath).size;

                if (downloadedSize === parseInt(expectedSize, 10)) {
                    console.log(`File downloaded: ${localPath}`);
                    resolve();
                } else {
                    console.log(`Partial download: ${localPath}. Expected size: ${expectedSize} bytes, Downloaded size: ${downloadedSize} bytes`);
                    resolve();
                }
            });
        });
    });
}

async function createDownloadFolder(downloadFolder) {
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }
}

// async function downloadTasks(data) {
//     if (data) {
//         const fileUrl = data.domain + data.uri;
//         const filename = path.basename(data.downloadToPath);
//         const filePath = path.join('./Download', filename);
//         const downloadfolder = filePath.replace("/" + filename, "");
//         try {
//             await createDownloadFolder(downloadfolder);
//             await downloadFile(fileUrl, filePath);
//             const downloadedSize = fs.statSync(filePath).size;
//             const expectedSize = data.totalBytes;

//             if (downloadedSize === expectedSize) {
//                 console.log(`Downloaded: ${data.downloadToPath}`);
//             } else {
//                 console.log(`Partial download: ${data.downloadToPath}. Expected size: ${expectedSize} bytes, Downloaded size: ${downloadedSize} bytes`);
//             }
//         } catch (err) {
//             console.error(`Error downloading: ${data.downloadToPath}`, err);
//         }
//     }
// }

async function downloadTasks(data) {
    if (data) {
        const fileUrl = data.domain + data.uri;
        const filename = path.basename(data.downloadToPath);
        const filePath = path.join('./Download', filename);
        const downloadfolder = path.join('./Download', path.dirname(data.downloadToPath));

        try {
            await createDownloadFolder(downloadfolder);
            await downloadFile(fileUrl, filePath);
            console.log(`Downloaded: ${data.downloadToPath}`);
        } catch (err) {
            console.error(`Error downloading: ${data.downloadToPath}`, err);
        }
    }
}


downloadTasks(data);

module.exports = data;
