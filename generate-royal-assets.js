import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const pandhalsDir = path.join(publicDir, 'pandhals');

const themes = [
  { name: "Raja of Grand Chowk", style: "Royal Peshwa Durbar", crown: "Peshwa Shahi Mukut", color: "#B30006", accent: "#FF8C00", gold: "#FFD700" },
  { name: "Siddhi Vinayaka of Tilak Nagar", style: "Kailash Shivling Theme", crown: "Trishul Chandra Mukut", color: "#0D2B45", accent: "#20A4F3", gold: "#FFEAA7" },
  { name: "Navaratna Bappa of Gold Market", style: "Suvarna Ratna Mahal", crown: "Navaratna Kundan Crown", color: "#3D0835", accent: "#E0245E", gold: "#FFDE59" },
  { name: "Eco Bappa of Green Valley", style: "Prakriti Tulsi Sanctuary", crown: "Eco Clay Floral Mukut", color: "#0B3C26", accent: "#2EC4B6", gold: "#E9C46A" },
  { name: "Vighnaharta of Lalitpur", style: "Raigad Fort Shahi Mandap", crown: "Chhatrapati Veer Crown", color: "#5C1300", accent: "#FF5400", gold: "#FFD166" },
  { name: "Mahaganapathi of Subhash Marg", style: "Surya Ratha Golden Dawn", crown: "Surya Tejas Sun Crown", color: "#4A1800", accent: "#F26419", gold: "#FFF07C" },
  { name: "Mayureshwar of Lotus Lake", style: "Blooming Pink Lotus Pond", crown: "Lotus Petal Diamond Crown", color: "#450A30", accent: "#FF6B8B", gold: "#FFEAA7" },
  { name: "Chintamani of Shastri Nagar", style: "Ancient Konark Stone Temple", crown: "Terracotta Vedic Mukut", color: "#3B220C", accent: "#D4A373", gold: "#E9C46A" },
  { name: "Lambodara of Market Yard", style: "Golden Harvest & Grains", crown: "Paddy Corn Golden Crown", color: "#422800", accent: "#F9A03F", gold: "#FFDE59" },
  { name: "Heramba of South End", style: "Dravidian Gopuram Mandap", crown: "5-Tier Dravidian Mukut", color: "#0A3333", accent: "#2A9D8F", gold: "#F4D06F" },
  { name: "Bal Ganapathi of Anand Vihar", style: "Enchanted Krishna Forest", crown: "Peacock Feather Bal Mukut", color: "#1F3108", accent: "#80ED99", gold: "#FFDE59" },
  { name: "Shree Siddhadatha Railway", style: "Bharat Heritage Rail Theme", crown: "Navaratna Simhasan Mukut", color: "#182635", accent: "#457B9D", gold: "#F6BD60" },
  { name: "Gajanana of Hill View", style: "Starry Celestial Nebula", crown: "Chandra Graha Silver Crown", color: "#101438", accent: "#9B5DE5", gold: "#D0F4DE" },
  { name: "Vidya Ganapathi College Rd", style: "Saraswati Vedic Gurukul", crown: "Brahma Jnana Gold Mukut", color: "#3A210A", accent: "#BB9457", gold: "#FFE6A7" },
  { name: "Durgama Bappa Old Fort", style: "75 Year Historic Killa", crown: "Maratha Sardar Mukut", color: "#4F0808", accent: "#D62828", gold: "#F3C969" },
  { name: "Uchhishta Silk Weavers", style: "Pure Paithani Gold Zari", crown: "Silk Brocade Mukut", color: "#440D40", accent: "#E84393", gold: "#FFDA79" },
  { name: "Vakratunda Industrial", style: "Metallic Make In India", crown: "Polished Brass Crown", color: "#24303A", accent: "#E67E22", gold: "#F1C40F" },
  { name: "Bhakti Ganapathi Riverside", style: "Varanasi Maha Ganga Aarti", crown: "Brass Deepam Tiered Crown", color: "#3B1E08", accent: "#E76F51", gold: "#F5C77E" },
  { name: "Ekadanta Gandhi Maidan", style: "Olympic Youth Sports Darbar", crown: "Vijaya Stambha Gold Mukut", color: "#102C4E", accent: "#F58220", gold: "#FFC75F" },
  { name: "Mohana Ganapathi Sangeet", style: "Classical Raaga Veena Mandap", crown: "Sur Sangeet Tanpura Mukut", color: "#3D0C30", accent: "#C70039", gold: "#FFDE59" },
  { name: "Maha Raja Central Fort", style: "Supreme Royal Simhasan", crown: "24K Maharaja Imperial Mukut", color: "#540000", accent: "#FF5722", gold: "#FFD700" }
];

function generateGrandBappa(padNum, t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <!-- Background Velvet Gradient -->
    <radialGradient id="velvetBg${padNum}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${t.color}" stop-opacity="1"/>
      <stop offset="60%" stop-color="#1F0205" stop-opacity="1"/>
      <stop offset="100%" stop-color="#080002" stop-opacity="1"/>
    </radialGradient>

    <!-- 24K Gold Shimmer Gradients -->
    <linearGradient id="gold24k${padNum}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8DB"/>
      <stop offset="25%" stop-color="#FFD700"/>
      <stop offset="50%" stop-color="#FFA000"/>
      <stop offset="75%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8B6508"/>
    </linearGradient>

    <radialGradient id="divineHalo${padNum}" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="#FFF3C4" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="${t.gold}" stop-opacity="0.75"/>
      <stop offset="70%" stop-color="${t.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop Shadows & Glow Filters -->
    <filter id="royalGlow${padNum}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="drop3d${padNum}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="1000" fill="url(#velvetBg${padNum})"/>

  <!-- Ornate Royal Pillar Temple Arch (Prabhavali) -->
  <g filter="url(#drop3d${padNum})" stroke="url(#gold24k${padNum})">
    <!-- Left & Right Pillars -->
    <rect x="40" y="140" width="60" height="750" fill="#240306" stroke-width="4" rx="6"/>
    <rect x="700" y="140" width="60" height="750" fill="#240306" stroke-width="4" rx="6"/>
    <!-- Pillar carvings -->
    <line x1="70" y1="160" x2="70" y2="870" stroke-width="2" stroke-dasharray="8,6"/>
    <line x1="730" y1="160" x2="730" y2="870" stroke-width="2" stroke-dasharray="8,6"/>
    <!-- Grand Arch Roof (Kirtimukha Arch) -->
    <path d="M 40 220 C 180 30, 620 30, 760 220" fill="none" stroke-width="12"/>
    <path d="M 60 240 C 200 60, 600 60, 740 240" fill="none" stroke-width="4" stroke-dasharray="12,8"/>
    <!-- Arch Floral Medallions -->
    <circle cx="400" cy="70" r="30" fill="url(#gold24k${padNum})"/>
    <circle cx="400" cy="70" r="16" fill="#C21807"/>
  </g>

  <!-- Cascading Genda (Marigold) Garlands -->
  <g opacity="0.95">
    <path d="M 40 100 Q 200 240 400 120 Q 600 240 760 100" fill="none" stroke="#FF8F00" stroke-width="22" stroke-dasharray="16,8"/>
    <path d="M 40 120 Q 200 260 400 140 Q 600 260 760 120" fill="none" stroke="#C21807" stroke-width="14" stroke-dasharray="12,6"/>
    <path d="M 40 135 Q 200 275 400 155 Q 600 275 760 135" fill="none" stroke="#FFD700" stroke-width="8" stroke-dasharray="8,4"/>
  </g>

  <!-- Hanging Brass Bell Samai Diyas -->
  <g filter="url(#royalGlow${padNum})">
    <!-- Left Hanging Lamp -->
    <line x1="150" y1="0" x2="150" y2="180" stroke="url(#gold24k${padNum})" stroke-width="3"/>
    <ellipse cx="150" cy="190" rx="30" ry="10" fill="#8B0000" stroke="url(#gold24k${padNum})" stroke-width="2"/>
    <path d="M 150 185 Q 142 160 150 140 Q 158 160 150 185 Z" fill="#FFE57F"/>
    
    <!-- Right Hanging Lamp -->
    <line x1="650" y1="0" x2="650" y2="180" stroke="url(#gold24k${padNum})" stroke-width="3"/>
    <ellipse cx="650" cy="190" rx="30" ry="10" fill="#8B0000" stroke="url(#gold24k${padNum})" stroke-width="2"/>
    <path d="M 650 185 Q 642 160 650 140 Q 658 160 650 185 Z" fill="#FFE57F"/>
  </g>

  <!-- Divine Aura (Surya Tejas Mandala) -->
  <circle cx="400" cy="390" r="280" fill="url(#divineHalo${padNum})"/>
  
  <!-- Intricate Sunburst Rays -->
  <g stroke="url(#gold24k${padNum})" stroke-width="3" opacity="0.6" transform="translate(400, 390)">
    <circle r="220" fill="none" stroke-dasharray="6,4"/>
    <circle r="180" fill="none"/>
    ${[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(d => `<line x1="0" y1="-180" x2="0" y2="-220" transform="rotate(${d})" stroke-width="2.5"/>`).join('')}
  </g>

  <!-- Grand Golden Simhasan (Lion Throne Base) -->
  <g filter="url(#drop3d${padNum})">
    <polygon points="120,820 680,820 720,930 80,930" fill="url(#gold24k${padNum})" stroke="#4A0E17" stroke-width="3"/>
    <!-- Velvet Throne Cushion -->
    <rect x="140" y="780" width="520" height="50" rx="12" fill="#B30006" stroke="url(#gold24k${padNum})" stroke-width="3"/>
    <circle cx="200" cy="805" r="8" fill="url(#gold24k${padNum})"/>
    <circle cx="400" cy="805" r="8" fill="url(#gold24k${padNum})"/>
    <circle cx="600" cy="805" r="8" fill="url(#gold24k${padNum})"/>
  </g>

  <!-- Bappa Divine Body & Silk Pitambar -->
  <!-- Legs & Torso -->
  <ellipse cx="400" cy="620" rx="180" ry="140" fill="#E65100" filter="url(#drop3d${padNum})"/>
  <!-- Pure Gold & Silk Draped Dhoti / Pitambar -->
  <path d="M 250 640 Q 400 740 550 640 L 530 780 Q 400 810 270 780 Z" fill="#FFC107" stroke="url(#gold24k${padNum})" stroke-width="4"/>
  <path d="M 370 650 L 430 650 L 415 785 L 385 785 Z" fill="#D32F2F" stroke="url(#gold24k${padNum})" stroke-width="2"/>

  <!-- Ears with Heavy Kundan Ear Ornaments -->
  <path d="M 280 370 C 170 330 160 480 290 500 Z" fill="#E65100" stroke="url(#gold24k${padNum})" stroke-width="3"/>
  <path d="M 520 370 C 630 330 640 480 510 500 Z" fill="#E65100" stroke="url(#gold24k${padNum})" stroke-width="3"/>
  <!-- Inner ear shading -->
  <path d="M 275 390 C 200 360 190 460 285 480 Z" fill="#BF360C" opacity="0.6"/>
  <path d="M 525 390 C 600 360 610 460 515 480 Z" fill="#BF360C" opacity="0.6"/>
  <!-- Gold Kundan Earrings -->
  <circle cx="210" cy="460" r="14" fill="url(#gold24k${padNum})" stroke="#C21807" stroke-width="2"/>
  <circle cx="590" cy="460" r="14" fill="url(#gold24k${padNum})" stroke="#C21807" stroke-width="2"/>

  <!-- Divine Head & Majestic Trunk -->
  <ellipse cx="400" cy="400" rx="120" ry="115" fill="#E65100"/>
  <!-- Trunk Curve with Ornate Gold Border -->
  <path d="M 370 430 C 370 550 480 550 480 610 C 480 650 430 660 400 645 C 370 630 380 595 410 595" fill="none" stroke="#E65100" stroke-width="58" stroke-linecap="round"/>
  <path d="M 370 430 C 370 550 480 550 480 610 C 480 650 430 660 400 645 C 370 630 380 595 410 595" fill="none" stroke="url(#gold24k${padNum})" stroke-width="6" stroke-linecap="round"/>

  <!-- Sacred Tusks (Ekadanta) -->
  <path d="M 335 480 L 295 490 L 335 500 Z" fill="#FFFDF7" stroke="#D4AF37" stroke-width="1.5"/>
  <path d="M 465 480 L 485 485 L 465 492 Z" fill="#FFFDF7" stroke="#D4AF37" stroke-width="1.5"/>

  <!-- Sacred Sandalwood & Red Sindoor Tilak -->
  <g transform="translate(400, 360)">
    <path d="M -35 -20 Q 0 -30 35 -20" stroke="#FFEAA7" stroke-width="5" fill="none"/>
    <path d="M -30 -8 Q 0 -18 30 -8" stroke="#FFEAA7" stroke-width="5" fill="none"/>
    <path d="M -25 4 Q 0 -4 25 4" stroke="#FFEAA7" stroke-width="5" fill="none"/>
    <!-- Sindoor Crescent & Trishul Center -->
    <ellipse cx="0" cy="-6" rx="8" ry="18" fill="#C21807"/>
    <circle cx="0" cy="-6" r="3.5" fill="url(#gold24k${padNum})"/>
  </g>

  <!-- 24K Grand Imperial Mukut (Royal Crown) -->
  <g transform="translate(400, 245)" filter="url(#drop3d${padNum})">
    <polygon points="0,-120 85,25 -85,25" fill="url(#gold24k${padNum})" stroke="#4A0E17" stroke-width="3.5"/>
    <polygon points="0,-140 22,-110 -22,-110" fill="#FFF3D0"/>
    <!-- Rubies, Emeralds & Diamonds on Mukut -->
    <circle cx="0" cy="-40" r="18" fill="#C21807" stroke="#FFF" stroke-width="2"/>
    <circle cx="-40" cy="5" r="12" fill="#00695C" stroke="url(#gold24k${padNum})" stroke-width="2"/>
    <circle cx="40" cy="5" r="12" fill="#00695C" stroke="url(#gold24k${padNum})" stroke-width="2"/>
    <!-- Pearl string along bottom of crown -->
    ${[-60, -40, -20, 0, 20, 40, 60].map(x => `<circle cx="${x}" cy="22" r="5" fill="#FFFDF7" stroke="#D4AF37" stroke-width="1"/>`).join('')}
  </g>

  <!-- Modak in Left Hand Palm -->
  <g transform="translate(510, 610)" filter="url(#drop3d${padNum})">
    <circle cx="0" cy="0" r="32" fill="url(#gold24k${padNum})" stroke="#8B0000" stroke-width="2"/>
    <!-- 21-Pleat Modak -->
    <path d="M 0 -28 Q -20 8 0 22 Q 20 8 0 -28 Z" fill="#FFE082" stroke="#FF8F00" stroke-width="2"/>
    <circle cx="0" cy="-12" r="4" fill="#D32F2F"/>
  </g>

  <!-- Abhaya Mudra (Blessing Hand) -->
  <g transform="translate(290, 570)" filter="url(#drop3d${padNum})">
    <ellipse cx="0" cy="0" rx="26" ry="34" fill="#E65100" stroke="url(#gold24k${padNum})" stroke-width="3"/>
    <circle cx="0" cy="0" r="12" fill="#C21807"/>
    <path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke="#FFF" stroke-width="2.5"/>
  </g>

  <!-- Bottom Gold Inscription Plaque -->
  <g transform="translate(400, 935)">
    <rect x="-240" y="-32" width="480" height="54" rx="27" fill="#140204" stroke="url(#gold24k${padNum})" stroke-width="2.5"/>
    <text x="0" y="4" fill="url(#gold24k${padNum})" font-family="serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="1">PANDHAL #${padNum} • ${t.name.toUpperCase()}</text>
  </g>
</svg>`;
}

function generateGrandGallery(padNum, title, subtitle, t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="galBg${padNum}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${t.color}"/>
      <stop offset="70%" stop-color="#180204"/>
      <stop offset="100%" stop-color="#050001"/>
    </radialGradient>
    <linearGradient id="galGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8DB"/>
      <stop offset="50%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#galBg${padNum})"/>
  <rect x="25" y="25" width="750" height="550" rx="18" fill="none" stroke="url(#galGold)" stroke-width="3.5"/>
  <rect x="35" y="35" width="730" height="530" rx="12" fill="none" stroke="${t.gold}" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6"/>
  
  <!-- Ornate Centerpiece Frame -->
  <circle cx="400" cy="270" r="140" fill="rgba(255, 215, 0, 0.08)" stroke="url(#galGold)" stroke-width="4"/>
  <circle cx="400" cy="270" r="115" fill="none" stroke="#FF8F00" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="400" y="250" fill="#FFF" font-family="serif" font-size="34" font-weight="bold" text-anchor="middle">🪔 ${title} 🪔</text>
  <text x="400" y="295" fill="url(#galGold)" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${subtitle}</text>
  
  <rect x="80" y="470" width="640" height="50" rx="10" fill="rgba(10,2,3,0.85)" stroke="url(#galGold)" stroke-width="1.5"/>
  <text x="400" y="502" fill="url(#galGold)" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">PANDHAL #${padNum} • ${t.name.toUpperCase()}</text>
</svg>`;
}

console.log('Generating Grand Royal Visual Artworks for 21 Pandhals...');

for (let i = 1; i <= 21; i++) {
  const padNum = String(i).padStart(2, '0');
  const folder = path.join(pandhalsDir, `pandhal-${padNum}`);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const theme = themes[i - 1] || themes[0];
  fs.writeFileSync(path.join(folder, 'cover.webp'), generateGrandBappa(padNum, theme));
  fs.writeFileSync(path.join(folder, 'decoration-01.webp'), generateGrandGallery(padNum, 'Royal Lighting & Chandeliers', 'Peshwa Shahi Darbar Illumina', theme));
  fs.writeFileSync(path.join(folder, 'decoration-02.webp'), generateGrandGallery(padNum, 'Floral Garlands & Diyas', '50,000 Genda & Lotus Toran', theme));
  fs.writeFileSync(path.join(folder, 'cleanliness.webp'), generateGrandGallery(padNum, '100% Eco Cleanliness Seva', 'Zero Waste & Green Prasad Initiative', theme));
  fs.writeFileSync(path.join(folder, 'gallery-01.webp'), generateGrandGallery(padNum, 'Mandap Architecture', 'Grand Entrance & Heritage Facade', theme));
}

console.log('Successfully generated all 21 grand royal festival assets!');
