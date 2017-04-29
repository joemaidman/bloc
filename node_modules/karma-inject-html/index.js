var fs = require('fs');
var path = require('path');

var appendToBody = function(template) { 
    var selector = 'body';
    template = template.replace(/\n/g,'');
    template = template.replace(/"/g, "'");
    return 'var __kih_tmpl=document.createElement("div");document.body.appendChild(__kih_tmpl); __kih_tmpl.outerHTML = "' + template + '";';
};

function injectHtml(logger, basePath, config) {
    var log = logger.create('preprocessor.inject-html');
    var templateAsScript = '';

    if (config.file) {
        log.debug('loading template file "%s".', config.file);
        var template = fs.readFileSync(path.join(basePath, config.file), 'utf8');
        templateAsScript = appendToBody(template);
    } else if (config.raw) {
        templateAsScript = appendToBody(config.raw);
    }

    return function (content, file, done) {
        log.debug('Processing "%s".', file.originalPath);
        done(templateAsScript + '\n' + content);
    };
}

injectHtml.$inject = ['logger', 'config.basePath', 'config.injectHtml'];

module.exports = {
    'preprocessor:inject-html': ['factory', injectHtml]
};
