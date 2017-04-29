# karma-inject-html

This karma plugin is useful when you switching to karma and don't want to rewrite
all your tests because karma don't provide a automatically HTML page injection for your tests.

You can inject markup from a file or you can write the markup directly into the karma config.

### install

    $ npm install karma-inject-html

### Usage

example karma.config.js

```js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'test/*.js': ['inject-html']
    },
    injectHtml: {
        file: 'test/test-container.html'
    }
}
```

##### injectHtml (options object)

you can set either a file or the raw markup

__options.file__: 'file/to/the/file.html'  
_(relative to the `basePath`)_

__options.raw__: '\<div id="test-content">\<div>'

### What is with karma-html2js-preprocessor?

There is alread a [plugin](https://github.com/karma-runner/karma-html2js-preprocessor) which converts HTML files into JS strings, but it only provides
them via the global `window` scope.  
So you still need to load your markup in every test.

### How it works?

The template is injected via JavaScript by using `document.body.appendChild`
before each test starts.