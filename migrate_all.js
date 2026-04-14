const fs = require('fs');
const cheerio = require('cheerio');
const htmlFile = process.argv[2] || 'farmtofashion2025.html';
const html = fs.readFileSync(htmlFile, 'utf8');
const templateName = htmlFile.replace('.html', '').replace(/[^a-zA-Z0-9-]/g, '-');
const $ = cheerio.load(html);

$('.visible-xs, .hidden-lg, .visible-sm').remove();

const items = [];

$('*').each((i, el) => {
    if ($(el).parents('.gf_row').length === 0) return;

    const outerRow = $(el).parents('.gf_row').last();
    const outerId = outerRow.attr('id') || outerRow.attr('data-id') || 'no-id';

    const tag = el.tagName.toLowerCase();
    let state = 'full';
    if ($(el).parents('[class*="col-lg-6"]').length > 0) state = 'half';
    if ($(el).parents('[class*="col-lg-4"]').length > 0) state = 'third';
    if ($(el).parents('[class*="col-lg-3"]').length > 0) state = 'quarter';

    if (tag === 'img') {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && src.includes('cdn') && !src.includes('cdn/shop/files') && !src.includes('lazyload')) {
             items.push({ type: 'IMG', state, content: src, outer: outerId });
        }
    } else if (tag.match(/^h[1-6]$/)) {
        const t = $(el).text().replace(/\s+/g, ' ').trim();
        if (t) items.push({ type: 'HEAD', state, content: t, outer: outerId });
    } else if (tag === 'p' || tag === 'span') {
        if ($(el).parents('.header, .nav, footer, #shopify-section-header, a, button, [class*="btn"]').length > 0) return;
        const t = $(el).text().replace(/\s+/g, ' ').trim();
        if (t && t.length > 3 && !t.includes('商品ページへ')) items.push({ type: 'TEXT', state, content: t, outer: outerId });
    }
});

const cleanItems = [];
items.forEach(item => {
    if (cleanItems.length > 0 && cleanItems[cleanItems.length - 1].content === item.content) return;
    cleanItems.push(item);
});

const blocks = {};
const block_order = [];
let blockCounter = 1;

let currentHalf = { images: [], headings: [], texts: [], outer: null, firstType: null };
let currentQuarter = [];
let currentThird = { images: [], headings: [], texts: [], blocks: [] };
let currentFullHeaders = [];
let currentFullTexts = [];

// flushThird groups image+head+text pairs into features_grid
function flushThird() {
    if (currentThird.images.length || currentThird.headings.length || currentThird.texts.length) {
         currentThird.blocks.push({
             img: currentThird.images[0] || '',
             head: currentThird.headings.join(' - '),
             txt: currentThird.texts.join('\n')
         });
    }

    if (currentThird.blocks.length > 0) {
        let blockId = `features_grid_${blockCounter++}`;
        block_order.push(blockId);
        let settings = { image_on: true, margin_bottom: 80, columns_desktop: 3, icon_size: 'large' };
        currentThird.blocks.forEach((b, i) => { 
            if (i < 4) {
                settings[`image_url_${i+1}`] = b.img;
                settings[`title_${i+1}`] = b.head;
                settings[`text_${i+1}`] = b.txt;
            }
        });
        blocks[blockId] = { type: 'features_grid', settings };
        currentThird = { images: [], headings: [], texts: [], blocks: [] };
    }
}

function flushHalf() {
    if (currentHalf.images.length > 0 || currentHalf.headings.length > 0 || currentHalf.texts.length > 0) {
        if (currentHalf.images.length > 1 && currentHalf.headings.length === 0 && currentHalf.texts.length === 0) {
            let blockId = `features_grid_${blockCounter++}`;
            block_order.push(blockId);
            let settings = { image_on: true, margin_bottom: 80, columns_desktop: 2, icon_size: 'large' };
            currentHalf.images.forEach((img, i) => { 
                if (i < 4) settings[`image_url_${i+1}`] = img; 
            });
            blocks[blockId] = { type: 'features_grid', settings };
        } else {
            let layoutDir = 'right';
            if (currentHalf.firstType === 'IMG') layoutDir = 'left';
            
            let combinedTextParts = [];
            for(let j=0; j < Math.max(currentHalf.headings.length, currentHalf.texts.length); j++) {
                 if (j > 0 && currentHalf.headings[j]) combinedTextParts.push(`<h3>${currentHalf.headings[j]}</h3>`);
                 if (currentHalf.texts[j]) combinedTextParts.push(`${currentHalf.texts[j]}`);
            }

            let formattedTextContent = '';
            combinedTextParts.forEach(part => {
                if (part.startsWith('<h')) {
                    formattedTextContent += part;
                } else {
                    formattedTextContent += `<p>${part}</p>`;
                }
            });

            let blockId = `image_text_${blockCounter++}`;
            block_order.push(blockId);
            blocks[blockId] = {
                type: 'image_text',
                settings: {
                    layout: layoutDir,
                    image_url: currentHalf.images[0] || '',
                    heading: currentHalf.headings[0] || '',
                    text: formattedTextContent,
                    margin_bottom: 24
                }
            };
        }
        currentHalf = { images: [], headings: [], texts: [], outer: null, firstType: null };
    }
}

function flushQuarter() {
    if (currentQuarter.length > 0) {
        const blockId = `features_grid_${blockCounter++}`;
        block_order.push(blockId);
        let settings = { image_on: true, margin_bottom: 80, columns_desktop: 4, icon_size: 'small' };
        currentQuarter.forEach((img, i) => { if (i < 4) settings[`image_url_${i+1}`] = img; });
        blocks[blockId] = { type: 'features_grid', settings };
        currentQuarter = [];
    }
}

function flushFullText() {
    if (currentFullHeaders.length > 0 || currentFullTexts.length > 0) {
        let formattedTextContent = '';
        currentFullTexts.forEach(part => {
            if (part.startsWith('<h') || part.startsWith('<p>')) {
                formattedTextContent += part;
            } else {
                formattedTextContent += `<p>${part}</p>`;
            }
        });

        const blockId = `rich_text_${blockCounter++}`;
        block_order.push(blockId);
        blocks[blockId] = {
            type: 'rich_text',
            settings: {
                heading: currentFullHeaders.join(' '),
                text: formattedTextContent,
                text_alignment: 'center',
                margin_bottom: 24
            }
        };
        currentFullHeaders = [];
        currentFullTexts = [];
    }
}

let inProducts = false;
let foundStart = false;

cleanItems.forEach(item => {
    if (!foundStart) {
        if (item.type === 'IMG' || item.content.includes('concept')) foundStart = true;
        else return;
    }

    if (inProducts) {
        if (item.content.includes('Jackets')) {
             block_order.push(`product_grid_${blockCounter++}`);
             blocks[`product_grid_${blockCounter-1}`] = { type: 'product_grid', settings: { heading: 'Jackets', columns_desktop: 4, margin_bottom: 80 } };
        } else if (item.state === 'full' && item.type === 'IMG' && !item.content.includes('cdn/shop/files')) {
             inProducts = false;
        } else return;
    }

    if (!inProducts && item.content.includes('Coats')) {
         flushFullText(); flushHalf(); flushQuarter(); flushThird();
         inProducts = true;
         block_order.push(`product_grid_${blockCounter++}`);
         blocks[`product_grid_${blockCounter-1}`] = { type: 'product_grid', settings: { heading: 'Coats', columns_desktop: 4, margin_bottom: 80 } };
         return;
    }
    if (inProducts) return;

    const isHalf = item.state === 'half';
    const isQuarter = item.state === 'quarter';
    const isThird = item.state === 'third';
    const type = item.type;
    const content = item.content;
    const outerId = item.outer;

    if (isHalf) {
        flushFullText(); flushQuarter(); flushThird();
        if (currentHalf.outer && currentHalf.outer !== outerId) flushHalf();
        if (!currentHalf.outer) currentHalf.outer = outerId;
        if (!currentHalf.firstType) currentHalf.firstType = (type === 'IMG') ? 'IMG' : 'TEXT';

        if (type === 'IMG') currentHalf.images.push(content);
        if (type === 'HEAD') currentHalf.headings.push(content);
        if (type === 'TEXT') currentHalf.texts.push(content);
        
    } else if (isQuarter) {
        flushFullText(); flushHalf(); flushThird();
        if (type === 'IMG') currentQuarter.push(content);
    } else if (isThird) {
        flushFullText(); flushHalf(); flushQuarter();
        if (type === 'IMG' && (currentThird.images.length > 0 || currentThird.headings.length > 0)) {
             currentThird.blocks.push({
                 img: currentThird.images[0] || '',
                 head: currentThird.headings.join(' - '),
                 txt: currentThird.texts.join('\n')
             });
             currentThird.images = [content];
             currentThird.headings = [];
             currentThird.texts = [];
        } else {
             if (type === 'IMG') currentThird.images.push(content);
             if (type === 'HEAD') currentThird.headings.push(content);
             if (type === 'TEXT') currentThird.texts.push(content);
        }
    } else {
        flushHalf(); flushQuarter(); flushThird();
        if (type === 'IMG') {
             flushFullText();
             const blockId = `image_full_${blockCounter++}`;
             block_order.push(blockId);
             blocks[blockId] = { type: 'image_full', settings: { image_url: content, margin_bottom: 24 } };
        } else if (type === 'HEAD') {
             if (currentFullHeaders.length === 0) {
                  currentFullHeaders.push(content);
             } else {
                  currentFullTexts.push(`<h3>${content}</h3>`);
             }
        } else if (type === 'TEXT') {
             currentFullTexts.push(content);
        }
    }
});

flushFullText(); flushHalf(); flushQuarter(); flushThird();

// Post-processing to turn image-only half sections into features_grid (for the 4 reviews)
const new_order = [];
const new_blocks = {};
let currentFeaturesGrid = [];

function flushFeatures() {
    if (currentFeaturesGrid.length > 0) {
        const id = 'features_grid_auto_' + blockCounter++;
        new_order.push(id);
        const settings = { image_on: true, margin_bottom: 32, icon_size: 'large', columns_desktop: 2 };
        currentFeaturesGrid.forEach((img, i) => { if (i < 4) settings[`image_url_${i+1}`] = img; });
        new_blocks[id] = { type: 'features_grid', settings };
        currentFeaturesGrid = [];
    }
}

block_order.forEach(id => {
    const b = blocks[id];
    
    // Post process Q&A text blocks into accordions
    if (b.type === 'rich_text' && b.settings.text && b.settings.text.includes('>Q.') && b.settings.text.includes('>A.')) {
        flushFeatures();
        
        // If there's a heading for the Q&A section, push it isolated first!
        if (b.settings.heading) {
            const hId = `rich_text_heading_${blockCounter++}`;
            new_order.push(hId);
            new_blocks[hId] = {
                type: 'rich_text',
                settings: { heading: b.settings.heading, text: '', margin_bottom: 24, text_alignment: 'center' }
            };
        }
        
        const contentStr = b.settings.text;
        const pMatches = contentStr.match(/<p>.*?<\/p>/g) || [];
        
        let activeQ = null;
        let activeA = [];
        
        const pushAccordion = () => {
             if (activeQ) {
                 const aId = `accordion_${blockCounter++}`;
                 new_order.push(aId);
                 new_blocks[aId] = {
                     type: 'accordion',
                     settings: {
                         title: activeQ,
                         content: activeA.join(''),
                         open: false,
                         margin_bottom: 16
                     }
                 };
             }
        };
        
        pMatches.forEach(pTag => {
             // Remove wrapper for matching
             let innerText = pTag.replace(/^<p>/, '').replace(/<\/p>$/, '');
             if (innerText.startsWith('Q.')) {
                 pushAccordion();
                 activeQ = innerText;
                 activeA = [];
             } else {
                 activeA.push(pTag);
             }
        });
        pushAccordion();
        
    } else if (b.type === 'image_text' && !b.settings.heading && !b.settings.text) {
        if (b.settings.image_url) currentFeaturesGrid.push(b.settings.image_url);
        if (currentFeaturesGrid.length >= 4) flushFeatures();
    } else {
        flushFeatures();
        new_order.push(id);
        new_blocks[id] = b;
    }
});
flushFeatures();

// Assign Hero
const firstImageId = new_order.find(id => id.startsWith('image_full'));
if (firstImageId && new_blocks[firstImageId]) {
    new_blocks[firstImageId].type = 'hero';
}

const finalJson = {
  "sections": {
    "main": {
      "type": "universal-campaign-lp",
      "blocks": new_blocks,
      "block_order": new_order,
      "settings": { "bg_color": "#ffffff", "container_width": 1000 }
    }
  },
  "order": ["main"]
};

fs.writeFileSync(`templates/page.${templateName}.json`, JSON.stringify(finalJson, null, 2));

console.log('Block count:', new_order.length);
new_order.forEach(id => {
    if(new_blocks[id].type === 'accordion') {
         console.log('Accordion:', new_blocks[id].settings.title);
    }
});
