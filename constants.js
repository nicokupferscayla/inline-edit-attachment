exports.ClientEvent = {
    Download: 'download',
    Upload: 'upload',
    Close: 'close',
    Discard: 'discard'
};


exports.ServerEvent = {
    FileDownloaded: 'file-downloaded',
    FileSaved: 'file-saved',
    FileUploaded: 'file-uploaded'
};


exports.IPCEvent = {
    StartDownload: 'start-download',
    DownloadFinished: 'download-finished',
    DownloadProgress: 'download-progress',
    OpenFile: 'open-file',
    WebsocketStatusChange: 'ws-change'
};

exports.language = 'en';

/**
 * Translatable
 * @type {{en: {Connected: string, Title: string, Disconnected: string}}}
 */
exports.SocketStatus = {
    'en': {
        Title: 'Status: ',
        Connected: 'Connected',
        Disconnected: 'Disconnected'
    }
};

exports.Messages = {
    'en': {
        FileDownloaded: 'File "##" downloaded',
        FileDownloadStarted: 'Started downloading "##"',
        FileSaved: 'File "##" was saved in your computer',
        FileUploadStarted: 'Uploading file "##" to server',
        FileUploadFinished: 'File "##" saved to server',
        Editing: 'Editing file "##"',
        FileDiscarded: 'File "##" changes were discarded'
    }
};
