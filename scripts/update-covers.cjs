const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const pDir = path.join(__dirname, '..', 'public', 'pandhals');
const dataFile = path.join(__dirname, '..', 'src', 'data', 'pandhals.js');

const pandhalsList = [
  { id: 'pandhal-01', number: 1, name: 'Vijayanagar Ka Dada' },
  { id: 'pandhal-02', number: 2, name: 'Sri Ekalavya Yuvakara Sangha' },
  { id: 'pandhal-03', number: 3, name: 'Sri Gajanana Yuvakara Sangha' },
  { id: 'pandhal-04', number: 4, name: "Ambedkar Youth's Association" },
  { id: 'pandhal-05', number: 5, name: 'Sri Moshika Vahana Mitra Vrunda' },
  { id: 'pandhal-06', number: 6, name: 'Sri Gajanan Sevalal Yuvakara Sangha' },
  { id: 'pandhal-07', number: 7, name: 'Bhima Yuvakara Sangha' },
  { id: 'pandhal-08', number: 8, name: 'Hospet Ka Sarkar' },
  { id: 'pandhal-09', number: 9, name: 'Hospet Ka Raja' },
  { id: 'pandhal-10', number: 10, name: 'Banadakeri Yuvakara Sangha' },
  { id: 'pandhal-11', number: 11, name: 'Sri Vayuputra Yuvakara Sangha' },
  { id: 'pandhal-12', number: 12, name: 'Bhisma yuvakara Sangha' },
  { id: 'pandhal-13', number: 13, name: 'Svg Youths TB Dam' },
  { id: 'pandhal-14', number: 14, name: "JBY Brother's" },
  { id: 'pandhal-15', number: 15, name: 'Prasanna Yuva Mandali' },
  { id: 'pandhal-16', number: 16, name: 'Ekadanta Yuvakara Sangha' },
  { id: 'pandhal-17', number: 17, name: 'Chalavadhi Yuvakara Balaga' },
  { id: 'pandhal-18', number: 18, name: 'Vasavi Yuva Yojana Sangha' },
  { id: 'pandhal-19', number: 19, name: 'TM HRV' },
  { id: 'pandhal-20', number: 20, name: 'STD Boys' },
  { id: 'pandhal-21', number: 21, name: 'Bala Gajanana Yuvaka Sangha' }
];

async function build() {
  const result = [];

  for (const p of pandhalsList) {
    const dirPath = path.join(pDir, p.id);
    let files = fs.readdirSync(dirPath).filter(f => f.endsWith('.webp') && !f.endsWith('-thumb.webp'));
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    // Custom Cover Overrides:
    if (p.id === 'pandhal-07') {
      // IMG_7108.JPG.webp should be cover (first)
      const target = files.find(f => f.includes('7108'));
      if (target) {
        files = [target, ...files.filter(f => f !== target)];
      }
    } else if (p.id === 'pandhal-17') {
      // IMG_7209.webp should be cover (first)
      const target = files.find(f => f.includes('7209'));
      if (target) {
        files = [target, ...files.filter(f => f !== target)];
      }
    }

    const photos = [];
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const base = file.replace('.webp', '');
      const thumb = base + '-thumb.webp';
      const fullPath = path.join(dirPath, file);
      const meta = await sharp(fullPath).metadata();
      const aspect = (meta.width && meta.height) ? Number((meta.width / meta.height).toFixed(3)) : 1.0;

      photos.push({
        id: `${p.id}-img-${idx + 1}`,
        src: `/pandhals/${p.id}/${file}`,
        thumbSrc: `/pandhals/${p.id}/${thumb}`,
        alt: `${p.name} - Photo ${idx + 1}`,
        aspectRatio: aspect
      });
    }

    result.push({
      id: p.id,
      number: p.number,
      name: p.name,
      photos
    });
  }

  const outputCode = 'export const PANDHALS_DATA = ' + JSON.stringify(result, null, 2) + ';\n';
  fs.writeFileSync(dataFile, outputCode, 'utf8');
  console.log('✅ pandhals.js successfully updated with custom covers for Pandhal 07 & 17!');
}

build().catch(console.error);
