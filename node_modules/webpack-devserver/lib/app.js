/**
 * Created by willwoo on 16年4月28日.
 */

'use strict';

module.exports = function() {
    var path = require('path');
    var express = require('express');
    var webpack = require('webpack');
    var proxy = require('http-proxy-middleware');

    var config = require(path.join(process.cwd(), './webpack.config'));
    var devServerConfig = config.devServer;

    var app = express();
    var address = 'localhost';
    var port = 8080;

    var compiler = webpack(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    if (devServerConfig) {
        if (devServerConfig.proxy) {
            for (var url in devServerConfig.proxy) {
                app.use(proxy(url, {
                    target: devServerConfig.proxy[url]
                }));
            };
        };
        address = devServerConfig.address || address;
        port = devServerConfig.port || port;
    }

    app.get('/*', function (req, res) {
        res.end(compiler.outputFileSystem.readFileSync(path.join(compiler.outputPath, 'index.html')));
    });

    app.listen(port, address, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Listening at http://' + address + ':' + port);
    });

    return app;
};
