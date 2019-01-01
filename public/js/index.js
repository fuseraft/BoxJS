const box = require('box');

let html = box.build(config);

let config = {
    title: title,
    styles: [
        '//fonts.googleapis.com/css?family=Raleway:400,300,600',
        'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css',
        '/css/custom.css',
        '/css/prism.css'
    ],
    scripts: [
        '/js/prism.js'
    ],
    body: {
        tag: 'body',
        content: bodyHtml,
        after: {
            tag: 'pre',
            children: [{ 
                tag: 'code', 
                content: appCode, 
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