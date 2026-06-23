const https = require('https')
const fs = require('fs')
const path = require('path')

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1WebBot/1.0' } }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch { reject(new Error('parse')) } })
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// f1StandingsApi.ts에서 이미 등록된 이름/ID 추출
const ts = fs.readFileSync(path.join(__dirname, '../src/lib/f1StandingsApi.ts'), 'utf8')

const knownNames = new Set()
for (const m of ts.matchAll(/'([A-Za-zÀ-ÿ][\w\sÀ-ÿ'./-]+)':\s+'[^']+'/g)) {
  knownNames.add(m[1])
}

const knownIds = new Set()
const idBlock = ts.match(/const DRIVER_ID_KR_NAMES[^=]+=\s*\{([\s\S]*?)\}/)
if (idBlock) {
  for (const m of idBlock[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    knownIds.add(m[1])
  }
}

async function main() {
  const missing = new Map()

  for (let year = 1950; year <= 2024; year++) {
    try {
      const data = await get(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json?limit=200`)
      const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []

      for (const s of standings) {
        const id = s.Driver.driverId
        const name = `${s.Driver.givenName} ${s.Driver.familyName}`
        const nat = s.Driver.nationality ?? ''

        if (!knownNames.has(name) && !knownIds.has(id)) {
          if (!missing.has(id)) {
            missing.set(id, { name, nat, years: [year] })
          } else {
            missing.get(id).years.push(year)
          }
        }
      }
      process.stdout.write(`\r스캔 중: ${year}`)
      await sleep(150)
    } catch {
      // 해당 연도 데이터 없으면 스킵
    }
  }

  console.log('\n')

  // 연도 오름차순 정렬
  const sorted = [...missing.entries()].sort((a, b) => a[1].years[0] - b[1].years[0])

  let out = '// ── 미등록 드라이버 (전 시즌 스캔 결과) ──\n'
  for (const [id, { name, nat, years }] of sorted) {
    out += `  ${id}: '',  // ${name} (${nat}) [${years[0]}]\n`
  }
  out += `\n// 총 ${sorted.length}명\n`

  const outPath = path.join(__dirname, 'missing-drivers.txt')
  fs.writeFileSync(outPath, out, 'utf8')
  console.log(out)
  console.log(`→ scripts/missing-drivers.txt 저장 완료`)
}

main()
