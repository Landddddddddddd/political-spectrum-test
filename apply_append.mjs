import fs from 'fs';
import os from 'os';
import path from 'path';

const tmp = os.tmpdir();
const ts = Date.now();

function backupAndVerify(file) {
  const data = fs.readFileSync(file, 'utf8');
  JSON.parse(data); // throws if invalid
  const dest = path.join(tmp, `${file}.bak_${ts}`);
  fs.copyFileSync(file, dest);
  JSON.parse(fs.readFileSync(dest, 'utf8'));
  console.log('backed up', file, '->', dest, '(', data.length, 'bytes )');
}

backupAndVerify('question_bank.json');
backupAndVerify('changelog.json');

// ---------- generic EOL-aware append ----------
function appendArray(file, items, ser) {
  let s = fs.readFileSync(file, 'utf8');
  const arr = JSON.parse(s);
  const before = arr.length;
  arr.push(...items);
  if (arr.length !== before + items.length) throw new Error('push failed: ' + file);
  const eol = s.includes('\r\n') ? '\r\n' : '\n';
  if (!new RegExp('\\]' + (eol === '\r\n' ? '\\r\\n' : '\\n') + '$').test(s))
    throw new Error('unexpected ending for ' + file + ': ' + JSON.stringify(s.slice(-12)));
  const base = s.replace(new RegExp('\\]' + (eol === '\r\n' ? '\\r\\n' : '\\n') + '$'), '');
  const newBlock = eol + ',' + eol + items.map(ser).join(',' + eol) + eol;
  const out = base + newBlock + ']' + eol;
  fs.writeFileSync(file, out, 'utf8');
  return { before, after: arr.length };
}

// ---------- question_bank.json ----------
const nq = JSON.parse(fs.readFileSync('new_questions.json', 'utf8'));
const serQ = (q) => JSON.stringify(q, null, 2).split('\n').map(l => '  ' + l).join('\r\n');
const rb = appendArray('question_bank.json', nq, serQ);

// ---------- changelog.json ----------
const nentry = JSON.parse(fs.readFileSync('new_changelog_entry.json', 'utf8'));
const serE = (e) => JSON.stringify(e, null, 2).split('\n').map(l => '  ' + l).join('\r\n');
const rc = appendArray('changelog.json', [nentry], serE);

// ---------- final verification ----------
const fb = JSON.parse(fs.readFileSync('question_bank.json', 'utf8'));
const fc = JSON.parse(fs.readFileSync('changelog.json', 'utf8'));
console.log('question_bank.json length:', fb.length, '(expected', rb.before + nq.length, ')');
console.log('last id:', fb[fb.length - 1].id, 'first new id:', fb[rb.before].id);
console.log('changelog.json length:', fc.length, '(expected', rc.before + 1, ')');
console.log('APPEND OK');
