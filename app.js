const WebSocket = require('ws')
const config = require('./config');

const { ClientEvent, ServerEvent } = require('./constants');
const { download } = require('./steps/download');
const { upload } = require('./steps/upload');
const { setFileListener } = require('./steps/setFileListener');
const { log } = require('./helper/log');

let wss; // WebSocket Server
let wsStatus; // the DOM object containing the status of the connection

let uploadUrl;
let fileName;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    wsStatus = document.getElementById('ws-status');
    document.getElementById('logo-title').innerHTML = config.appName;
    document.getElementById('page-title').innerHTML = config.appName;

    wss = new WebSocket.Server({port: config.wsPort});

    function setConnected(status) {
        if (status) {
            wsStatus.innerHTML = config.status.i;
            wsStatus.style.color = config.statusColor.i;
        } else {
            wsStatus.innerHTML = config.status.o;
            wsStatus.style.color = config.statusColor.o;
        }
    }

    wss.on('connection', (ws) => {
        setConnected(true);
        ws.on('message', (messageText) => {
            let message = {};
            try {
                message = JSON.parse(messageText);
            } catch (e) {
                log(`MALFORMED ERROR MESSAGE: <<< ${messageText} >>>`);
                return;
            }

            switch (message.eventName) {
                case ClientEvent.Download:
                    fileName = message.fileName;
                    uploadUrl = message.uploadUrl;
                    download(message.downloadUrl, fileName).then((pathToFile) => {
                        ws.send(JSON.stringify({
                            eventName: ServerEvent.FileDownloaded,
                            fileName: fileName
                        }));
                        setFileListener(pathToFile, () => {
                            ws.send(JSON.stringify({
                                eventName: ServerEvent.FileSaved,
                                unixTime: Math.floor(+(new Date()) / 1000)
                            }));
                        });
                    });
                    break;

                case ClientEvent.Upload:
                    upload(uploadUrl).then(() => {
                        ws.send(JSON.stringify({
                            eventName: ServerEvent.FileUploaded,
                        }));
                    });
                    break;

                default:
                    log(`INVALID EVENT NAME <<< ${message.eventName} >>>`);
            }
        });
        ws.on('close', message => {
            log('closed');
            setConnected(false);
        })
    });
    setConnected(false);
});
