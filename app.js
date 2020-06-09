const WebSocket = require('ws');
const config = require('./config');

const { ClientEvent, ServerEvent, language, SocketStatus, Messages } = require('./constants');

const { log } = require('./helper/log');
const { upload } = require('./helper/upload');
const { download } = require('./helper/download');
const { setFileListener } = require('./helper/setFileListener');
const { connectionStatus } = require('./helper/connectionStatus');
const { htmlLogger } = require('./helper/htmlLogger');

let wss; // WebSocket Server
let wsStatus; // the DOM object containing the status of the connection

let uploadUrl;
let fileName;
let socketOpen = false;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    wsStatus = document.getElementById('ws-status');
    document.getElementById('logo-title').innerHTML = config.appName;
    document.getElementById('page-title').innerHTML = config.appName;

    wss = new WebSocket.Server({port: config.wsPort});

    wss.on('connection', (ws) => {
        socketOpen = true;
        connectionStatus(wsStatus, true);

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
                    console.log('fileName', fileName)
                    uploadUrl = message.uploadUrl;
                    htmlLogger(Messages[language].FileDownloadStarted, fileName)
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
                            socketOpen && htmlLogger(Messages[language].FileSaved, fileName)
                        });
                        htmlLogger(Messages[language].FileDownloaded, fileName)
                    });
                    break;

                case ClientEvent.Upload:
                    htmlLogger(Messages[language].FileUploadStarted, fileName);
                    upload(uploadUrl).then(() => {
                        htmlLogger(Messages[language].FileUploadFinished, fileName);
                        ws.send(JSON.stringify({
                            eventName: ServerEvent.FileUploaded,
                        }));
                    });
                    break;

                case ClientEvent.Discard:
                    htmlLogger(Messages[language].FileDiscarded, fileName);
                    break;

                default:
                    log(`INVALID EVENT NAME <<< ${message.eventName} >>>`);
            }
        });
        ws.on('close', message => {
            log('closed');
            socketOpen = false;
            connectionStatus(wsStatus, false);
        })
    });
    socketOpen = false;
    connectionStatus(wsStatus, false);
});
