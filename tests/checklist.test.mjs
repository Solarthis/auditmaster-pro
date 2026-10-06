import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
function setup(){
 const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),{runScripts:'dangerously',url:'https://example.invalid/',virtualConsole:vc});
 const app=dom.window.document.createElement('script');app.textContent=script;dom.window.document.body.append(app);
 return {w:dom.window,d:dom.window.document,errors,close:()=>dom.window.close()};
}
test('initial example rows still render',()=>{const s=setup();assert.equal(s.d.getElementById('list-container').children.length,28);assert.equal(s.errors.length,0);s.close();});
test('source search trims whitespace and finds FAA examples',()=>{const s=setup();const q=s.d.getElementById('search-input');q.value=' FAA ';q.dispatchEvent(new s.w.Event('input'));assert.equal(s.d.getElementById('list-container').children.length,18);s.close();});
test('reference-document names are searchable',()=>{const s=setup();const q=s.d.getElementById('search-input');q.value='QAP Manual';q.dispatchEvent(new s.w.Event('input'));assert.equal(s.d.getElementById('list-container').children.length,1);s.close();});
test('details expose expansion state and really hide collapsed panel',()=>{const s=setup();let button=s.d.querySelector('[onclick="toggleExpand(1)"]');assert.equal(button.getAttribute('aria-expanded'),'false');const id=button.getAttribute('aria-controls');assert.ok(id);assert.equal(s.d.getElementById(id).hidden,true);button.click();button=s.d.querySelector('[onclick="toggleExpand(1)"]');assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(s.d.getElementById(id).hidden,false);s.close();});
test('review toggle retains keyboard focus after rerender',()=>{const s=setup();const button=s.d.querySelector('[onclick="toggleAudit(1)"]');button.focus();button.click();assert.equal(s.d.activeElement.getAttribute('onclick'),'toggleAudit(1)');assert.equal(s.d.activeElement.getAttribute('aria-checked'),'true');s.close();});
test('details toggle retains keyboard focus after rerender',()=>{const s=setup();const b=s.d.querySelector('[onclick="toggleExpand(1)"]');b.focus();b.click();assert.equal(s.d.activeElement.getAttribute('onclick'),'toggleExpand(1)');s.close();});
test('progress is announced with reviewed counts',()=>{const s=setup();s.d.querySelector('[onclick="toggleAudit(1)"]').click();const p=s.d.getElementById('progress-bar');assert.equal(p.getAttribute('role'),'progressbar');assert.equal(p.getAttribute('aria-valuenow'),'4');assert.equal(p.getAttribute('aria-valuetext'),'1 of 28 reviewed');s.close();});
test('filter state is accessible',()=>{const s=setup();s.d.querySelector('[data-filter="Critical"]').click();assert.equal(s.d.querySelector('[data-filter="Critical"]').getAttribute('aria-pressed'),'true');assert.equal(s.d.querySelector('[data-filter="All"]').getAttribute('aria-pressed'),'false');s.close();});
test('prototype notice does not present seed checks as actual findings',()=>{const s=setup();assert.match(s.d.getElementById('prototype-notice')?.textContent||'',/not an approved compliance checklist/i);assert.ok(!s.d.body.textContent.includes('Critical Findings'));s.close();});
