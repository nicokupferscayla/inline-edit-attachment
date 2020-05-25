exports.ClientEvent = {
    Download: 'download',
    Upload: 'upload'
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
    OpenFile: 'open-file'
};
