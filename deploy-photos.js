import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactsDir = 'C:\\Users\\srini\\.gemini\\antigravity-ide\\brain\\0f3d19f2-94c5-41c6-b52e-2ebe1341898b';
const heroMasterPath = path.join(artifactsDir, 'hero_ganesha_master_1788203962962.jpg');
const goldThronePath = path.join(artifactsDir, 'pandhal_gold_throne_1788203985348.jpg');
const lotusBappaPath = path.join(artifactsDir, 'pandhal_lotus_bappa_1788204006477.jpg');

const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'assets');
const pandhalsDir = path.join(publicDir, 'pandhals');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Copy Hero Image
fs.copyFileSync(heroMasterPath, path.join(assetsDir, 'hero-master.jpg'));

// Distribute photorealistic covers and gallery images across all 21 pandhals
const availablePhotos = [goldThronePath, lotusBappaPath, heroMasterPath];

for (let i = 1; i <= 21; i++) {
  const padNum = String(i).padStart(2, '0');
  const folder = path.join(pandhalsDir, `pandhal-${padNum}`);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const primaryPhoto = (i % 2 === 1) ? goldThronePath : lotusBappaPath;
  const secondaryPhoto = (i % 2 === 1) ? lotusBappaPath : goldThronePath;

  fs.copyFileSync(primaryPhoto, path.join(folder, 'cover.webp'));
  fs.copyFileSync(heroMasterPath, path.join(folder, 'decoration-01.webp'));
  fs.copyFileSync(secondaryPhoto, path.join(folder, 'decoration-02.webp'));
  fs.copyFileSync(primaryPhoto, path.join(folder, 'cleanliness.webp'));
  fs.copyFileSync(heroMasterPath, path.join(folder, 'gallery-01.webp'));
}

console.log('Photorealistic master images deployed across all 21 pandhals!');
