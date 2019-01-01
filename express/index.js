const fs = require('fs');
const path = require('path');
const express = require('express');
const box = require('../box');
const app = express();
const port = 3000;
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

app.get('/', (req, res) => { res.send(buildPage('BoxJS: A boxy HTML generator.')); });
app.get('/download', (req, res) => { 
    res.set('Content-Type', 'application/javascript');
    res.download(path.join(__dirname, 'box.js')); 
});
app.get('/code', (req, res) => { res.sendFile('box.js', { root: __dirname })});
app.use(express.static('.'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));