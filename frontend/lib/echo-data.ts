export type NavKey = "home" | "search" | "library" | "rooms";

export type ArtworkItem = {
  id?: string;
  artist?: string;
  title: string;
  subtitle: string;
  image: string;
};

export const shellNowPlaying = {
  title: "Midnight City",
  subtitle: "M83 • Hurry Up, We're Dreaming",
  image: "http://localhost:3845/assets/208fe4a189e5ed443a420d6e2585fad1b75a4896.png",
  progress: 0.34,
  elapsed: "1:24",
  total: "4:03",
};

export const recentItems: ArtworkItem[] = [
  {
    title: "Night Drive Essentials",
    subtitle: "Echo Curated Mix",
    image: "http://localhost:3845/assets/a309f34fbaf1665991f54dce8e75516a475afa94.png",
  },
  {
    title: "Ambient Echoes",
    subtitle: "Vaporwave Selection",
    image: "http://localhost:3845/assets/c4918a71355b7df45f7138a8818ec81879579a91.png",
  },
  {
    title: "Electronic Pulse",
    subtitle: "Focus Hour",
    image: "http://localhost:3845/assets/0c8f4daf2cb6ae8390f2338b1abb2f5adef5ec4d.png",
  },
  {
    title: "Jazz After Hours",
    subtitle: "Late Lounge",
    image: "http://localhost:3845/assets/ec76c3291b995ccc89742aaceac0ef9a80440a56.png",
  },
  {
    title: "Top Hits 2024",
    subtitle: "Global Charts",
    image: "http://localhost:3845/assets/d03290addf1ae5c31346748e57e0e4678f8fd992.png",
  },
  {
    title: "Daily Podcast",
    subtitle: "News Capsule",
    image: "http://localhost:3845/assets/28e37f2cd6ab2003fe8e20be92cac3ffa0a6e38d.png",
  },
];

export const topMixFeature = {
  badge: "EDITORIAL MIX",
  title: "Midnight Geometry",
  description: "A cinematic blend of tension-building techno and atmospheric breaks.",
  image: "http://localhost:3845/assets/a11335be22cfae073827e62b392490f2edce5da4.png",
};

export const topMixSecondary = [
  {
    title: "Lo-Fi Study",
    subtitle: "Calm Frequency",
    image: "http://localhost:3845/assets/748eab2e1edbe147eea6e9cab9f010002ee8e3bf.png",
  },
  {
    title: "After Dark",
    subtitle: "Noir R&B",
    image: "http://localhost:3845/assets/7980869b4424f1469e01b1d6bd08cb90ae6471a1.png",
  },
];

export const newReleases: ArtworkItem[] = [
  {
    title: "Eclipse",
    subtitle: "Velvet",
    image: "http://localhost:3845/assets/66aeb88a378fb51f623de49cb5024dcdce34968f.png",
  },
  {
    title: "Neon Rain",
    subtitle: "The Outliers",
    image: "http://localhost:3845/assets/95784066cc45e47e13e55ea8716558474f73099f.png",
  },
  {
    title: "Splatter",
    subtitle: "Canvas Rebels",
    image: "http://localhost:3845/assets/34176e36a52c7e0f44f414aaba18eaed7974f1f1.png",
  },
  {
    title: "Wildflower",
    subtitle: "Ethereal Bloom",
    image: "http://localhost:3845/assets/ffff7cd2b330e7938f598f78a0090c9718a23926.png",
  },
  {
    title: "Structural Theory",
    subtitle: "Architech",
    image: "http://localhost:3845/assets/1177a6a3e8769705a4c89aa7573115d491d18ef8.png",
  },
  {
    title: "Moon Tide",
    subtitle: "Lunar Phase",
    image: "http://localhost:3845/assets/c13d97c22c1464dfbe72db4bf26fbff1f624468e.png",
  },
];

export const libraryTabs = ["Playlists", "Artists", "Albums", "Uploads"];

export const libraryCards: ArtworkItem[] = [
  {
    title: "Neon Drift",
    subtitle: "Vaporwave Selection",
    image: "http://localhost:3845/assets/b372a63ca1078c2401d6a67f131cd0ebe558f5d0.png",
  },
  {
    title: "Midnight Sessions",
    subtitle: "Lounge & Jazz",
    image: "http://localhost:3845/assets/1cf53d7c6dcfb120b1c1d8b43214ae499a4db8c2.png",
  },
  {
    title: "Euphoria",
    subtitle: "Dream Pop",
    image: "http://localhost:3845/assets/bfed56d4e3db99d2d1a1619d9fc87ebf4b2d6b09.png",
  },
  {
    title: "Live at Echo Park",
    subtitle: "Live Recording",
    image: "http://localhost:3845/assets/051ab75a6c747d9d53fe34f8aa115c62ce328e88.png",
  },
  {
    title: "Botanical Beats",
    subtitle: "Organic Techno",
    image: "http://localhost:3845/assets/b467fb61320b219f60090ef47a00350cc968820f.png",
  },
  {
    title: "The Classics",
    subtitle: "Curated Vinyl",
    image: "http://localhost:3845/assets/999b1406de4bae3379385593d0e678b29a2b7583.png",
  },
  {
    title: "Solar Plexus",
    subtitle: "Deep Ambient",
    image: "http://localhost:3845/assets/a73598e0d7ee117f7c4657e57e9481a83a500539.png",
  },
];

export const searchGenres = [
  { name: "Chill", gradient: "linear-gradient(135deg, #1e3264 0%, #40568c 100%)", image: "http://localhost:3845/assets/c6a2b016d2216056e71ff648b34c7924981d37fe.png" },
  { name: "Pop", gradient: "linear-gradient(135deg, #8c1932 0%, #e8115b 100%)", image: "http://localhost:3845/assets/8869d8f18440fb18c0398f7dcf7e35fbd4e1624e.png" },
  { name: "Focus", gradient: "linear-gradient(135deg, #477d95 0%, #7358ff 100%)", image: "http://localhost:3845/assets/21b008b2afd78c6cf4e0c5c0ab8d0b1a154e0f4b.png" },
  { name: "Rock", gradient: "linear-gradient(135deg, #e8115b 0%, #bc5900 100%)", image: "http://localhost:3845/assets/1d78d712bc6b878d64b98f6269c9afaa43bbe8f7.png" },
  { name: "Hip-Hop", gradient: "linear-gradient(135deg, #503750 0%, #ba5d07 100%)", image: "http://localhost:3845/assets/51fe51cf80577453ac26b74cfc50474fd1639448.png" },
  { name: "Electronic", gradient: "linear-gradient(135deg, #006450 0%, #27856a 100%)", image: "http://localhost:3845/assets/3dccdd741b525e28a467b8aca0da96497be43ea5.png" },
  { name: "R&B", gradient: "linear-gradient(135deg, #5a3267 0%, #a74295 100%)", image: "http://localhost:3845/assets/c0598b690e17fc50274248c83d635fa3fc6a4066.png" },
  { name: "Jazz", gradient: "linear-gradient(135deg, #684e2b 0%, #bc8a34 100%)", image: "http://localhost:3845/assets/c929ef64ff172869aebdaa2452be8bc4c8db3fc0.png" },
  { name: "Classical", gradient: "linear-gradient(135deg, #414f7f 0%, #6f78be 100%)", image: "http://localhost:3845/assets/090137b6b7055a59bf1f2b75d2f2738ce574f359.png" },
  { name: "Podcast", gradient: "linear-gradient(135deg, #60362f 0%, #b7564b 100%)", image: "http://localhost:3845/assets/f093d79551dde0c5f11c48cd9181f1d7642d4df5.png" },
];

export const roomListeners = [
  {
    name: "Alex (Host)",
    image: "http://localhost:3845/assets/60875e90e16f30aab9764e57b2767345ab914b06.png",
    host: true,
  },
  {
    name: "Sarah",
    image: "http://localhost:3845/assets/fb08ea8899164fed97b5291a539a95a929119ab2.png",
    host: false,
  },
  {
    name: "Marcus",
    image: "http://localhost:3845/assets/76b4cf851ef21fa3338e32aa6b2b7a9cae59c5e8.png",
    host: false,
  },
];

export const artistTracks = [
  { index: 1, title: "Ethereal Nights", plays: "45,120,392", duration: "3:42", album: "Midnight City", image: "http://localhost:3845/assets/51a215b2e5003c0fac67d050633c8dd8408b6ebd.png" },
  { index: 2, title: "Obsidian Waves", plays: "32,881,105", duration: "4:15", album: "Deep Blue", image: "http://localhost:3845/assets/42eb286553c67127a49e1a8132038ac5e583f48e.png" },
  { index: 3, title: "Ghost Echoes", plays: "28,500,211", duration: "3:58", album: "Afterglow", image: "http://localhost:3845/assets/abdec0be7e3111eddd2f9e66f8eb921bd9b29bc2.png" },
  { index: 4, title: "Neon Pulse", plays: "21,133,944", duration: "3:11", album: "Electric Dream", image: "http://localhost:3845/assets/3d6cf087ca9681a3a2359fdc4e1e9e5e83192d30.png" },
];

export const artistDiscography: ArtworkItem[] = [
  { title: "Midnight Echoes", subtitle: "2024", image: "http://localhost:3845/assets/1272c6bcf2f2071d1fb544e362c949d8322caed5.png" },
  { title: "Afterglow", subtitle: "2022", image: "http://localhost:3845/assets/3b6cd5b33396ebf9edbccdd427132ff7afc27caf.png" },
  { title: "Obsidian Skies", subtitle: "2021", image: "http://localhost:3845/assets/ea95356035226273766e9001288fe31c67ae5e5b.png" },
  { title: "Luminous", subtitle: "2019", image: "http://localhost:3845/assets/69247dd4dd19bce269823dc0bf790f58fe37188b.png" },
  { title: "Velvet Sessions", subtitle: "2017", image: "http://localhost:3845/assets/5a1c79970116fc76a660a398d83c9d2bd94ba888.png" },
];
