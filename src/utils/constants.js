export const LAUNCH_CONFIG = {
  // 14 September 2026, 5:00:00 PM IST (Asia/Kolkata)
  LAUNCH_TIME_ISO: "2026-09-14T17:00:00+05:30",
  LAUNCH_TIMESTAMP: 1789385400000, // Date.parse("2026-09-14T17:00:00+05:30")
  TIMEZONE: "Asia/Kolkata"
};

export const APP_CONFIG = {
  TITLE: "Gajotsav 2026",
  SUBTITLE: "Ganesh Utsav 2026",
  TOTAL_PANDHALS: 21,
  STORAGE_KEYS: {
    MY_VOTE: 'gt_my_vote',
    CAST_VOTES: 'gt_cast_votes_db',
    PANDHAL_VOTES: 'gt_pandhals_votes',
    SOUND_MUTED: 'gt_sound_muted'
  }
};

export const CATEGORIES = [
  { id: 'all', label: 'All 21 Pandhals' },
  { id: 'top', label: 'Top Voted' },
  { id: 'eco', label: 'Eco & Clay' },
  { id: 'heritage', label: 'Heritage Mandals' },
  { id: 'darbar', label: 'Royal Darbars' }
];

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'bappa', label: 'Main Idol' },
  { id: 'decoration', label: 'Decoration' },
  { id: 'pandhal', label: 'Architecture' },
  { id: 'cleanliness', label: 'Eco & Clean' }
];
