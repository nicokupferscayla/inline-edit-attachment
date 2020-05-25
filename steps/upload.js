const { log } = require('./../helper/log');

function upload(uploadUrl) {
    return new Promise((complete, rejected) => {
        setTimeout(() => {
            // TODO - this should UPLOAD the file...
            log('uploading file to ' + uploadUrl);
            complete();
        }, 2000);
    })
}

exports.upload = upload;
