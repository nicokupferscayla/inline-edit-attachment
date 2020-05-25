// Modules to control application life and create native browser window
const {app, BrowserWindow, nativeImage, Tray, Menu, screen, ipcMain, shell } = require('electron');
const path = require('path');
const config = require('./config.json');
const { IPCEvent } = require('./constants');

const {download} = require('electron-dl');

let window;

function createWindow() {
    const displayWidth = screen.getPrimaryDisplay().bounds.width;
    // Create the browser window.
    const image = nativeImage.createFromPath('/Users/nicojones/Documents/_Projects/electron-quick-start/' + config.trayIcon);
    // image.resize({height: 30})
    const appIcon = new Tray(image.resize({height: 20}))
    appIcon.setContextMenu(Menu.buildFromTemplate([
        {label: 'Exit ' + config.appName, type: 'normal', click: app.exit},
    ]));
    window = new BrowserWindow({
        width: config.width,
        height: config.height,
        resizable: config.resizable,
        x: displayWidth - config.width,
        y: 200,
        alwaysOnTop: true,
        // icon: '/Users/nicojones/Documents/_Projects/electron-quick-start/images/scayla.png',
        webPreferences: {
            preload: path.join(__dirname, 'app.js')
        }
    });

    // and load the index.html of the app.
    window.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
