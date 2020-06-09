// Modules to control application life and create native browser window
const {app, BrowserWindow, nativeImage, Tray, Menu, screen, ipcMain, shell} = require('electron');
const path = require('path');
const config = require('./config.json');
const {IPCEvent, language, SocketStatus} = require('./constants');

const {download} = require('electron-dl');

let window;
let tray;
const isDebug = config.debug;
const contextMenu = [
    {label: 'Exit ' + config.appName, type: 'normal', click: app.exit},
    {label: SocketStatus[language].Title + SocketStatus[language].Disconnected, enabled: false, id: 'tray-status'}
];


function createWindow() {
    const displayWidth = screen.getPrimaryDisplay().bounds.width;

    let appConfig = config;
    if (isDebug) {
        appConfig = { ...config, width: 1000, height: 1000, resizable: true };
    }

    window = new BrowserWindow({
        width: appConfig.width,
        height: appConfig.height,
        resizable: appConfig.resizable,
        x: displayWidth - appConfig.width - 100,
        y: 200,
        alwaysOnTop: true,
        // icon: '/Users/nicojones/Documents/_Projects/electron-quick-start/images/scayla.png',
        webPreferences: {
            preload: path.join(__dirname, 'app.js')
        }
    });

    // Create the browser window.
    const image = nativeImage.createFromPath('/Users/nicojones/Documents/_Projects/inline-edit-attachment/' + appConfig.trayIcon);
    tray = new Tray(image.resize({height: 20}))
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu));

    // and load the index.html of the app.
    window.loadFile('index.html');
    window.appIcon = tray;

    if (isDebug) {
        window.webContents.openDevTools();
    }
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    console.log('App ready')
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    ipcMain.on(IPCEvent.StartDownload, (event, options) => {
        options.onProgress = (status) => window.webContents.send(IPCEvent.DownloadProgress, status);
        download(BrowserWindow.getAllWindows()[0], options.downloadUrl, options.options)
            .then((dl) => {
                window.webContents.send(IPCEvent.DownloadFinished, dl.getSavePath())
            });
    });

    ipcMain.on(IPCEvent.OpenFile, (event, options) => {
        shell.openPath(options.filePath);
    });

    ipcMain.on(IPCEvent.WebsocketStatusChange, (event, options) => {
        contextMenu[1].label = SocketStatus[language].Title + (options.connected ? SocketStatus[language].Connected : SocketStatus[language].Disconnected);
        window.appIcon.setContextMenu(Menu.buildFromTemplate(contextMenu));
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
