const fs = require('fs');
const path = require('path');
const express = require('express');
const box = require('./box');
const app = express();
const port = process.env.PORT || 3000;
const readFile = (path) => { try { return fs.readFileSync(path, 'utf8'); } catch (ignore) { return ''; } };
const bodyHtml = readFile(path.join(__dirname, 'box/body.html'));
const headHtml = readFile(path.join(__dirname, 'box/head.html'));

const buildPage = (title, content) => {
    let test = '';
    let files = [];
    
    fs.readdirSync(__dirname).forEach(file => {
        files.push(file);
    })
    
    test = files.join('\n');

    let config = {
        title: title,
        styles: [
            '//fonts.googleapis.com/css?family=Raleway:400,300,600',
            'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css',
            'box/css/custom.css',
            'box/css/prism.css'
        ],
        scripts: [
            'box/prism.js'
        ],
        body: {
            tag: 'body',
            content: bodyHtml,
            after: {
                tag: 'pre',
                children: [{ 
                    tag: 'code', 
                    content: test,//readFile(path.join(__dirname, 'index.js')), 
                    classList: ['language-javascript'] 
                }]
            }
        },
        head: {
            tag: 'head',
            content: headHtml
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
app.use('/box', express.static(path.join(__dirname, 'box/')));
app.use('/box/css', express.static(path.join(__dirname, 'box/css/')));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));