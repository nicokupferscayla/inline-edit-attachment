const path = require('path');
const fs = require('fs');
const os = require('os');
const {ipcRenderer} = require('electron');
const {IPCEvent} = require('./../constants');
const {log} = require('./../helper/log');


function downloadFile(downloadUrl) {
    return new Promise((resolve, reject) => {
        fs.mkdtemp(path.join(os.tmpdir(), 'inline-edit-'), (err, directory) => {
            ipcRenderer.send(IPCEvent.StartDownload, {
                downloadUrl: downloadUrl,
                options: {directory: directory}
            });
        });
        ipcRenderer.on(IPCEvent.DownloadFinished, (event, file) => {
            resolve(file);
            ipcRenderer.send(IPCEvent.OpenFile, {
                filePath: file,
            });
        });

        ipcRenderer.on(IPCEvent.DownloadProgress, (event, progress) => {
            const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
            log(cleanProgressInPercentages + '%');
        });
    })
}

exports.download = downloadFile;
