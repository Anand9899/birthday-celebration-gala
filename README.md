<div align="center">

# 🎂 The Grand Birthday Celebration Gala ✨
### *An ultra-premium, interactive 3D web experience to make birthdays unforgettable!*

[![Node.js Version](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Synthesizer-ff5722?style=for-the-badge&logo=audio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: ISC](https://img.shields.io/badge/License-ISC-f59e0b?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Anand9899/birthday-celebration-gala?style=for-the-badge&color=ffd166)](https://github.com/Anand9899/birthday-celebration-gala/stargazers)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-url-personalization">URL Magic Links</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-author--credits">Author</a>
</p>

---

</div>

## 🌟 Overview

**The Grand Birthday Celebration Gala** is a full-stack, visually breathtaking web application designed to deliver an unforgettable digital birthday party. Combining modern **Glassmorphism**, **WebGL & Canvas Particle Physics**, an **in-browser Web Audio Synthesizer**, and interactive games, this project transforms a simple birthday greeting into an extraordinary virtual festival.

---

## ✨ Key Features

### 1. 🎵 Multi-Track Birthday Jukebox
*Switch between 4 high-fidelity festive audio modes with zero external MP3 dependencies:*
- 👑 **Grand Gala**: Full symphonic birthday fanfare.
- 🕺 **Upbeat Pop**: High-energy, syncopated 130 BPM dance pop synth.
- 🎷 **Bollywood Nostalgia**: Melodic rendition of the legendary anthem *"Baar Baar Din Yeh Aaye"*.
- 🎹 **Peaceful Lofi Piano**: Warm, relaxing acoustic chords and soothing bells.

---

### 2. 🎨 4-in-1 Live Theme Engine
*Transform the entire gala atmosphere in real-time with one tap:*
- 👑 **Royal Gold**: Opulent obsidian black & 24K gold accents.
- 🌸 **Rose Gold Romance**: Blush crimson, satin pink & champagne rose.
- 🌌 **Cosmic Neon**: Cyberpunk electric blue, ultraviolet & neon cyan.
- 🌿 **Emerald Gala**: Regal forest emerald, jade & sparkling white gold.

---

### 3. 🎂 3D Cake with Dual Age Number Candles
- **Interactive Candle Blowout**: Tap the candle or click the blow button to trigger smoke puff physics and extinguish the flame.
- **Dynamic Age Numbers**: Enter the celebrant's age (e.g. `21`, `25`, `50`) to instantly replace standard candles with dual 3D golden numeral candles with dancing realistic flames.
- **Cake Cutting Ceremony**: Cut interactive slices with celebratory fanfare and customized congratulatory badges.

---

### 4. 📥 Instant HD Souvenir Poster / Card (PNG)
- Generate a customized, high-definition **600x750 Keepsake Card** directly in the browser using HTML5 Canvas.
- Includes the celebrant's name, custom age milestone, heartfelt blessings, and official royal wax seal.
- Single-click PNG download optimized for WhatsApp statuses, Instagram stories, and printouts.

---

### 5. 🎈 Balloon Pop 30-Second Arcade Mini-Game
- Fast-paced 30-second reflex challenge with floating physics balloons.
- Includes rare golden balloon multipliers, combo streaks, dynamic popping sound effects, and persistent local high-score tracking.

---

### 6. 🎙️ Voice Note / Audio Wishes
- Built-in microphone audio recorder using the browser's `MediaRecorder` API.
- Guests can record up to 15 seconds of voice messages alongside text wishes.
- Interactive playback pill with waveform animations rendered live on the guestbook wall.

---

### 7. 🎡 Interactive Spin The Birthday Wheel
- Canvas-powered 8-segment fortune wheel with smooth deceleration physics.
- Audible slice-ticking sounds during rotation and celebratory confetti blasts upon revealing party fortunes (*VIP Crown, Giant Slice, 100 Blessings, etc.*).

---

### 8. 🤖 AI / Smart Birthday Wish & Shayari Generator
- Instant tailored wish and poetry generator based on:
  - **Relationship**: *Best Friend, Sister, Brother, Soulmate, Colleague*
  - **Vibe / Tone**: *Emotional & Heartfelt, Playful Roasting, Pure Hindi Shayari, Short & Punchy*
- 1-click copy directly into the message box with automatic name personalization.

---

### 9. 💌 Live Interactive Guestbook & RSVP
- Full-stack CRUD guestbook wall with instant likes, timestamps, and emoji avatars.
- Real-time RSVP guest counter and attendee registry.

---

### 10. 🎆 Dual Pyrotechnics & Ambient Fireflies
- Multi-burst canvas fireworks engine with realistic particle gravity, decay, and sound effects.
- Ambient floating golden fairy dust engine illuminating the backdrop.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Anand9899/birthday-celebration-gala.git
cd birthday-celebration-gala
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
```bash
node server.js
```

### 4. Open in Browser
Visit your local URL:
```text
http://localhost:3000
```

---

## 💌 URL Magic Links (Personalization)

You can send a fully personalized, ready-to-celebrate birthday link to your friends or family by adding URL query parameters:

```text
http://localhost:3000/?name=Priya&age=21
```

- `name`: Sets the birthday star's name across the envelope, hero section, cake, and poster.
- `age`: Sets the 3D candle numbers on the birthday cake and milestone banner.

---

## 📂 Project Architecture

```plaintext
birthday-celebration-gala/
├── data/
│   ├── celebration.json    # Persistent celebration configuration
│   ├── rsvps.json          # RSVP attendee registry
│   └── wishes.json         # Live guestbook wishes & audio links
├── public/
│   ├── app.js              # Core frontend client & game engines
│   ├── index.html          # Main application structure
│   ├── style.css           # Design tokens, themes & 3D styling
│   └── birthday-song.mp3   # Master audio track
├── .gitignore              # Ignored node_modules & OS files
├── index.html              # Standalone / root entrypoint
├── package.json            # Project dependencies & scripts
├── README.md               # Project documentation
└── server.js               # Express REST API & file upload backend
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Scalable runtime environment |
| **Express.js** | RESTful routing and API endpoints |
| **Multer** | Multipart form & voice note audio handling |
| **Web Audio API** | Real-time musical synth, chord generator & sound FX |
| **HTML5 Canvas** | Pyrotechnics, confetti, fortune wheel, and poster rendering |
| **CSS3 & SVG** | Custom design tokens, glassmorphism, 3D transforms & realistic flames |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Anand9899/birthday-celebration-gala/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author & Credits

Crafted with 💖 by **[Anand Kumar Mishra](https://github.com/Anand9899)**

⭐ **If you enjoyed this project, give it a star on GitHub!** ⭐
