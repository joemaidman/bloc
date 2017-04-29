# Webpack DevServer

## It is not [Webpack Dev Server](https://github.com/webpack/webpack-dev-server).

When you develop with React/Redux, to use hot-reload ability that powered by webpack-hot-middleware, usually you need to write a simple express server to provide hot-patch service.
Now, I packed it as a module.

## Installation & Usage

First, install the npm module.

```sh
npm install --save-dev webpack-devserver
```

Next, config webpack.config.js to enable hot reloading, See [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware).

 1. Add the following three plugins to the `plugins` array:
    ```js
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
    ```

 2. Add `'webpack-hot-middleware/client'` into the `entry` array.
    This connects to the server to receive notifications when the bundle
    rebuilds and then updates your client bundle accordingly.

 3. Optional, set publicPath.

Then, add a script into package.json.

```js
"scripts": {
   "dev": "webpack-devserver"
 }
```

That's all, no more configuration required.
Now, run this command to start DevServer.

```sh
npm run dev
```
and browse "http://127.0.0.1:8080/".


## Troubleshooting

### The following modules couldn't be hot updated
If you get some warning like "The following modules couldn't be hot updated", that is loss something. Please add 
```js
module.hot.accept();
```
to the top level file that initialized the application. See [garysieling blog](https://www.garysieling.com/blog/3183-2).

## Config

### Port and address of DevServer
DevServer default listen on localhost:8080, to indicate another port and address, add 
```js
devServer: {
	address: '111.111.111.111',
	port: 3000
}
```
into webpack.config.js.

### Proxy
If want proxy some url to server "http://222.222.222.222:3000/", add
```js
devServer: {
	proxy: {
        '/url/*': 'http://222.222.222.222:3000/'
    }
}
```
into webpack.config.js.

## At last

This is my first npm module. Any help would be most welcome.
