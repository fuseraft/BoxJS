module.exports = 
class Box {
    /** Configuration object for Box constructor
    * @typedef BoxConfig
    * @type {Object}
    * @property {string} tag            -   Tag name
    * @property {Box} before            -   Left-sibling Box
    * @property {Box} after             -   Right-sibling Box
    * @property {string} beforeContent  -   Left side content
    * @property {string} afterContent   -   Right side content
    * @property {string} content        -   Inner content
    * @property {string[]} attributes   -   Attributes list
    * @property {string[]} classList    -   Class list
    * @property {Box[]} children        -   Child boxes
    * @property {KVP[]} injections      -   (for find-and-replace in the generated HTML) */

    /** Represents a box.
    * @constructor
    * @param {BoxConfig} config */
    constructor(config) {
        this.tag = '';
        this.before = null; // Box
        this.after = null; // Box
        this.beforeContent = '';
        this.afterContent = '';
        this.attributes = [];
        this.classList = [];
        this.children = [];
        this.injections = {};

        if (config) {
            if (config.tag && typeof config.tag === 'string') this.tag = config.tag;
            if (config.before) {
                if (Box.isBox(config.before)) {
                    this.before = config.before;
                }
                else if (Box.isBoxLike(config.before)) {
                    this.before = new Box(config.before);
                }
            }
            if (config.after) {
                if (Box.isBox(config.after)) {
                    this.after = config.after;
                }
                else if (Box.isBoxLike(config.after)) {
                    this.after = new Box(config.after);
                }
            }
            if (config.beforeContent && typeof config.beforeContent === 'string') this.beforeContent = config.beforeContent;
            if (config.afterContent && typeof config.afterContent === 'string') this.afterContent = config.afterContent;
            if (config.attributes && Array.isArray(config.attributes)) this.attributes = config.attributes;
            if (config.classList && Array.isArray(config.classList)) this.classList = config.classList;
            if (config.children && Array.isArray(config.children)) this.children = config.children;
            if (config.content && typeof config.content === 'string') this.content = config.content;
        }
    }

    /* ------------------------------------------------------------------------------------- 
    Properties
    */

    get hasChildren() { return this.children && this.children.length > 0; }

    set content (_content_) { this._content = _content_ || ''; }
    get content() { return this._content || ''; }

    get beforeContent () { return this._beforeContent || ''; }
    set beforeContent (_beforeContent_) { this._beforeContent = _beforeContent_; }

    get innerContent() {
        let _innerContent = '';
        
        if (this.beforeContent) _innerContent += this.beforeContent;
        if (this.before) _innerContent += this.before.html();
        if (this.content) _innerContent = this.content;
        if (this.hasChildren) _innerContent += Box.unboxMultiple(this.children);  
        if (this.afterContent) _innerContent += this.afterContent;
        if (this.after) _innerContent += this.after.html();
        
        return _innerContent;
    }
    
    get afterContent () { return this._afterContent || ''; }
    set afterContent (_afterContent_) { this._afterContent = _afterContent_; }

    /* ------------------------------------------------------------------------------------- 
    Instance Methods 
    */

    add (_box_) {
        if (Array.isArray(_box_)) {
            this.children = [...this.children, ..._box_];
        }
        else if (isBox(_box_)) {
            this.children.push(_box_);
        }
        else if (isBoxLike(_box_)) {
            this.children.push(new Box(_box_));
        }
    }

    getAttributes () { return this.attributes.length === 0 ? '' : this.attributes.map(v => {return `${v || ''} `}).join(''); }
    getClassList () { return this.classList.length === 0 ? '' : this.classList.map(v => { return ` ${v || ''}`}).join('') }

    inject(key, injection) { this.injections[key] = injection; }

    html() {
        let html = [], _html = '';
        
        html.push(`<${this.tag}`);
        if (this.classList.length > 0) html.push(` class="${this.getClassList().trim()}"`);
        if (this.attributes.length > 0) html.push(` ${this.getAttributes().trim()}`);
        html.push('>');
        html.push(this.innerContent || '');
        html.push(`</${this.tag}>`);

        _html = html.join('');

        for (let key in this.injections) _html = _html.replace(`{{${key}}}`, this.injections[key]);

        return _html;
    }

    /* ------------------------------------------------------------------------------------- 
    Static Methods 
    */

    static isBoxLike (test) {
        const BoxConfigProperties = [
            'tag', 'before', 'after', 'beforeContent', 'afterContent', 'content', 
            'attributes', 'classList', 'children', 'injections'
        ];        

        let _isBoxLike = false;

        if (test && typeof test === 'object') {
            _isBoxLike = Object.keys(test).map(v => { return BoxConfigProperties.indexOf(v) > -1 }).length > 0;
        }

        return _isBoxLike;
    }
   
    static isBox (test) { return test && typeof test !== 'undefined' && test instanceof Box; }

    static unboxMultiple (_children_) { 
        return _children_.map(v => { 
            return Box.unbox(v); 
        }).join(''); 
    }
    static unbox (_box_) { 
        if (Box.isBox(_box_)) {
            if (_box_.hasChildren) {
                return Box.unboxMultiple(_box_.children);
            }
            else {
                return _box_.html();
            }
        }
        else if (Box.isBoxLike(_box_)) {
            return Box.unbox(new Box(_box_));
        }
        else {
            return '';
        }
    }

    static build (config) {
        let html = new Box({ tag: 'html' }),
            head = new Box({ tag: 'head' }),
            body = new Box({ tag: 'body' });
        
        const isString = (test) => { return test && typeof test === 'string' };
        const isArray = (test) => { return test && Array.isArray(test) && test.length > 0 };

        if (config) {
            head.content = '';
            body.content = '';

            if (Box.isBox(config.head)) head = config.head;
            else if (Box.isBoxLike(config.head)) head = new Box(config.head);
            
            if (Box.isBox(config.body)) body = config.body;
            else if (Box.isBoxLike(config.body)) body = new Box(config.body);

            if (isString(config.title)) {
                if (head.content.indexOf('<title>') > -1) {
                    head.content = head.content.replace(/<title>*<\/title>/, config.title);
                }
                else {
                    head.content += `<title>${config.title}</title>`;
                }
            }

            if (isArray(config.scripts)) head.content += config.scripts.map(v => { return `<script type="text/javascript" src="${v || ''}"></script>`; }).join('') || '';
            if (isArray(config.styles)) head.content += config.styles.map(v => { return `<link type="text/css" rel="stylesheet" href="${v || ''}">`; }).join('') || '';

            if (config.injections && typeof config.injections === 'object') html.injections = config.injections;
        }

        html.add([head, body]);

        return html.html();
    }
};
