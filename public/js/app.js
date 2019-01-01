const fs = require('fs');
const path = require('path');
const express = require('express');
const box = require('./box');
const app = express();

const buildPage = (title, content) => {
    let config = {
        title: title,
        styles: [
            '//fonts.googleapis.com/css?family=Raleway:400,300,600',
            'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css',
            '/static/css/custom.css',
            '/static/css/prism.css'
        ],
        scripts: [
            '/static/js/prism.js'
        ],
        head: {
            tag: 'head',
            content: readFile(path.join(__dirname, 'public/head.html'))
        },
        body: {
            tag: 'body',
            content: readFile(path.join(__dirname, 'public/body.html')),
            after: {
                tag: 'pre',
                children: [{ 
                    tag: 'code', 
                    content: readFile(path.join(__dirname, 'public/js/app.js')), 
                    classList: ['language-javascript'] 
                }]
            }
        },
        injections: {
            'btnDownload': new box({
                tag: 'a',
                classList: ['button', 'button-primary'],
                attributes: ['href="http://github.com/scstauf/boxjs"', 'target="_blank"'],
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

const readFile = (path) => { 
    try { 
        return fs.readFileSync(path, 'utf8'); 
    } 
    catch (ignore) { 
        return new box({
            tag: 'p',
            content: ignore.message,
            classList: ['alert', 'alert-error']
        }).html(); 
    } 
};

app.get('/', (req, res) => { res.send(buildPage('BoxJS: A boxy HTML generator.')); });
app.get('/code', (req, res) => { res.sendFile('box.js', { root: __dirname })});
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen();