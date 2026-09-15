const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const heicConvert = require('heic-convert');

const pandhalsDir = path.join(__dirname, '..', 'public', 'pandhals');
const dataFile = path.join(__dirname, '..', 'src', 'data', 'pandhals.js');

async function processFile(inputPath, outWebpPath, outThumbPath) {
  let imgBuffer = null;
  let isHeicFallback = false;

  const ext = path.extname(inputPath).toLowerCase();

  if (ext === '.heic') {
    try {
      // First try direct sharp conversion
      await sharp(inputPath)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(outWebpPath);

      await sharp(inputPath)
        .rotate()
        .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 3 })
        .toFile(outThumbPath);

      const meta = await sharp(outWebpPath).metadata();
      return { width: meta.width, height: meta.height };
    } catch (sharpErr) {
      // Fallback to heicConvert
      // console.log(`  (Using heicConvert fallback for ${path.basename(inputPath)})`);
      const rawBuf = fs.readFileSync(inputPath);
      const jpegBuf = await heicConvert({ buffer: rawBuf, format: 'JPEG', quality: 0.92 });
      imgBuffer = jpegBuf;
      isHeicFallback = true;
    }
  }

  const sharpInstance = imgBuffer ? sharp(imgBuffer) : sharp(inputPath);

  await sharpInstance
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toFile(outWebpPath);

  const thumbInstance = imgBuffer ? sharp(imgBuffer) : sharp(inputPath);
  await thumbInstance
    .rotate()
    .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 3 })
    .toFile(outThumbPath);

  const meta = await sharp(outWebpPath).metadata();
  return { width: meta.width, height: meta.height };
}

async function processAll() {
  console.log('--- Starting Robust HEIC & Image Processing for All Pandhals ---');
  const folders = fs.readdirSync(pandhalsDir).filter(f => fs.statSync(path.join(pandhalsDir, f)).isDirectory()).sort();
  
  const results = {};
  let totalProcessed = 0;

  for (const folder of folders) {
    const dirPath = path.join(pandhalsDir, folder);
    const files = fs.readdirSync(dirPath).filter(f => 
      !f.startsWith('.') && 
      !f.endsWith('-thumb.webp') && 
      !f.endsWith('.webp') && 
      (f.toLowerCase().endsWith('.heic') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'))
    );

    // Natural sort files
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    console.log(`Processing ${folder} (${files.length} images)...`);
    results[folder] = [];

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const inputPath = path.join(dirPath, file);

      const outWebp = `${base}.webp`;
      const outThumb = `${base}-thumb.webp`;
      const outWebpPath = path.join(dirPath, outWebp);
      const outThumbPath = path.join(dirPath, outThumb);

      try {
        const { width, height } = await processFile(inputPath, outWebpPath, outThumbPath);
        const aspect = (width && height) ? Number((width / height).toFixed(3)) : 1.0;

        results[folder].push({
          id: `${folder}-img-${idx + 1}`,
          src: `/pandhals/${folder}/${outWebp}`,
          thumbSrc: `/pandhals/${folder}/${outThumb}`,
          rawFile: file,
          width,
          height,
          aspectRatio: aspect
        });
        totalProcessed++;
        process.stdout.write(` [${idx + 1}/${files.length}]`);
      } catch (err) {
        console.error(`\n[FAILED] ${inputPath}:`, err.message);
      }
    }
    console.log(`\n -> Completed ${folder}`);
  }

  console.log(`\n🎉 Successfully processed ${totalProcessed} images across all pandhals!`);

  // Update src/data/pandhals.js
  console.log('Writing updated pandhals data to src/data/pandhals.js...');
  const pandhalsList = [
    { id: "pandhal-01", number: 1, name: "Vijayanagar Ka Dada" },
    { id: "pandhal-02", number: 2, name: "Sri Ekalavya Yuvakara Sangha" },
    { id: "pandhal-03", number: 3, name: "Sri Gajanana Yuvakara Sangha" },
    { id: "pandhal-04", number: 4, name: "Ambedkar Youth's Association" },
    { id: "pandhal-05", number: 5, name: "Sri Moshika Vahana Mitra Vrunda" },
    { id: "pandhal-06", number: 6, name: "Sri Gajanan Sevalal Yuvakara Sangha" },
    { id: "pandhal-07", number: 7, name: "Bhima Yuvakara Sangha" },
    { id: "pandhal-08", number: 8, name: "Hospet Ka Sarkar" },
    { id: "pandhal-09", number: 9, name: "Hospet Ka Raja" },
    { id: "pandhal-10", number: 10, name: "Banadakeri Yuvakara Sangha" },
    { id: "pandhal-11", number: 11, name: "Sri Vayuputra Yuvakara Sangha" },
    { id: "pandhal-12", number: 12, name: "Bhisma yuvakara Sangha" },
    { id: "pandhal-13", number: 13, name: "Svg Youths TB Dam" },
    { id: "pandhal-14", number: 14, name: "JBY Brother's" },
    { id: "pandhal-15", number: 15, name: "Prasanna Yuva Mandali" },
    { id: "pandhal-16", number: 16, name: "Ekadanta Yuvakara Sangha" },
    { id: "pandhal-17", number: 17, name: "Chalavadhi Yuvakara Balaga" },
    { id: "pandhal-18", number: 18, name: "Vasavi Yuva Yojana Sangha" },
    { id: "pandhal-19", number: 19, name: "TM HRV" },
    { id: "pandhal-20", number: 20, name: "STD Boys" },
    { id: "pandhal-21", number: 21, name: "Bala Gajanana Yuvaka Sangha" }
  ];

  const updatedData = pandhalsList.map(p => {
    const folderPhotos = results[p.id] || [];
    const photos = folderPhotos.map((item, i) => ({
      id: item.id,
      src: item.src,
      thumbSrc: item.thumbSrc,
      alt: `${p.name} - Photo ${i + 1}`,
      width: item.width,
      height: item.height,
      aspectRatio: item.aspectRatio
    }));
    return {
      id: p.id,
      number: p.number,
      name: p.name,
      photos: photos
    };
  });

  const outputCode = `export const PANDHALS_DATA = ${JSON.stringify(updatedData, null, 2)};\n`;
  fs.writeFileSync(dataFile, outputCode, 'utf8');
  console.log('✅ src/data/pandhals.js successfully updated with authentic photos!');
}

processAll().catch(console.error);
