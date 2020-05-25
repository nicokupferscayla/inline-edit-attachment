const {log} = require('./../helper/log');
const fs = require('fs');


function listener(filePath, callback) {
    fs.watchFile(filePath, (curr, prev) => {
        if (curr !== prev) {
            callback();
        }
    });
}

exports.setFileListener = listener;
