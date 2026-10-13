const assert = require('node:assert/strict');
// Use an existing Playwright installation; no production dependency is required.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.QA_BASE || 'http://127.0.0.1:3503';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER_PATH ? {executablePath:process.env.QA_BROWSER_PATH} : {})});
 const failures=[],checks=[],browserErrors=[];
 async function check(name,fn){try{await fn();checks.push(name)}catch(e){failures.push({name,error:e.message})}}
 try {
 const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();
 page.on('pageerror',error=>browserErrors.push(error.message));
 await page.goto(base+'/guides/document-control-software/',{waitUntil:'networkidle'});
 await check('brand stays on one line without overlapping the menu',async()=>{for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});const nav=page.getByRole('navigation',{name:'Main navigation'});const brand=nav.getByRole('link',{name:'ISO Certification Consultants home',exact:true});const m=await brand.locator('span.font-heading').evaluate(e=>({height:e.getBoundingClientRect().height,line:parseFloat(getComputedStyle(e).lineHeight),right:e.getBoundingClientRect().right}));assert.ok(m.height<m.line*1.5,`Brand wraps at ${width}px`);if(width<1280){const menu=await nav.getByRole('button',{name:'Toggle menu'}).boundingBox();assert.ok(m.right<menu.x,`Brand overlaps the menu at ${width}px`);}}});
 await check('desktop navigation has single-line actions',async()=>{const links=page.locator('header a').filter({hasText:/^(Free Assessment|Book a Consultation)$/});for(const a of await links.all()){if(await a.isVisible()){const m=await a.evaluate(e=>({height:e.getBoundingClientRect().height,line:parseFloat(getComputedStyle(e).lineHeight),padding:parseFloat(getComputedStyle(e).paddingTop)+parseFloat(getComputedStyle(e).paddingBottom)}));assert.ok(m.height-m.padding<m.line*1.5,'Navigation action wraps onto multiple lines');}}});
 await check('guide prose is separated from its image',async()=>{const gap=await page.locator('article').evaluate(e=>{const img=e.querySelector('img'),heading=e.querySelector('h2');return heading.getBoundingClientRect().top-img.getBoundingClientRect().bottom;});assert.ok(gap>=30,`Image-to-prose spacing is ${gap}px`)});
 await check('guide title and reading column align',async()=>{const dimensions=await page.evaluate(()=>{const title=document.querySelector('main h1').getBoundingClientRect(),article=document.querySelector('article').getBoundingClientRect();return {titleLeft:title.left,articleLeft:article.left,width:article.width};});assert.equal(dimensions.titleLeft,dimensions.articleLeft);assert.ok(dimensions.width<=780)});
 await page.goto(base+'/guides/document-control-software/ongoing-operation/',{waitUntil:'networkidle'});
 await check('nine guide FAQs are collapsible and keyboard accessible',async()=>{const section=page.locator('section[aria-labelledby="frequently-asked-questions"]');assert.equal(await section.locator('details').count(),9);const first=section.locator('details').first();assert.equal(await first.evaluate(e=>e.open),false);await first.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await first.evaluate(e=>e.open),true);assert.ok((await first.innerText()).includes('solve'));assert.equal(await page.getByRole('heading',{name:'Prepare a software demonstration',exact:true}).count(),1)});
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 await check('hero reveals a persistent contact form after animation',async()=>{assert.equal(await page.locator('main form').count(),1);assert.equal(await page.locator('main form').isVisible(),false);await page.locator('main form').waitFor({state:'visible',timeout:8000});await page.getByLabel('Full name',{exact:true}).fill('QA Example');await page.waitForTimeout(1000);assert.equal(await page.getByLabel('Full name',{exact:true}).inputValue(),'QA Example');});
 await context.close();
 const reduced=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});const rp=await reduced.newPage();rp.on('pageerror',error=>browserErrors.push(error.message));await rp.goto(base+'/',{waitUntil:'domcontentloaded'});await check('reduced motion shows the contact form without the animation delay',async()=>{await rp.locator('main form').waitFor({state:'visible',timeout:2500})});await reduced.close();
 await check('pages hydrate without browser errors',async()=>{assert.deepEqual(browserErrors,[])});
 console.log(JSON.stringify({pass:!failures.length,checks,failures},null,2));if(failures.length)process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
