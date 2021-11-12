
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const args = process.argv.slice(2);


const file = fs.readFileSync(args[0], { encoding: 'utf8'})
const dom = new JSDOM(file)
const el = dom.window.document.body.children[0];
const viewBox = el.getAttribute('viewBox');
const width = el.getAttribute('width');
const height = el.getAttribute('height');

if(!width || !height){
    const rect = viewBox.split(' ')
    const newWidth = rect[2] - rect[0];

    const newHeight = rect[3] - rect[1];

    el.setAttribute('width', `${newWidth}px`);
    el.setAttribute('height', `${newHeight}px`);

}

fs.writeFileSync(args[0], el.outerHTML, { encoding: 'utf8'})