const { ipcRenderer } = require('electron');
const { language, SocketStatus, IPCEvent } = require('./../constants');

function connectionStatus(wsStatus, status) {
    if (status) {
        wsStatus.innerHTML = SocketStatus[language].Connected;
        wsStatus.className = 'connected';
    } else {
        wsStatus.innerHTML = SocketStatus[language].Disconnected;
        wsStatus.className = 'disconnected';
    }
        ipcRenderer.send(IPCEvent.WebsocketStatusChange, { connected: !!status });
}

exports.connectionStatus = connectionStatus;
