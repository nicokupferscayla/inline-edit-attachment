function htmlLogger(text, replace) {
    console.log(text, replace, replace || '', text.replace('##', replace || ''))
    document.getElementById('html-logger').innerHTML = text.replace('##', replace || '');
}

exports.htmlLogger = htmlLogger;
