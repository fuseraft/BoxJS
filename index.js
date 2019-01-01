const fs = require('fs');
const box = require('./box');
const readFile = (path) => { try { return fs.readFileSync(path, 'utf8'); } catch (ignore) { return ''; } };

const buildPage = (title, content) => {
    let config = {
        title: title,
        styles: [
            '//fonts.googleapis.com/css?family=Raleway:400,300,600',
            'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css',
            'css/custom.css',
            'css/prism.css'
        ],
        scripts: [
            'prism.js'
        ],
        body: {
            tag: 'body',
            content: readFile('./box/body.html'),
            after: {
                tag: 'pre',
                children: [{ 
                    tag: 'code', 
                    content: readFile('./app.js'), 
                    classList: ['language-javascript'] 
                }]
            }
        },
        head: {
            tag: 'head',
            content: readFile('./box/head.html')
        },
        injections: {
            'btnDownload': new box({
                tag: 'a',
                classList: ['button', 'button-primary'],
                attributes: ['href="/download"'],
                content: 'Download'
            }).html(), 
            'btnViewRaw': new box({
                tag: 'a',
                classList: ['button'],
                attributes: ['href="/code"', 'target="_blank"'],
                content: 'View Code'
            }).html()
        }
    };

    return box.build(config);
};

module.exports = (req, res) => {
  res.send(buildPage('BoxJS: A boxy HTML generator.')); });
};