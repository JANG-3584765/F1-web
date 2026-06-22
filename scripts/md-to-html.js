const fs = require('fs')
const path = require('path')

const inputFiles = process.argv.slice(2)
if (!inputFiles.length) { console.error('Usage: node md-to-html.js <input.md> [input2.md ...]'); process.exit(1) }

function escape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function inlineMarkdown(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => `<code>${escape(c)}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function convertMd(raw) {
  const lines = raw.split('\n')
  const htmlLines = []
  let inCodeBlock = false
  let codeLang = ''
  let codeLines = []
  let inTable = false
  let tableRows = []
  let inBlockquote = false
  let blockquoteLines = []
  let title = ''

  function flushTable() {
    if (!tableRows.length) return
    const [headerRow, , ...bodyRows] = tableRows
    const headers = headerRow.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(h => `<th>${inlineMarkdown(h.trim())}</th>`).join('')
    const body = bodyRows.map(r => {
      const cells = r.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => `<td>${inlineMarkdown(c.trim())}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('\n')
    htmlLines.push(`<table>\n<thead><tr>${headers}</tr></thead>\n<tbody>\n${body}\n</tbody></table>`)
    tableRows = []
    inTable = false
  }

  function flushBlockquote() {
    if (!blockquoteLines.length) return
    const inner = blockquoteLines.map(l => `<p>${inlineMarkdown(l)}</p>`).join('\n')
    htmlLines.push(`<blockquote>${inner}</blockquote>`)
    blockquoteLines = []
    inBlockquote = false
  }

  for (const line of lines) {
    // 코드 블록
    if (line.startsWith('```')) {
      if (inTable) flushTable()
      if (inBlockquote) flushBlockquote()
      if (inCodeBlock) {
        htmlLines.push(`<pre><code class="language-${codeLang}">${escape(codeLines.join('\n'))}</code></pre>`)
        inCodeBlock = false; codeLines = []
      } else {
        codeLang = line.slice(3).trim()
        inCodeBlock = true; codeLines = []
      }
      continue
    }
    if (inCodeBlock) { codeLines.push(line); continue }

    // 테이블
    if (line.startsWith('|')) {
      if (inBlockquote) flushBlockquote()
      inTable = true
      tableRows.push(line)
      continue
    }
    if (inTable) flushTable()

    // blockquote
    const bq = line.match(/^>\s?(.*)/)
    if (bq) {
      inBlockquote = true
      blockquoteLines.push(bq[1])
      continue
    }
    if (inBlockquote) flushBlockquote()

    // 수평선
    if (/^---+\s*$/.test(line)) { htmlLines.push('<hr>'); continue }

    // 제목
    const h6 = line.match(/^######\s+(.+)/); if (h6) { htmlLines.push(`<h6>${inlineMarkdown(h6[1])}</h6>`); continue }
    const h5 = line.match(/^#####\s+(.+)/);  if (h5) { htmlLines.push(`<h5>${inlineMarkdown(h5[1])}</h5>`); continue }
    const h4 = line.match(/^####\s+(.+)/);   if (h4) { htmlLines.push(`<h4>${inlineMarkdown(h4[1])}</h4>`); continue }
    const h3 = line.match(/^###\s+(.+)/);    if (h3) { htmlLines.push(`<h3>${inlineMarkdown(h3[1])}</h3>`); continue }
    const h2 = line.match(/^##\s+(.+)/);     if (h2) { htmlLines.push(`<h2>${inlineMarkdown(h2[1])}</h2>`); continue }
    const h1 = line.match(/^#\s+(.+)/);
    if (h1) {
      if (!title) title = h1[1]
      htmlLines.push(`<h1>${inlineMarkdown(h1[1])}</h1>`)
      continue
    }

    // 리스트
    const li = line.match(/^(\s*)-\s+(.+)/)
    if (li) { htmlLines.push(`<li style="margin-left:${li[1].length * 8}px">${inlineMarkdown(li[2])}</li>`); continue }
    const oli = line.match(/^(\s*)\d+\.\s+(.+)/)
    if (oli) { htmlLines.push(`<li style="list-style-type:decimal;margin-left:${oli[1].length * 8 + 16}px">${inlineMarkdown(oli[2])}</li>`); continue }

    if (line.trim() === '') { htmlLines.push('<br>'); continue }

    htmlLines.push(`<p>${inlineMarkdown(line)}</p>`)
  }

  if (inTable) flushTable()
  if (inBlockquote) flushBlockquote()
  if (inCodeBlock) htmlLines.push(`<pre><code>${escape(codeLines.join('\n'))}</code></pre>`)

  return { body: htmlLines.join('\n'), title: title || '학습 문서' }
}

function buildHtml(body, title) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<style>
  @import url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.css');
  *{box-sizing:border-box}
  body{
    font-family:'Pretendard Variable','Malgun Gothic',sans-serif;
    font-size:14px;line-height:1.8;
    color:#1a1a1a;background:#fff;
    max-width:900px;margin:0 auto;padding:40px 32px;
  }
  h1{font-size:2em;border-bottom:2px solid #e10600;padding-bottom:8px;margin-top:32px}
  h2{font-size:1.5em;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:28px;color:#222}
  h3{font-size:1.15em;margin-top:20px;color:#333}
  h4,h5,h6{font-size:1em;margin-top:16px;color:#444}
  p{margin:6px 0}
  li{margin:3px 0}
  a{color:#e10600;text-decoration:none}
  a:hover{text-decoration:underline}
  code{
    font-family:'Consolas','D2Coding','Courier New',monospace;
    font-size:0.88em;background:#f5f5f5;
    padding:2px 5px;border-radius:3px;color:#c7254e
  }
  pre{
    background:#1e1e1e;color:#d4d4d4;
    padding:16px;border-radius:6px;
    overflow-x:auto;margin:12px 0;
    font-family:'Consolas','D2Coding',monospace;font-size:0.85em;line-height:1.5
  }
  pre code{background:none;color:inherit;padding:0;font-size:inherit}
  table{border-collapse:collapse;width:100%;margin:12px 0;font-size:0.9em}
  th,td{border:1px solid #ddd;padding:7px 12px;text-align:left}
  th{background:#f7f7f7;font-weight:700}
  tr:hover{background:#fafafa}
  hr{border:none;border-top:1px solid #eee;margin:24px 0}
  blockquote{
    border-left:3px solid #e10600;
    margin:12px 0;padding:8px 16px;
    color:#555;background:#fafafa;border-radius:0 4px 4px 0
  }
  blockquote p{margin:2px 0}
  strong{font-weight:700}
  @media print{
    body{max-width:100%;padding:20px}
    pre{white-space:pre-wrap;word-break:break-all}
  }
</style>
</head>
<body>
${body}
</body>
</html>`
}

for (const inputFile of inputFiles) {
  try {
    const raw = fs.readFileSync(inputFile, 'utf8')
    const { body, title } = convertMd(raw)
    const html = buildHtml(body, title)
    const outputFile = inputFile.replace(/\.md$/, '.html')
    fs.writeFileSync(outputFile, html, 'utf8')
    console.log(`✓ ${path.basename(outputFile)}`)
  } catch (e) {
    console.error(`✗ ${inputFile}: ${e.message}`)
  }
}
