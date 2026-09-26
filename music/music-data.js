/**
 * Pretvfx-Music — Data Source
 * Edit file ini saja saat menambah/menghapus lagu.
 *
 * PENTING untuk link audio:
 * - Pakai URL langsung ke file .mp3 (bisa diputar di browser)
 * - Disarankan: raw.githubusercontent.com / CDN sendiri / Supabase storage
 * - Jangan pakai halaman HTML GitHub (bukan file audio)
 */

export const songs = [
  {
    id: 1,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Bintang%205.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    video: "",
    title: "Bintang 5",
    artist: "Tenxi & Jemsii",
    views: 21300000
  },
  {
    id: 2,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/(Sakit%20Dadaku).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Sakit%20dadaku.jpg",
    title: "Garam & Madu (Sakit Dadaku)",
    artist: "Tenxi",
    views: 250600000
  },
  {
    id: 3,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/bergema%20sampai%20selamanya.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/nadhif.jpg",
    title: "Bergema Sampai Selamanya",
    artist: "Nadhif Basalamah",
    tags: ["sad"],
    views: 90100000
  },
  {
    id: 4,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Surat%20starla.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Virgoun.png",
    title: "Surat Cinta Untuk Starla",
    artist: "Virgoun",
    tags: ["sad"],
    views: 658900000
  },
  {
    id: 5,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/SO%20ASU.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/SO%20ASU.png",
    title: "SO ASU",
    artist: "Naykilla",
    views: 5820000
  },
  {
    id: 6,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/mejikuhibiniu.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/mejikuhibiniu.jpg",
    title: "Mejikuhibiniu",
    artist: "Tenxi, Suisei & Jemsii",
    views: 68400000
  },
  {
    id: 7,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/penjaga%20hati.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/penjaga%20hti.jpg",
    title: "Penjaga Hati",
    artist: "Nadhif Basalamah",
    tags: ["sad"],
    views: 286500000
  },
  {
    id: 8,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Aku%20Dah%20Lupa.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Aku%20Dah%20Lupa.jpg",
    title: "Aku Dah Lupa",
    artist: "MikkyZia",
    views: 90300000
  },
  {
    id: 9,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Mangu.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/mangu.jpg",
    title: "Mangu",
    artist: "Fourtwnty",
    tags: ["sad"],
    views: 305700000
  },
  {
    id: 10,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Kasih%20Aba%20Aba.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/kasih%20aba%20aba.jpg",
    title: "Kasih Aba Aba",
    artist: "Naykilla, Tenxi & Jemsii",
    views: 77200000
  },
  {
    id: 11,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Berubah.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Berubah.jpg",
    title: "Berubah",
    artist: "Tenxi & Jemsii",
    views: 10600000
  },
  {
    id: 12,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Oh%20no,%20I%20like%20you.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Oh%20no%2CI%20like%20you.jpg",
    title: "Oh no, I like you",
    artist: "Auric Veil",
    views: 6440000
  },
  {
    id: 13,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/die%20with%20a%20smile.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/die%20with%20a%20smile.jpg",
    title: "Die With A Smile",
    artist: "Lady Gaga",
    views: 2800000000
  },
  {
    id: 14,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Kangen.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Kangen.jpg",
    title: "Kangen",
    artist: "DEWA 19",
    tags: ["sad"],
    views: 211600000
  },
  {
    id: 15,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/That%20Smile%20is%20a%20Trap.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/That%20smile%20is%20a%20trap.jpg",
    title: "That Smile Is A Trap",
    artist: "Auric Veil",
    views: 1800000
  },
  {
    id: 16,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Bintang%20di%20Surga.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/NoahBintangdiSurga.jpg",
    title: "Bintang Di Surga",
    artist: "NOAH",
    tags: ["sad"],
    views: 143700000
  },
  {
    id: 17,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Anugerah%20Terindah.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Anigrah%20Terindah.jpg",
    title: "Anugrah Terindah",
    artist: "Andmesh",
    tags: ["sad"],
    views: 257800000
  },
  {
    id: 18,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Aku%20Milikmu.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0730.jpeg",
    title: "Aku Milikmu",
    artist: "DEWA 19",
    views: 11410000
  },
  {
    id: 19,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Pupus.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0731.jpeg",
    title: "Pupus",
    artist: "DEWA 19",
    views: 181600000
  },
  {
    id: 20,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Separuh%20Nafas.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0732.jpeg",
    title: "Separuh Nafasku",
    artist: "DEWA 19",
    views: 70600000
  },
  {
    id: 21,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Somewhere%20Only%20We%20Know.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/somewhere1.jpg",
    title: "Somewhere Only We Know",
    artist: "Gustixa",
    views: 106700000
  },
  {
    id: 22,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/hoRRReg.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "hoRRReg",
    artist: "Tenxi, Naufal Syachreza & Jemsii",
    views: 10400000
  },
  {
    id: 23,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/SENCY.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0733.webp",
    title: "SENCY",
    artist: "dia & Tenxi",
    views: 226000
  },
  {
    id: 24,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Puting%20Beliung.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Puting Beliung (feat. dia)",
    artist: "Tenxi, Josua Natanael & Jemsii",
    tags: ["senang"],
    views: 1900000
  },
  {
    id: 25,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/1%2010.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0734.jpeg",
    title: "1/10 (feat. RYO)",
    artist: "Tenxi & RYO",
    views: 1400000
  },
  {
    id: 26,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/attached.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/IMG_0735.jpeg",
    title: "attached",
    artist: "Tenxi, Anangga & Suisei",
    views: 1630000
  },
  {
    id: 27,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Paling%20Sabi.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Paling sabi",
    artist: "Tenxi, RYO, dia & Jemsii",
    views: 989300
  },
  {
    id: 28,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Coba%20Lagi.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/ubah%20lagi.jpg",
    title: "Coba Lagi",
    artist: "Tenxi & Jemsii",
    views: 3560000
  },
  {
    id: 29,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Yodah%20ku%20Selingkuh.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Yodah ku Selingkuh",
    artist: "Tenxi, Lucidrari & Jemsii",
    views: 720000
  },
  {
    id: 30,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Bayangno%20Awakmu.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Bayangno Awakmu",
    artist: "Tenxi & Jemsii",
    views: 739700
  },
  {
    id: 31,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Apa%20Lagi.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Apa Lagi",
    artist: "Tenxi, Anangga & Jemsii",
    views: 458500
  },
  {
    id: 32,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Dikasih%20Akses.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Dikasih Akses",
    artist: "Tenxi & Jemsii",
    views: 255100
  },
  {
    id: 33,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Buku%20Baru%20(Interlude).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Bintang5.jpg",
    title: "Buku Baru (Interlude)",
    artist: "Tenxi & Jemsii",
    views: 220500
  },
  {
    id: 34,
    audio: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/%E5%85%AB%E6%96%B9%E4%BE%86%E8%B2%A1%20(Stacks%20from%20All%20Sides).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/%E5%85%AB%E6%96%B9%E4%BE%86%E8%B2%A1(Stacks%20from%20All%20Sides).jpg",
    title: "八方來財(Stacks from All Sides)",
    artist: "攬佬SKAI ISYOURGOD",
    tags: ["senang"],
    views: 136500000
  },
  {
    id: 35,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Somewhere%20Only%20We%20Know%20(1).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/somewhere2.jpg",
    title: "Somewhere Only We Know",
    artist: "Keane",
    views: 1600000000
  },
  {
    id: 36,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Tor%20Monitor%20Ketua.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/artworks-tY0vRpEXFSNj-0-t500x500.png",
    title: "Tor Monitor Ketua",
    artist: "DJ SIBUK",
    views: 712000
  },
  {
    id: 37,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/MALA.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Mala%20(6ix9ine).jpg",
    title: "MALA (feat. Anuel Aa)",
    artist: "6ix9ine",
    tags: ["senang"],
    views: 393400000
  },
  {
    id: 38,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Amin%20Paling%20Serius.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/amin%20paling%20serius.jpg",
    title: "Amin Paling Serius",
    artist: "Sal Priadi & Nadin Amizah",
    tags: ["sad"],
    views: 58500000
  },
  {
    id: 39,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Starboy.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/starboy.jpg",
    title: "Starboy (feat, Duft Punk)",
    artist: "The Weeknd",
    views: 3800000000
  },
  {
    id: 40,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/One%20Of%20The%20Girls.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/One%20Of%20The%20Girls.jpg",
    title: "One Of The Girls",
    artist: "The Weeknd, JENNIE & Lily Rose Depp",
    views: 1200000000
  },
  {
    id: 41,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Timeless.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Timeless.jpg",
    title: "Timeless",
    artist: "The Weeknd & Playboi Carti",
    tags: ["senang"],
    views: 414500000
  },
  {
    id: 42,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Blinding%20Lights.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/The_Weeknd_-_Blinding_Lights.png",
    title: "Blinding Light",
    artist: "The Weeknd",
    views: 3400000000
  },
  {
    id: 43,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Save%20Your%20Tears.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Save%20your%20Tears.jpg",
    title: "Save Your Tears",
    artist: "The Weeknd",
    views: 3000000000
  },
  {
    id: 44,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Die%20For%20You%20(Remix).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/die%20for%20you.jpg",
    title: "Die For You (Remix)",
    artist: "The Weeknd & Ariana Grande",
    views: 777300000
  },
  {
    id: 45,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Girl%20You%20Loud.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Girl%20you%20Loud.jpg",
    title: "Girl You Loud",
    artist: "Chris Brown & Tyga",
    tags: ["senang"],
    views: 35200000
  },
  {
    id: 46,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/%D0%AF%D0%B4.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/erika%20lundmoen.jpg",
    title: "Яд",
    artist: "Erika Lundmoen",
    tags: ["senang"],
    views: 170600000
  },
  {
    id: 47,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Swimming%20Pools%20(Drank).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/SwimmingPools.jpg",
    title: "Swimming Pools (Drank)",
    artist: "Kendrick Lamar",
    tags: ["senang"],
    views: 714700000
  },
  {
    id: 48,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/HUMBLE..mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/HUMBLE.jpg",
    title: "HUMBLE",
    artist: "Kendrick Lamar",
    tags: ["senang"],
    views: 1500000000
  },
  {
    id: 49,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/FE!N.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Fein.jpg",
    title: "FE!N (feat, Playboi Carti)",
    artist: "Travis Scott",
    tags: ["senang"],
    views: 602800000
  },
  {
    id: 50,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Love%20Me.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Lil%20Wayne.jpg",
    title: "Love Me (feat, Drake Future)",
    artist: "Lil Wayne",
    tags: ["senang"],
    views: 1000000000
  },
  {
    id: 51,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/PELIGROSA.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/peligrosa.jpg",
    title: "PELIGROSA",
    artist: "FloyyMenor",
    tags: ["senang"],
    views: 311400000
  },
  {
    id: 52,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Old%20Town%20Road%20(Remix).mp3",
    audio_320: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Old%20Town%20Road.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/old%20town%20roand.jpg",
    title: "Old Town Road (Remix) - (feat, Billy Ray Cyrus)",
    artist: "Lil Nas X",
    tags: ["senang"],
    views: 3850000000
  },
  {
    id: 53,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Gata%20Only.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Gata%20Only.jpg",
    title: "Gata Only",
    artist: "FloyyMenor & Cris Mj",
    tags: ["senang"],
    views: 1400000000
  },
  {
    id: 54,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/BAND4BAND.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/BAND4BAND.jpg",
    title: "BAND4BAND",
    artist: "Central Lee & Lil Baby",
    tags: ["senang"],
    views: 384700000
  },
  {
    id: 55,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/redrum.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/redrum.jpg",
    title: "redrum",
    artist: "21 Savage",
    tags: ["senang"],
    views: 336200000
  },
  {
    id: 56,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Popular%20(From%20The%20Idol%20Vol.%201%20(Music%20from%20the%20HBO%20Original%20Series)).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/popular.jpg",
    title: "Popular (From The Idol Vol. 1 (Music from the HBO Original Series)) (feat, Playboi Carti)",
    artist: "The Weeknd",
    tags: ["senang"],
    views: 384300000
  },
  {
    id: 57,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Mask%20Off.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/mask%20off.jpg",
    title: "Mask Off",
    artist: "Future",
    tags: ["senang"],
    views: 1400000000
  },
  {
    id: 58,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Dangerous%20Woman.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/women.png",
    title: "Dangerous Woman",
    artist: "Ariana Grande",
    tags: ["senang"],
    views: 1200000000
  },
  {
    id: 59,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Hotel%20Room.mp3",
    image: "https://raw.githubusercontent.com/pretyfx69/music-files/refs/heads/main/hotel%20room.jpg",
    title: "Hotel Room",
    artist: "FLVCKKA, Sleezy O & Maury",
    tags: ["senang"],
    views: 427800000
  },
  {
    id: 60,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/NOW%20OR%20NEVER.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/NOW%20OR%20NEVER.jpg",
    title: "NOW OR NEVER",
    artist: "TKandz & CXSPER",
    tags: ["senang"],
    views: 11500000
  },
  {
    id: 61,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/No%20Pole.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/no%20pole.jpg",
    title: "No Pole",
    artist: "Don Toliver",
    tags: ["senang"],
    views: 142500000
  },
  {
    id: 62,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Again.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/again.jpg",
    title: "Again (feat, XXXTENTACION)",
    artist: "Noah Cyrus & XXXTENTACION",
    tags: ["senang"],
    views: 306200000
  },
  {
    id: 63,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Gata%20Only%20(Remix).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/gata%20only%20remix.jpg",
    title: "Gata Only (Remix)",
    artist: "FloyyMenor, Ozuna & Anitta",
    tags: ["senang"],
    views: 87100000
  },
  {
    id: 64,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/You%20Don't%20Own%20Me.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/you%20dont.jpg",
    title: "You Don't Own Me",
    artist: "SAYGRACE & G-Eazy",
    tags: ["senang"],
    views: 717600000
  },
  {
    id: 65,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Mind%20Games.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/mind%20games.jpg",
    title: "Mind Games",
    artist: "Sickick",
    tags: ["senang"],
    views: 249200000
  },
  {
    id: 66,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Renegade.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/renearge.jpg",
    title: "Renegade",
    artist: "Aaryan Shah",
    tags: ["senang"],
    views: 111300000
  },
  {
    id: 67,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Low%20Life.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/low%20life.jpg",
    title: "Low Life (feat, The Weeknd)",
    artist: "Future & The Weeknd",
    tags: ["senang"],
    views: 1200000000
  },
  {
    id: 68,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Embrace%20It.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/embrace%20it.jpg",
    title: "Embrace It",
    artist: "Ndotz",
    tags: ["senang"],
    views: 95100000
  },
  {
    id: 69,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Descer.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/descer.jpg",
    title: "Descer",
    artist: "Kew & Dj LK da Esćoria",
    tags: ["senang"],
    views: 61800000
  },
  {
    id: 70,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Havana.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/havana.jpg",
    title: "Havana (feat, Young Thug)",
    artist: "Camila Cabello & Young Thug",
    tags: ["senang"],
    views: 4000000000
  },
  {
    id: 71,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Dat%20tick.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/dat%20stick.jpg",
    title: "Dat $tick",
    artist: "Rich Brian",
    tags: ["senang"],
    views: 249200000
  },
  {
    id: 72,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Still%20With%20You.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/still%20witth%20you.jpg",
    title: "Still With You",
    artist: "Jung Kook",
    tags: ["senang"],
    views: 144800000
  },
  {
    id: 73,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/nuts.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/nuts.png",
    title: "nuts",
    artist: "Lil Peep & rainy bear",
    tags: ["senang"],
    views: 108300000
  },
  {
    id: 74,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Swim.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/swim.jpg",
    title: "Swim",
    artist: "Chase Atlantic",
    tags: ["senang"],
    views: 540700000
  },
  {
    id: 75,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Reminder.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/reminder.png",
    title: "Reminder",
    artist: "The Weeknd",
    tags: ["senang"],
    views: 907900000
  },
  {
    id: 76,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Rock%20That%20Body.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/rock%20that.jpg",
    title: "Rock That Body",
    artist: "Black Eyed Peas",
    tags: ["senang"],
    views: 424600000
  },
  {
    id: 77,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Too%20Many%20Nights.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/too%20many.png",
    title: "Too Many Nights (feat, Don Toliver & With Future)",
    artist: "Metro Boomin, Future & Don Toliver",
    tags: ["senang"],
    views: 400600000
  },
  {
    id: 78,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/S%C3%A3o%20Paulo.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/Timeless.jpg",
    title: "São Paulo (feat, Anitta)",
    artist: "The Weeknd & Anitta",
    tags: ["senang"],
    views: 181900000
  },
  {
    id: 79,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/She%20Will.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/she%20will.jpg",
    title: "She Will",
    artist: "Lil Wayne & Drake",
    tags: ["senang"],
    views: 189600000
  },
  {
    id: 80,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Call%20Out%20My%20Name.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/call%20out.png",
    title: "Call Out My Name",
    artist: "The Weeknd",
    tags: ["senang"],
    views: 1600000000
  },
  {
    id: 81,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/The%20Hills.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/the%20hills.jpg",
    title: "The Hills",
    artist: "The Weeknd",
    tags: ["senang"],
    views: 2700000000
  },
  {
    id: 82,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Around%20Me.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/too%20many.png",
    title: "Around Me (feat, Don Toliver)",
    artist: "Metro Boomin & Don Toliver",
    tags: ["senang"],
    views: 76900000
  },
  {
    id: 83,
    audio: "https://github.com/PretyFX69/Music-CyberZain/raw/refs/heads/main/kota%20ini%20tak%20sama%20tanpamu.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/nadhif.jpg",
    title: "Kota Ini Tak Sama Tanpamu",
    artist: "Nadhif Basalamah",
    tags: ["sad"],
    views: 48700000
  },
  {
    id: 84,
    audio: "https://github.com/PretyFX69/Music-CyberZain/raw/refs/heads/main/masih_ada_waktunya_320k.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/nadhif.jpg",
    title: "Masih Ada Waktunya",
    artist: "Nadhif Basalamah",
    tags: ["sad"],
    views: 1300000
  },
  {
    id: 85,
    audio: "https://github.com/PretyFX69/Music-CyberZain/raw/refs/heads/main/masih_ada_waktunya_320k.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/nadhif.jpg",
    title: "Bergema Sampai Selamanya (Stripped Version)",
    artist: "Nadhif Basalamah",
    tags: ["sad"],
    views: 4700000
  },
  {
    id: 86,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/DJ%20Mojang%20Priangan%20(%20Slowed%20&%20Reverb%20)%20%F0%9F%8E%A7.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/IMG-20260216-WA0006.jpg",
    title: "DJ Mojang Priangan ( Slowed & Reverb ) 🎧",
    artist: "Nuranawa",
    tags: ["aksi", "Bewan ff"],
    views: 10100000
  },
  {
    id: 87,
    audio: "https://www.dropbox.com/scl/fi/cgmk04yf01ou5k223cqg4/DJ_SOUND_JJ_SEREM_ELITE_CEES_COCOK_BUAT_MODE_BANTAI_FULL_BASS_GACOR_VIRAL_TERBARU_2025-_VOL.01_320k.mp3?rlkey=kxqi94mpu2029hag3k0jgdl1x&st=s7dbdpx3&raw=1",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/hqdefault%20(1).jpg",
    title: "DJ SOUND JJ SEREM ELITE CEES COCOK BUAT MODE BANTAI FULL BASS GACOR VIRAL TERBARU 2025🎧 VOL.01",
    artist: "MAZ XREP",
    tags: ["aksi", "Bewan ff"],
    views: 220600
  },
  {
    id: 88,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/On_My_Way_320k.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/artworks-aMP8KD1wt4g7h6e9-dYjb4w-t500x500.jpg",
    title: "On My Way",
    artist: "Sabrina Carpenter, Farruko & Alan Walker",
    tags: ["aksi", "Bewan ff"],
    views: 1600000000
  },
  {
    id: 89,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/come%20to%20brazil%20(1).mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/Screenshot_20260224-094158.jpg",
    title: "Come to brazil",
    artist: "bbno$",
    tags: ["senang"],
    views: 3370000
  },
  {
    id: 90,
    audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/MALU%20MALU.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/WA_1773470020145.jpeg",
    title: "MALU MALU",
    artist: "dia & INDAHKUS",
    tags: ["senang"],
    views: 5720000
  },
  {
    id: 91,
    video: "https://www.dropbox.com/scl/fi/unzalsbc116090xxcb6ae/DJ-SUGES-AKU-SUGES-KEPALAKU-DINGIN-KERINGETAN-__-AKU-SUGES-VERSI-BARU-2026.mp4?rlkey=jgp2gx1e7bqhqfyiwxfpjldui&st=3qwc6ywh&dl=1",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/mqdefault%20(2).jpg",
    title: "DJ AKU SUGES SUGES KEPALAKU DINGIN KERINGATAN TREND JEDAG JEDUG VIRAL FYP!",
    artist: "KYLA FVNKY",
    tags: ["dj sugest"],
    views: 105800
  },
  {
    id: 92,
    video: "https://www.dropbox.com/scl/fi/9xu6saanc0zeb57he2c28/DJ-VOICES-IN-MY-HEAD-REVERB-BREAKBEAT-REMIX-BY-NOKA-AXL.mp4?rlkey=d7f77d11z14mdxrso12ht02bv&st=1779syjj&dl=1",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/mqdefault%20(1).jpg",
    title: "DJ VOICES IN MY HEAD REVERB BREAKBEAT REMIX BY NOKA AXL",
    artist: "Tunes ID RMX",
    tags: ["dj fish it"],
    views: 2100000
  },
  {
    id: 93,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Bahagia%20Lagi.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/FHUtwGLydD.jpg",
    title: "Bahagia Lagi",
    artist: "Piche Kota",
    tags: ["sedih", "sad"],
    views: 71200000
  },
  {
    id: 94,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/CLBK%20Cintaku%20Padamu%20Bersemi%20Kembali.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1773935486759.jpeg",
    title: "CLBK ( Cintaku Padamu Bersemi Kembali )",
    artist: "Maman Fvndy",
    tags: ["cintaku"],
    views: 27200000
  },
  {
    id: 95,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/BULLETPROOF.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_62ccc42a-ba39-4c4c-9309-f5763bfd98ff.jpg",
    title: "BULLETPROOF",
    artist: "Garena Free Fire",
    tags: ["Aksi"],
    views: 250000
  },
  {
    id: 96,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Here%20With%20Me.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_68760dcc-7c2c-4ea2-a7cb-f164aedc9afd.jpg",
    title: "Here With Me",
    artist: "d4vd",
    tags: ["sad", "sedih"],
    views: 637800000
  },
  {
    id: 97,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Happiness.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/artworks-897VbaCODT1e-0-t500x500.jpg",
    title: "Happiness",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 98500000
  },
  {
    id: 98,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Best%20Friend.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_2ee01678-d570-4704-bef1-08f99aa47b0d.jpg",
    title: "Best Friend",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 308500000
  },
  {
    id: 99,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/THE%20SHADE.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1778890057592.jpeg",
    title: "THE SHADE",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 223500000
  },
  {
    id: 100,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Television%20_%20So%20Far%20So%20Good.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/artworks-897VbaCODT1e-0-t500x500.jpg",
    title: "Television / So Far So Good",
    artist: "Rex Orange County",
    tags: ["sad", "sedih", "senang"],
    views: 176900000
  },
  {
    id: 101,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Pluto%20Projector.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_ff4e73ba-3eb7-4295-966e-b7539e139c13.jpg",
    title: "Pluto Projector",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 89500000
  },
  {
    id: 102,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Sunflower.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_a75cf196-0362-4f71-9bf7-78bd17216447.jpg",
    title: "Sunflower",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 216600000
  },
  {
    id: 103,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/AMAZING.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1778890057592.jpeg",
    title: "AMAZING",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 78500000
  },
  {
    id: 104,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Untitled.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/artworks-897VbaCODT1e-0-t500x500.jpg",
    title: "Untitled",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 23700000
  },
  {
    id: 105,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Always.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_ff4e73ba-3eb7-4295-966e-b7539e139c13.jpg",
    title: "Always",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 10600000
  },
  {
    id: 106,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/ONE%20IN%20A%20MILLION.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1778890057592.jpeg",
    title: "ONE IN A MILLION",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 10500000
  },
  {
    id: 107,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Never%20Enough.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/artworks-897VbaCODT1e-0-t500x500.jpg",
    title: "Never Enough",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 8900000
  },
  {
    id: 108,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Rearrange%20My%20World.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1778894185659.jpeg",
    title: "Rearrange My World",
    artist: "Danial Caesar & Rex Orange County",
    tags: ["sad", "sedih"],
    views: 10700000
  },
  {
    id: 109,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Loving%20Is%20Easy.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_8e02e31d-59fe-4e67-a327-706d1f5a4239.jpg",
    title: "Loving Is Easy (feat. Benny Sings)",
    artist: "Rex Orange County",
    tags: ["sad", "sedih"],
    views: 50900000
  },
  {
    id: 110,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/There%E2%80%99s%20a%20Field%20That%E2%80%99s%20Only%20Yours.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1778894185659.jpeg",
    title: "There’s a Field (That’s Only Yours)",
    artist: "Danial Caesar & Rex Orange County",
    tags: ["sad", "sedih"],
    views: 1700000
  },
  {
    id: 111,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Kicau%20Mania.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_8da33346-225c-4c28-9e76-b5cd8aa3c52a.jpg",
    title: "Kicau Mania",
    artist: "Ndarboy Genk, Banditoz Yaow 86 & BoyCord",
    tags: ["kicau", "senang", "dj", "trend"],
    views: 38900000
  },
  {
    id: 112,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Curi%20Curi%20Pandang.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/WA_1779279141277.jpeg",
    title: "Curi Curi Pandang",
    artist: "Maman Fvndy",
    tags: ["curi", "mman", "dj", "fendi", "trend"],
    views: 10000000
  },
  {
    id: 113,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/That%20Should%20Be%20Me.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_00912028-eddb-4830-a8b1-2649bacd9929.jpg",
    title: "That Should Be Me",
    artist: "Justin Bieber",
    tags: ["ded soul bi mi", "jastin biber", "trend", "sad"],
    views: 194800000
  },
  {
    id: 114,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Beauty%20And%20A%20Beat.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_6133b01d-4e2b-4796-9203-eaa070c31ad3.jpg",
    title: "Beauty And A Beat (feat. Nicki Minaj)",
    artist: "Justin Bieber",
    tags: ["senang", "jastin biber"],
    views: 1490000000
  },
  {
    id: 115,
    audio: "https://github.com/PretyFX69/music-files/raw/refs/heads/main/Baby.mp3",
    image: "https://raw.githubusercontent.com/PretyFX69/music-files/refs/heads/main/1_00912028-eddb-4830-a8b1-2649bacd9929.jpg",
    title: "Baby (feat. Ludacris)",
    artist: "Justin Bieber",
    tags: ["bebi o", "jastin biber", "trend", "senang"],
    views: 4794800000
  },
  {
  id: 116,
  audio: "https://github.com/PretyFX69/music-files2/raw/refs/heads/main/Smack%20That.mp3",
  image: "https://raw.githubusercontent.com/PretyFX69/music-files2/refs/heads/main/IMG_20260923_150450_233.jpg",
  title: "Smack That",
  artist: "Akon",
  tags: ["smekdet","awaneplo"],
  views: 2290000000
}
];