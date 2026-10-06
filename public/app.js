/* ==========================================================================
   THE GRAND BIRTHDAY GALA - FRONTEND JAVASCRIPT CONTROLLER
   Integrates Web Audio API, Canvas Engines, and Full Stack REST APIs
   ========================================================================== */

// Global Application State
const appState = {
  name: "Birthday Star",
  age: "",
  candleBlown: false,
  musicPlaying: false,
  openedCurtain: false,
  selectedEmoji: "🎉",
  currentTrack: "gala",
  currentTheme: "gold",
  targetDate: new Date(Date.now() + 1000 * 60 * 60 * 12) // 12 hours from now default
};

// Check URL Params for explicit shareable personalization (?name=Rahul&age=21)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("name") && urlParams.get("name").trim()) {
  appState.name = urlParams.get("name").trim().slice(0, 30);
}
if (urlParams.get("age") && urlParams.get("age").trim()) {
  appState.age = urlParams.get("age").trim().slice(0, 4);
}

/* ==========================================================================
   1. WEB AUDIO SYNTHESIZER JUKEBOX & SOUND EFFECTS (Multi-Track Support)
   ========================================================================== */
class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.bgAudio = null;
    this.currentTrack = "gala";
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playHappyBirthday(onComplete) {
    if (this.currentTrack && this.currentTrack !== "gala") {
      this.playCurrentTrack(onComplete);
      return;
    }
    this.stop();

    // Prefer high-quality Birthday Song MP3 track for Grand Gala
    try {
      if (!this.bgAudio) {
        this.bgAudio = new Audio('birthday-song.mp3');
        this.bgAudio.preload = 'auto';
      }
      this.bgAudio.currentTime = 0;
      this.bgAudio.onended = () => {
        if (onComplete) onComplete();
      };

      const playPromise = this.bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("MP3 playback error, falling back to Web Audio synth:", err);
          this.playSynthHappyBirthday(onComplete);
        });
      }
    } catch (e) {
      this.playSynthHappyBirthday(onComplete);
    }
  }

  playCurrentTrack(onComplete) {
    this.stop();
    if (this.currentTrack === "pop") {
      this.playPopHappyBirthday(onComplete);
    } else if (this.currentTrack === "bollywood") {
      this.playBollywoodBirthday(onComplete);
    } else if (this.currentTrack === "lofi") {
      this.playLofiBirthday(onComplete);
    } else {
      this.playHappyBirthday(onComplete);
    }
  }

  playSynthHappyBirthday(onComplete) {
    const ctx = this.getAudioContext();
    if (this.timer) clearTimeout(this.timer);

    const notes = [
      [261.63, 0.28], [261.63, 0.2], [293.66, 0.48], [261.63, 0.48], [349.23, 0.48], [329.63, 0.78],
      [261.63, 0.28], [261.63, 0.2], [293.66, 0.48], [261.63, 0.48], [392.00, 0.48], [349.23, 0.78],
      [261.63, 0.28], [261.63, 0.2], [523.25, 0.48], [440.00, 0.48], [349.23, 0.4], [329.63, 0.4], [293.66, 0.65],
      [466.16, 0.28], [466.16, 0.2], [440.00, 0.48], [349.23, 0.48], [392.00, 0.48], [349.23, 0.95]
    ];

    let playHead = ctx.currentTime + 0.05;

    notes.forEach(([freq, duration]) => {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, playHead);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.5, playHead);

      gain1.gain.setValueAtTime(0.0001, playHead);
      gain1.gain.exponentialRampToValueAtTime(0.2, playHead + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.0001, playHead + duration);

      gain2.gain.setValueAtTime(0.0001, playHead);
      gain2.gain.exponentialRampToValueAtTime(0.06, playHead + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, playHead + duration * 0.8);

      osc1.connect(gain1).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);

      osc1.start(playHead);
      osc1.stop(playHead + duration);
      osc2.start(playHead);
      osc2.stop(playHead + duration);

      playHead += duration + 0.08;
    });

    const totalMs = (playHead - ctx.currentTime) * 1000;
    this.timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
  }

  // Track 2: Upbeat Dance Pop Synthesizer with rhythmic arpeggio bounce
  playPopHappyBirthday(onComplete) {
    const ctx = this.getAudioContext();
    if (this.timer) clearTimeout(this.timer);

    const notes = [
      [261.63, 0.18], [261.63, 0.18], [293.66, 0.32], [261.63, 0.32], [349.23, 0.32], [329.63, 0.55],
      [261.63, 0.18], [261.63, 0.18], [293.66, 0.32], [261.63, 0.32], [392.00, 0.32], [349.23, 0.55],
      [261.63, 0.18], [261.63, 0.18], [523.25, 0.35], [440.00, 0.35], [349.23, 0.28], [329.63, 0.28], [293.66, 0.45],
      [466.16, 0.18], [466.16, 0.18], [440.00, 0.32], [349.23, 0.32], [392.00, 0.32], [349.23, 0.7]
    ];

    let playHead = ctx.currentTime + 0.04;

    notes.forEach(([freq, duration], idx) => {
      // Punchy Saw/Square Lead
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, playHead);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, playHead);
      filter.frequency.exponentialRampToValueAtTime(700, playHead + duration);

      gain.gain.setValueAtTime(0.001, playHead);
      gain.gain.exponentialRampToValueAtTime(0.18, playHead + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, playHead + duration);

      // Bass punch on strong beats
      if (idx % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = "triangle";
        bassOsc.frequency.setValueAtTime(freq * 0.5, playHead);
        bassGain.gain.setValueAtTime(0.16, playHead);
        bassGain.gain.exponentialRampToValueAtTime(0.001, playHead + 0.15);
        bassOsc.connect(bassGain).connect(ctx.destination);
        bassOsc.start(playHead);
        bassOsc.stop(playHead + 0.16);
      }

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(playHead);
      osc.stop(playHead + duration);

      playHead += duration + 0.05;
    });

    const totalMs = (playHead - ctx.currentTime) * 1000;
    this.timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
  }

  // Track 3: Bollywood Nostalgia ("Baar Baar Din Yeh Aaye" Hindi Celebration Anthem)
  playBollywoodBirthday(onComplete) {
    const ctx = this.getAudioContext();
    if (this.timer) clearTimeout(this.timer);

    // Melody: Baar baar din yeh aaye, baar baar dil yeh gaaye, tu jiye hazaaron saal...
    const notes = [
      // Baar baar din yeh aaye
      [261.63, 0.22], [261.63, 0.22], [329.63, 0.28], [392.00, 0.28], [392.00, 0.35],
      // Baar baar dil yeh gaaye
      [261.63, 0.22], [261.63, 0.22], [329.63, 0.28], [392.00, 0.28], [392.00, 0.35],
      // Tu jiye hazaaron saal
      [392.00, 0.2], [523.25, 0.32], [523.25, 0.22], [493.88, 0.22], [440.00, 0.42],
      // Yeh meri hai aarzoo
      [392.00, 0.2], [349.23, 0.25], [440.00, 0.25], [392.00, 0.28], [349.23, 0.25], [329.63, 0.5],
      // Happy Birthday to you!
      [329.63, 0.18], [329.63, 0.18], [349.23, 0.3], [392.00, 0.3], [440.00, 0.25], [392.00, 0.5],
      // Happy Birthday to you!
      [349.23, 0.18], [349.23, 0.18], [392.00, 0.3], [440.00, 0.3], [493.88, 0.25], [523.25, 0.75]
    ];

    let playHead = ctx.currentTime + 0.05;

    notes.forEach(([freq, duration]) => {
      // Rich expressive Indian Sitar/Harmonium styled harmonics
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, playHead);
      // Subtle pitch vibrato for Indian classical emotional flair
      osc1.frequency.setValueAtTime(freq * 0.995, playHead + 0.05);
      osc1.frequency.linearRampToValueAtTime(freq, playHead + 0.12);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, playHead);

      gain.gain.setValueAtTime(0.001, playHead);
      gain.gain.exponentialRampToValueAtTime(0.2, playHead + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, playHead + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(playHead);
      osc1.stop(playHead + duration);
      osc2.start(playHead);
      osc2.stop(playHead + duration);

      playHead += duration + 0.06;
    });

    const totalMs = (playHead - ctx.currentTime) * 1000;
    this.timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
  }

  // Track 4: Lofi Chill Piano with warm jazzy chords and gentle relaxed vibe
  playLofiBirthday(onComplete) {
    const ctx = this.getAudioContext();
    if (this.timer) clearTimeout(this.timer);

    const notes = [
      [261.63, 0.45], [261.63, 0.35], [293.66, 0.65], [261.63, 0.65], [349.23, 0.65], [329.63, 1.1],
      [261.63, 0.45], [261.63, 0.35], [293.66, 0.65], [261.63, 0.65], [392.00, 0.65], [349.23, 1.1],
      [261.63, 0.45], [261.63, 0.35], [523.25, 0.65], [440.00, 0.65], [349.23, 0.55], [329.63, 0.55], [293.66, 0.9],
      [466.16, 0.45], [466.16, 0.35], [440.00, 0.65], [349.23, 0.65], [392.00, 0.65], [349.23, 1.3]
    ];

    let playHead = ctx.currentTime + 0.08;

    notes.forEach(([freq, duration]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, playHead);

      // Warm mellow lowpass filter
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(850, playHead);

      gain.gain.setValueAtTime(0.0001, playHead);
      gain.gain.exponentialRampToValueAtTime(0.16, playHead + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, playHead + duration);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(playHead);
      osc.stop(playHead + duration);

      playHead += duration + 0.08;
    });

    const totalMs = (playHead - ctx.currentTime) * 1000;
    this.timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
  }

  stop() {
    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
        this.bgAudio.currentTime = 0;
      } catch(e) {}
    }
    if (this.timer) clearTimeout(this.timer);
    if (this.ctx) {
      try { this.ctx.close(); } catch(e){}
      this.ctx = null;
    }
  }

  playBalloonPop() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  }

  playBlowWhoosh() {
    try {
      const ctx = this.getAudioContext();
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.36);
    } catch(e) {}
  }

  playChimeFanfare() {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startT = ctx.currentTime + idx * 0.09;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.18, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.5);

        osc.connect(gain).connect(ctx.destination);
        osc.start(startT);
        osc.stop(startT + 0.52);
      });
    } catch(e) {}
  }

  playChime() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  }

  playWheelTick() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch(e) {}
  }

  playScorePop(combo = 1) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = Math.min(1200, 480 + combo * 65);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.085);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch(e) {}
  }
}

const audio = new BirthdayAudioEngine();

/* ==========================================================================
   2. DOM ELEMENTS & USER INTERFACE
   ========================================================================== */
const curtainOverlay = document.getElementById("curtain-overlay");
const openEnvelopeBtn = document.getElementById("open-envelope-trigger");
const heroNameDisplay = document.getElementById("hero-name-display");
const curtainNameTitle = document.getElementById("curtain-name-title");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const nameControlsBar = document.getElementById("name-controls-bar");
const starNameBadge = document.getElementById("star-name-badge");
const editNameBtn = document.getElementById("edit-name-btn");
const resetNameBtn = document.getElementById("reset-name-btn");
const resetCelebrationBtn = document.getElementById("reset-celebration-btn");
const musicBtn = document.getElementById("music-btn");
const musicLabel = document.getElementById("music-label");
const magicToast = document.getElementById("magic-toast");

function showMagicToast(msg) {
  magicToast.textContent = msg;
  magicToast.classList.add("visible");
  setTimeout(() => magicToast.classList.remove("visible"), 3200);
}

function editCelebration() {
  if (nameInput) {
    nameInput.focus();
    nameInput.select();
  }
  const nameCard = document.querySelector(".name-personalizer-card");
  if (nameCard) {
    nameCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function resetCelebration() {
  if (!confirm("Are you sure you want to reset the celebration name to default 'Birthday Star'?")) return;

  try {
    localStorage.removeItem("birthday_star_name");
    localStorage.removeItem("birthday_star_age");
  } catch(e) {}

  try {
    if (window.history && window.history.replaceState) {
      const u = new URL(window.location);
      u.searchParams.delete("name");
      u.searchParams.delete("age");
      window.history.replaceState({}, "", u.pathname + (u.search ? u.search : ""));
    }
  } catch(e) {}

  // Request server reset
  fetch('/api/celebration/reset', { method: 'POST' }).catch(() => {});

  updateName("Birthday Star", "", false);
  if (nameInput) {
    nameInput.value = "";
    nameInput.focus();
  }
  const envNameInput = document.getElementById("envelope-name-input");
  if (envNameInput) envNameInput.value = "";
  if (ageInput) ageInput.value = "";
  showMagicToast("🔄 Celebration reset to Birthday Star! ✨");
}

const ageInput = document.getElementById("age-input");

function updateName(newName, newAge = undefined, syncServer = true) {
  if (typeof newAge === "boolean") {
    syncServer = newAge;
    newAge = undefined;
  }
  const isCustom = Boolean(newName && newName.trim() && newName.trim().toLowerCase() !== "birthday star");
  appState.name = isCustom ? newName.trim() : "Birthday Star";
  if (newAge !== undefined && newAge !== null && newAge !== "") {
    appState.age = String(newAge).trim();
  } else if (!isCustom) {
    appState.age = "";
  }

  // Update Hero, Envelope and Document Title
  heroNameDisplay.textContent = appState.name + (appState.age ? ` (${appState.age})` : "") + " ✨";
  curtainNameTitle.textContent = `Happy Birthday, ${appState.name}!`;
  document.title = `Happy Birthday, ${appState.name}! 🎂 | Birthday Gala`;

  // Keep all input fields in sync
  if (nameInput) {
    nameInput.value = isCustom ? appState.name : "";
  }
  const envNameInput = document.getElementById("envelope-name-input");
  if (envNameInput) {
    envNameInput.value = isCustom ? appState.name : "";
  }
  if (ageInput) {
    ageInput.value = appState.age || "";
  }

  const p2Cap = document.getElementById("polaroid-2-caption");
  if (p2Cap) p2Cap.textContent = appState.name;

  // Toggle Age Candles vs Classic Candles
  const classicCandles = document.getElementById("classic-candle-group");
  const ageCandles = document.getElementById("age-candle-group");
  const ageDisplay = document.getElementById("age-num-display");
  if (appState.age && parseInt(appState.age, 10) > 0) {
    if (ageDisplay) ageDisplay.textContent = appState.age;
    if (classicCandles) classicCandles.style.display = "none";
    if (ageCandles) ageCandles.style.display = "block";
    try { localStorage.setItem("birthday_star_age", appState.age); } catch(e) {}
  } else {
    if (classicCandles) classicCandles.style.display = "block";
    if (ageCandles) ageCandles.style.display = "none";
  }

  if (isCustom) {
    try { localStorage.setItem("birthday_star_name", appState.name); } catch(e) {}
  } else {
    try {
      localStorage.removeItem("birthday_star_name");
      localStorage.removeItem("birthday_star_age");
    } catch(e) {}
  }

  try {
    if (window.history && window.history.replaceState && window.location.protocol.startsWith("http")) {
      const u = new URL(window.location);
      if (isCustom) {
        u.searchParams.set("name", appState.name);
        if (appState.age) u.searchParams.set("age", appState.age);
      } else {
        u.searchParams.delete("name");
        u.searchParams.delete("age");
      }
      window.history.replaceState({}, "", u);
    }
  } catch(e) {}

  if (syncServer && (isCustom || appState.age)) {
    fetch('/api/celebration', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: appState.name, age: appState.age })
    }).catch(() => {});
  }
}

if (nameForm) {
  nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = nameInput.value.trim();
    const ageVal = ageInput ? ageInput.value.trim() : "";
    if (val || ageVal) {
      updateName(val || appState.name, ageVal, true);
      triggerConfettiCascade(140);
      showMagicToast(`Celebration dedicated to ${val || appState.name}! 🎉`);
    }
  });
}

if (heroNameDisplay) {
  heroNameDisplay.addEventListener("click", () => {
    editCelebration();
  });
}

if (editNameBtn) editNameBtn.addEventListener("click", editCelebration);
if (resetNameBtn) resetNameBtn.addEventListener("click", resetCelebration);
if (resetCelebrationBtn) resetCelebrationBtn.addEventListener("click", resetCelebration);

// Stage 1 Unwrapping
openEnvelopeBtn.addEventListener("click", () => {
  if (appState.openedCurtain) return;
  const envNameInput = document.getElementById("envelope-name-input");
  if (envNameInput && envNameInput.value.trim()) {
    updateName(envNameInput.value.trim(), undefined, true);
  }
  appState.openedCurtain = true;
  curtainOverlay.classList.add("hidden");
  audio.playChimeFanfare();
  triggerConfettiCascade(180);
  launchGrandFireworks(4);
  showMagicToast(`Welcome to the Birthday Gala, ${appState.name}! 💖`);
  setTimeout(() => {
    if (!appState.musicPlaying) toggleMusic();
  }, 900);
});

const envNameInput = document.getElementById("envelope-name-input");
if (envNameInput) {
  envNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      openEnvelopeBtn.click();
    }
  });
}

// Replay Envelope button
const replayCurtainBtn = document.getElementById("replay-curtain-btn");
if (replayCurtainBtn) {
  replayCurtainBtn.addEventListener("click", () => {
    appState.openedCurtain = false;
    curtainOverlay.classList.remove("hidden");
    showMagicToast("📜 Replaying Royal Invitation Envelope!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Music toggle
function toggleMusic() {
  if (appState.musicPlaying) {
    audio.stop();
    appState.musicPlaying = false;
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Play Song";
  } else {
    appState.musicPlaying = true;
    musicBtn.classList.add("playing");
    musicBtn.setAttribute("aria-pressed", "true");
    musicLabel.textContent = "Song Playing";
    audio.playHappyBirthday(() => {
      appState.musicPlaying = false;
      musicBtn.classList.remove("playing");
      musicBtn.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Play Song";
    });
    triggerConfettiCascade(100);
  }
}
musicBtn.addEventListener("click", toggleMusic);

/* ==========================================================================
   4. INTERACTIVE CAKE & BLOWABLE CANDLE & CAKE CUTTING CEREMONY
   ========================================================================== */
const cakeStage = document.getElementById("cake-stage");
const cakeInteractiveWrap = document.getElementById("cake-interactive-wrap");
const candleActionBtn = document.getElementById("candle-action-btn");
const cutCakeBtn = document.getElementById("cut-cake-btn");
const cakeStatusLabel = document.getElementById("cake-status-label");
let cakeIsCut = false;

function handleCutCake() {
  cakeIsCut = true;
  cakeStage.classList.add("cut");
  audio.playChimeFanfare();
  triggerConfettiCascade(180);
  createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 60);
  launchGrandFireworks(2);
  cakeStatusLabel.textContent = "🍰 Cake Cut! Sweetest Bites For You!";
  if (cutCakeBtn) {
    cutCakeBtn.innerHTML = "<span>🍰 Cut Another Slice</span>";
  }
  showMagicToast(`🍰 Cake is Cut! Happy Birthday, ${appState.name}! Enjoy the sweetest slice! ✨`);
}

if (cutCakeBtn) {
  cutCakeBtn.addEventListener("click", handleCutCake);
}

function handleCandleToggle() {
  if (!appState.candleBlown) {
    appState.candleBlown = true;
    cakeStage.classList.add("blown");
    cakeStatusLabel.textContent = "✨ Candle Blown! Tap Cake to Cut! 🍰";
    candleActionBtn.innerHTML = "<span>🔥 Relight Candle</span>";
    if (cutCakeBtn) cutCakeBtn.style.display = "inline-flex";

    audio.playBlowWhoosh();
    audio.playChimeFanfare();
    triggerConfettiCascade(200);
    launchGrandFireworks(3);
    showMagicToast("🌟 Candle blown! Make your wish and cut the cake! 🎂🍰");
  } else {
    // If candle already blown and not cut, clicking cake cuts the cake
    if (!cakeIsCut) {
      handleCutCake();
      return;
    }
    appState.candleBlown = false;
    cakeIsCut = false;
    cakeStage.classList.remove("blown");
    cakeStage.classList.remove("cut");
    cakeStatusLabel.textContent = "🔥 Candle is Lit • Tap to Blow!";
    candleActionBtn.innerHTML = "<span>🎂 Blow The Candle</span>";
    if (cutCakeBtn) {
      cutCakeBtn.style.display = "none";
      cutCakeBtn.innerHTML = "<span>🍰 Cut The Cake</span>";
    }

    audio.playBalloonPop();
    showMagicToast("🔥 Candle relit with birthday magic!");
  }
}
cakeInteractiveWrap.addEventListener("click", handleCandleToggle);
candleActionBtn.addEventListener("click", () => {
  if (appState.candleBlown) {
    // Relight
    appState.candleBlown = false;
    cakeIsCut = false;
    cakeStage.classList.remove("blown");
    cakeStage.classList.remove("cut");
    cakeStatusLabel.textContent = "🔥 Candle is Lit • Tap to Blow!";
    candleActionBtn.innerHTML = "<span>🎂 Blow The Candle</span>";
    if (cutCakeBtn) {
      cutCakeBtn.style.display = "none";
      cutCakeBtn.innerHTML = "<span>🍰 Cut The Cake</span>";
    }
    audio.playBalloonPop();
    showMagicToast("🔥 Candle relit with birthday magic!");
  } else {
    handleCandleToggle();
  }
});

/* ==========================================================================
   5. FLOATING BALLOONS (FLOAT & POP)
   ========================================================================== */
const balloonField = document.getElementById("balloon-field");
const balloonConfigs = [
  { bg: "radial-gradient(circle at 35% 28%, #ff8fab 0%, #ff2d55 50%, #990025 100%)", glow: "rgba(255, 45, 85, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #fff3b0 0%, #e0a912 50%, #946c00 100%)", glow: "rgba(224, 169, 18, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #a7f3d0 0%, #10b981 50%, #064e3b 100%)", glow: "rgba(16, 185, 129, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #c4b5fd 0%, #8b5cf6 50%, #4c1d95 100%)", glow: "rgba(139, 92, 246, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #fbcfe8 0%, #ec4899 50%, #831843 100%)", glow: "rgba(236, 72, 153, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #bae6fd 0%, #0284c7 50%, #0c4a6e 100%)", glow: "rgba(2, 132, 199, 0.45)" },
  { bg: "radial-gradient(circle at 35% 28%, #fed7aa 0%, #f97316 50%, #7c2d12 100%)", glow: "rgba(249, 115, 22, 0.45)" }
];
const popCompliments = [
  "+1 Birthday Hug! 💖",
  "Stay Blessed! ✨",
  "More Cake For You! 🍰",
  "You're Awesome! 🌟",
  "Make 3 Wishes! 🎁",
  "Dance Today! 💃"
];

function createBalloon(initialY = null) {
  const el = document.createElement("div");
  el.className = "balloon-item";
  const cfg = balloonConfigs[Math.floor(Math.random() * balloonConfigs.length)];
  el.style.background = cfg.bg;
  el.style.boxShadow = `0 14px 28px rgba(0,0,0,0.5), 0 0 20px ${cfg.glow}`;
  el.style.left = (Math.random() * (window.innerWidth - 90) + 20) + "px";
  el.style.top = (initialY !== null ? initialY : Math.random() * (window.innerHeight * 0.6) + 80) + "px";
  el.style.animationDuration = (6 + Math.random() * 5) + "s";
  el.style.animationDelay = (-Math.random() * 5) + "s";

  el.addEventListener("click", (e) => {
    audio.playBalloonPop();
    createConfettiBurst(e.clientX, e.clientY, 35);

    const cheer = document.createElement("div");
    cheer.className = "pop-cheer";
    cheer.textContent = popCompliments[Math.floor(Math.random() * popCompliments.length)];
    cheer.style.left = e.clientX + "px";
    cheer.style.top = e.clientY + "px";
    document.body.appendChild(cheer);
    setTimeout(() => cheer.remove(), 900);

    el.remove();
    setTimeout(() => createBalloon(), 3500);
  });

  balloonField.appendChild(el);
}
for (let i = 0; i < 7; i++) createBalloon();

/* ==========================================================================
   6. FULL STACK API CLIENT: LIVE GUESTBOOK WISHES WALL
   ========================================================================== */
const wishesStream = document.getElementById("wishes-stream");
const wishForm = document.getElementById("post-wish-form");
const wishSenderInput = document.getElementById("wish-sender-input");
const wishMsgInput = document.getElementById("wish-msg-input");
const emojiButtons = document.querySelectorAll(".emoji-btn");

emojiButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    emojiButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    appState.selectedEmoji = btn.dataset.emoji;
  });
});

async function loadWishes() {
  try {
    const res = await fetch('/api/wishes');
    const result = await res.json();
    if (result.success && result.data) {
      renderWishes(result.data);
    }
  } catch (err) {
    console.log("Offline or file mode: Using local wishes fallback");
  }
}

function renderWishes(wishes) {
  if (!wishesStream) return;
  wishesStream.innerHTML = "";

  if (wishes.length === 0) {
    wishesStream.innerHTML = `<p style="color:var(--text-muted); padding:20px;">No wishes yet. Be the first to bless the birthday star! ✨</p>`;
    return;
  }

  const savedLikes = JSON.parse(localStorage.getItem("wish_likes") || "{}");

  wishes.forEach(wish => {
    const card = document.createElement("div");
    card.className = "guest-wish-card";
    const dateFormatted = new Date(wish.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLiked = Boolean(savedLikes[wish.id]);
    const likeCount = (wish.likes || 1) + (isLiked ? 1 : 0);

    card.innerHTML = `
      <div>
        <div class="wish-meta">
          <div class="wish-sender">
            <div class="wish-avatar">${wish.emoji || '🎉'}</div>
            <div>
              <div class="wish-name">${escapeHtml(wish.name)}</div>
              <div class="wish-time">${dateFormatted}</div>
            </div>
          </div>
          <button class="wish-delete-btn" data-id="${wish.id}" title="Remove wish">✕</button>
        </div>
        <p class="wish-content">${escapeHtml(wish.message)}</p>
        ${wish.audioUrl ? `
          <div class="wish-voice-pill">
            <button type="button" class="voice-play-pill-btn" data-audio="${wish.audioUrl}">
              <span class="voice-pill-icon">▶</span>
              <span class="voice-pill-text">Voice Wish 🎙️</span>
            </button>
          </div>
        ` : ''}
        <div class="wish-actions-row">
          <button type="button" class="wish-like-btn ${isLiked ? 'liked' : ''}" data-id="${wish.id}">
            <span>❤️</span>
            <span class="like-counter">${likeCount}</span>
          </button>
        </div>
      </div>
    `;

    // Voice Pill Player Handler
    const voiceBtn = card.querySelector(".voice-play-pill-btn");
    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        const audioSrc = voiceBtn.dataset.audio;
        if (!audioSrc) return;
        const iconEl = voiceBtn.querySelector(".voice-pill-icon");
        const textEl = voiceBtn.querySelector(".voice-pill-text");

        if (window.currentVoiceAudio && window.currentVoiceAudio !== voiceBtn._audio) {
          window.currentVoiceAudio.pause();
          if (window.currentVoiceBtn) {
            window.currentVoiceBtn.querySelector(".voice-pill-icon").textContent = "▶";
            window.currentVoiceBtn.querySelector(".voice-pill-text").textContent = "Voice Wish 🎙️";
          }
        }

        if (!voiceBtn._audio) {
          voiceBtn._audio = new Audio(audioSrc);
          voiceBtn._audio.onended = () => {
            iconEl.textContent = "▶";
            textEl.textContent = "Voice Wish 🎙️";
          };
        }

        if (voiceBtn._audio.paused) {
          voiceBtn._audio.play();
          window.currentVoiceAudio = voiceBtn._audio;
          window.currentVoiceBtn = voiceBtn;
          iconEl.textContent = "⏸";
          textEl.textContent = "Playing...";
        } else {
          voiceBtn._audio.pause();
          iconEl.textContent = "▶";
          textEl.textContent = "Voice Wish 🎙️";
        }
      });
    }

    // Like handler
    const likeBtn = card.querySelector(".wish-like-btn");
    likeBtn.addEventListener("click", () => {
      const currentLikes = JSON.parse(localStorage.getItem("wish_likes") || "{}");
      const counterEl = likeBtn.querySelector(".like-counter");
      let count = parseInt(counterEl.textContent, 10) || 0;

      if (currentLikes[wish.id]) {
        delete currentLikes[wish.id];
        likeBtn.classList.remove("liked");
        counterEl.textContent = Math.max(0, count - 1);
      } else {
        currentLikes[wish.id] = true;
        likeBtn.classList.add("liked");
        counterEl.textContent = count + 1;
        const rect = likeBtn.getBoundingClientRect();
        createConfettiBurst(rect.left + 20, rect.top, 15);
      }
      localStorage.setItem("wish_likes", JSON.stringify(currentLikes));
    });

    // Delete handler
    card.querySelector(".wish-delete-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      try {
        await fetch(`/api/wishes/${id}`, { method: 'DELETE' });
        card.remove();
        showMagicToast("Wish deleted");
      } catch(err) {
        card.remove();
      }
    });

    wishesStream.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (wishForm) {
  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = wishSenderInput.value.trim();
    const message = wishMsgInput.value.trim();
    if (!name || !message) return;

    const payload = {
      name,
      message,
      emoji: appState.selectedEmoji
    };

    try {
      let res;
      if (window.recordedVoiceBlob) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("message", message);
        formData.append("emoji", appState.selectedEmoji);
        formData.append("audio", window.recordedVoiceBlob, "voice-wish.webm");
        res = await fetch('/api/wishes', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        wishMsgInput.value = "";
        if (typeof window.clearRecordedVoice === "function") {
          window.clearRecordedVoice();
        }
        triggerConfettiCascade(120);
        audio.playChimeFanfare();
        showMagicToast("✨ Wish added to the live guestbook!");
        loadWishes();
      }
    } catch (err) {
      // Local fallback
      const mockWish = { ...payload, id: `wish_${Date.now()}`, timestamp: new Date().toISOString() };
      const currentCards = Array.from(wishesStream.querySelectorAll(".guest-wish-card"));
      renderWishes([mockWish]);
      showMagicToast("✨ Wish posted!");
    }
  });
}

/* ==========================================================================
   7. FULL STACK API CLIENT: RSVP SYSTEM WITH REALTIME ATTENDEES
   ========================================================================== */
const rsvpForm = document.getElementById("rsvp-form");
const rsvpNameInput = document.getElementById("rsvp-name-input");
const rsvpBadgeCount = document.getElementById("rsvp-count-badge");
const rsvpAttendeesList = document.getElementById("rsvp-attendees-list");

async function loadRsvps() {
  try {
    const res = await fetch('/api/rsvps');
    const data = await res.json();
    if (data.success) {
      if (rsvpBadgeCount) {
        rsvpBadgeCount.textContent = `${data.count} Guests Celebrating`;
      }
      if (rsvpAttendeesList && Array.isArray(data.data)) {
        rsvpAttendeesList.innerHTML = "";
        data.data.slice(0, 16).forEach(r => {
          const chip = document.createElement("span");
          chip.className = "attendee-chip";
          chip.innerHTML = `<span class="chip-dot"></span>${escapeHtml(r.name)}`;
          rsvpAttendeesList.appendChild(chip);
        });
      }
    }
  } catch (err) {}
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = rsvpNameInput.value.trim();
    if (!name) return;

    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status: 'Attending' })
      });
      const data = await res.json();
      if (data.success) {
        rsvpNameInput.value = "";
        triggerConfettiCascade(120);
        audio.playChimeFanfare();
        showMagicToast(`🎉 RSVP Confirmed for ${name}! See you at the gala!`);
        loadRsvps();
      }
    } catch(err) {
      showMagicToast(`🎉 RSVP Confirmed for ${name}!`);
    }
  });
}

/* ==========================================================================
   8. PHOTO UPLOAD MODAL & MULTI-POLAROID STORAGE
   ========================================================================== */
const photoUploadModal = document.getElementById("photo-upload-modal");
const uploadPhotoBtn = document.getElementById("upload-photo-btn");
const closePhotoModalBtn = document.getElementById("close-photo-modal-btn");
const resetPhotosBtn = document.getElementById("reset-photos-btn");
const photoFileInput = document.getElementById("photo-file-input");
const polaroidCards = document.querySelectorAll(".polaroid-card");
const polaroidTabs = document.querySelectorAll(".polaroid-tab");

let activePolaroidTarget = 2; // Default to the Birthday Star (Card 2)

function openPhotoModal(targetIndex = 2) {
  activePolaroidTarget = targetIndex;
  polaroidTabs.forEach(tab => {
    tab.classList.toggle("active", parseInt(tab.dataset.target, 10) === targetIndex);
  });
  try {
    if (typeof photoUploadModal.showModal === "function") photoUploadModal.showModal();
    else photoUploadModal.setAttribute("open", "");
  } catch(e) {
    photoUploadModal.setAttribute("open", "");
  }
}

function closePhotoModal() {
  try {
    if (typeof photoUploadModal.close === "function") photoUploadModal.close();
    else photoUploadModal.removeAttribute("open");
  } catch(e) {
    photoUploadModal.removeAttribute("open");
  }
}

if (uploadPhotoBtn) uploadPhotoBtn.addEventListener("click", () => openPhotoModal(2));
if (closePhotoModalBtn) closePhotoModalBtn.addEventListener("click", closePhotoModal);
if (photoUploadModal) {
  photoUploadModal.addEventListener("click", (e) => {
    if (e.target === photoUploadModal) closePhotoModal();
  });
}

// Clicking any of the 3 polaroid cards opens modal targeted to that specific card
polaroidCards.forEach(card => {
  card.addEventListener("click", () => {
    const idx = parseInt(card.dataset.polaroidIndex, 10) || 2;
    openPhotoModal(idx);
  });
});

// Tab switching inside modal
polaroidTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    activePolaroidTarget = parseInt(tab.dataset.target, 10) || 2;
    polaroidTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// File upload handler
if (photoFileInput) {
  photoFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const targetImg = document.getElementById(`polaroid-img-${activePolaroidTarget}`);

    // Optimistic preview via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (targetImg) targetImg.src = dataUrl;
      try {
        localStorage.setItem(`birthday_polaroid_${activePolaroidTarget}`, dataUrl);
      } catch(err) {}

      audio.playChimeFanfare();
      triggerConfettiCascade(120);
      showMagicToast(`✨ Memory #${activePolaroidTarget} photo updated!`);
      closePhotoModal();
    };
    reader.readAsDataURL(file);

    // Upload to backend server
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success && result.url && targetImg) {
        targetImg.src = result.url;
        try {
          localStorage.setItem(`birthday_polaroid_${activePolaroidTarget}`, result.url);
        } catch(err) {}
      }
    } catch(err) {}
  });
}

// Reset photos handler
const defaultPhotos = {
  1: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
  2: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
  3: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80"
};

if (resetPhotosBtn) {
  resetPhotosBtn.addEventListener("click", () => {
    for (let i = 1; i <= 3; i++) {
      try { localStorage.removeItem(`birthday_polaroid_${i}`); } catch(e) {}
      const img = document.getElementById(`polaroid-img-${i}`);
      if (img) img.src = defaultPhotos[i];
    }
    showMagicToast("Default memories restored!");
    closePhotoModal();
  });
}

// Restore saved photos on page load
function restoreSavedPhotos() {
  for (let i = 1; i <= 3; i++) {
    const saved = localStorage.getItem(`birthday_polaroid_${i}`);
    if (saved) {
      const img = document.getElementById(`polaroid-img-${i}`);
      if (img) img.src = saved;
    }
  }
}

/* ==========================================================================
   9. SURPRISE GIFT UNBOXING MODAL
   ========================================================================== */
const giftModal = document.getElementById("gift-modal");
const openGiftBtn = document.getElementById("open-gift-modal-btn");
const closeGiftBtn = document.getElementById("modal-close-btn");
const gift3dWrap = document.getElementById("gift-3d-wrap");
const modalCelebrateBtn = document.getElementById("modal-celebrate-btn");

openGiftBtn.addEventListener("click", () => {
  giftModal.showModal();
  audio.playChimeFanfare();
  triggerConfettiCascade(100);
});
closeGiftBtn.addEventListener("click", () => giftModal.close());
giftModal.addEventListener("click", (e) => {
  if (e.target === giftModal) giftModal.close();
});

gift3dWrap.addEventListener("click", () => {
  gift3dWrap.classList.toggle("opened");
  audio.playBalloonPop();
  audio.playChimeFanfare();
  triggerConfettiCascade(160);
  launchGrandFireworks(2);
  showMagicToast("🎁 Surprise opened! The best year is yours!");
});

modalCelebrateBtn.addEventListener("click", () => {
  triggerConfettiCascade(220);
  launchGrandFireworks(3);
  audio.playChimeFanfare();
  showMagicToast("🎉 Massive hugs sent to you!");
});

/* ==========================================================================
   10. SHARING & WHATSAPP GREETINGS
   ========================================================================== */
function makeShareableUrl() {
  const u = new URL(window.location.origin + window.location.pathname);
  u.searchParams.set("name", appState.name);
  return u.toString();
}

const shareHeaderBtn = document.getElementById("share-header-btn");
const copyLinkFooterBtn = document.getElementById("copy-link-footer-btn");
const whatsappShareBtn = document.getElementById("whatsapp-share-btn");

async function handleNativeShare() {
  const link = makeShareableUrl();
  const shareData = {
    title: `Happy Birthday, ${appState.name}! 🎂`,
    text: `Hey! I made a magical interactive birthday celebration for you! Tap to open:`,
    url: link
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      showMagicToast("Shared with love! 💕");
    } catch(err) {}
  } else {
    await navigator.clipboard.writeText(link);
    showMagicToast("🔗 Personalized link copied to clipboard!");
  }
  audio.playChimeFanfare();
  triggerConfettiCascade(80);
}
shareHeaderBtn.addEventListener("click", handleNativeShare);
copyLinkFooterBtn.addEventListener("click", handleNativeShare);

whatsappShareBtn.addEventListener("click", () => {
  const link = makeShareableUrl();
  const msg = `🎉 *Happy Birthday, ${appState.name}!* 🎂✨%0A%0AI made an interactive 3D birthday celebration with fireworks, cake, and candles just for you! Open your surprise here:%0A${encodeURIComponent(link)}`;
  window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
});

/* ==========================================================================
   11. CANVAS 2D CONFETTI CASCADE ENGINE
   ========================================================================== */
const fxCanvas = document.getElementById("fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
let confettiParts = [];
let ambientDust = [];

// Initialize ambient glowing fairy embers/starlight
function initAmbientDust() {
  ambientDust = [];
  const dustCount = Math.min(35, Math.floor(window.innerWidth / 35));
  for (let i = 0; i < dustCount; i++) {
    ambientDust.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2,
      baseAlpha: 0.25 + Math.random() * 0.45,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      vy: -(0.25 + Math.random() * 0.4),
      vx: (Math.random() - 0.5) * 0.25,
      goldHue: Math.random() > 0.4 ? "255, 215, 0" : "255, 180, 200"
    });
  }
}

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  fxCanvas.width = window.innerWidth * dpr;
  fxCanvas.height = window.innerHeight * dpr;
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const fireworksCanvas = document.getElementById("fireworks-canvas");
  if (fireworksCanvas) {
    fireworksCanvas.width = window.innerWidth * dpr;
    fireworksCanvas.height = window.innerHeight * dpr;
    const fwCtx = fireworksCanvas.getContext("2d");
    fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  initAmbientDust();
}
window.addEventListener("resize", resizeCanvases);

// Track cursor movement for dynamic spotlight lighting
window.addEventListener("pointermove", (e) => {
  const px = (e.clientX / window.innerWidth) * 100;
  const py = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mouse-x", `${px.toFixed(1)}%`);
  document.documentElement.style.setProperty("--mouse-y", `${py.toFixed(1)}%`);
}, { passive: true });

function triggerConfettiCascade(count = 100) {
  const colors = ["#ffd700", "#ff4d8d", "#00f2fe", "#10b981", "#a855f7", "#ffffff", "#ff8a00"];
  for (let i = 0; i < count; i++) {
    const spreadAngle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2;
    const vel = 7 + Math.random() * 14;
    confettiParts.push({
      x: window.innerWidth * (0.15 + Math.random() * 0.7),
      y: window.innerHeight * 0.3,
      vx: Math.cos(spreadAngle) * vel,
      vy: Math.sin(spreadAngle) * vel,
      gravity: 0.26 + Math.random() * 0.14,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 7,
      h: 9 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.24
    });
  }
}

function createConfettiBurst(x, y, count = 35) {
  const colors = ["#ffd700", "#ff3366", "#38ef7d", "#11998e", "#a855f7", "#ec4899", "#ffffff", "#00f2fe"];
  const origX = typeof x === "number" ? x : window.innerWidth / 2;
  const origY = typeof y === "number" ? y : window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3.5 + Math.random() * 9;
    confettiParts.push({
      x: origX,
      y: origY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      gravity: 0.22 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.28
    });
  }
}

// Continuous particle engine loop: ambient fireflies + active celebratory confetti
function loopFxEngine() {
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // 1. Render ambient floating golden fairy dust / fireflies
  if (ambientDust.length > 0) {
    fxCtx.save();
    for (let i = 0; i < ambientDust.length; i++) {
      const p = ambientDust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.y < -15) {
        p.y = window.innerHeight + 10;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;

      const alpha = Math.max(0.05, p.baseAlpha * (0.65 + 0.35 * Math.sin(p.pulse)));
      fxCtx.shadowBlur = 9;
      fxCtx.shadowColor = `rgba(${p.goldHue}, 0.75)`;
      fxCtx.fillStyle = `rgba(${p.goldHue}, ${alpha.toFixed(2)})`;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fxCtx.fill();
    }
    fxCtx.restore();
  }

  // 2. Render and simulate active celebratory confetti
  if (confettiParts.length > 0) {
    confettiParts = confettiParts.filter(p => p.y < window.innerHeight + 40);
    for (let i = 0; i < confettiParts.length; i++) {
      const p = confettiParts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.rotSpeed;
      p.vx *= 0.985;

      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.fillStyle = p.color;
      fxCtx.shadowBlur = 5;
      fxCtx.shadowColor = p.color;
      fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      fxCtx.restore();
    }
  }

  requestAnimationFrame(loopFxEngine);
}
// Start ambient particle loop & ensure canvases are sized
resizeCanvases();
loopFxEngine();

/* ==========================================================================
   12. CANVAS PYROTECHNICS & FIREWORKS ENGINE
   ========================================================================== */
const fireworksCanvas = document.getElementById("fireworks-canvas");
const fireworksCtx = fireworksCanvas.getContext("2d");
let fireworkParticles = [];
let fireworkLoopId = 0;

class FireworkSpark {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 7;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.02;
    this.gravity = 0.08;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.97;
    this.alpha -= this.decay;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createFireworkExplosion(x, y) {
  const colors = ["#ffd166", "#ff4d8d", "#00f2fe", "#06d6a0", "#ff758c", "#c77dff"];
  const burstCol = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 60; i++) {
    fireworkParticles.push(new FireworkSpark(x, y, burstCol));
  }
  if (!fireworkLoopId) loopFireworks();
}

function loopFireworks() {
  fireworksCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);

  fireworkParticles.forEach(p => {
    p.update();
    p.draw(fireworksCtx);
  });

  if (fireworkParticles.length > 0) {
    fireworkLoopId = requestAnimationFrame(loopFireworks);
  } else {
    fireworkLoopId = 0;
  }
}

function launchGrandFireworks(rounds = 3) {
  for (let i = 0; i < rounds; i++) {
    setTimeout(() => {
      const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
      const ry = window.innerHeight * (0.15 + Math.random() * 0.35);
      createFireworkExplosion(rx, ry);
      audio.playBalloonPop();
    }, i * 450);
  }
}

// Click anywhere to launch mini fireworks
window.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button, input, textarea, form, dialog, .wax-seal, .envelope-box, .polaroid-card")) return;
  createFireworkExplosion(e.clientX, e.clientY);
});

document.getElementById("launch-fireworks-btn").addEventListener("click", () => {
  launchGrandFireworks(5);
  showMagicToast("🎆 Sky is lit with Birthday Fireworks!");
});

/* ==========================================================================
   13. INTERACTIVE BIRTHDAY COUNTDOWN CLOCK & CUSTOM SET MODAL
   ========================================================================== */
let countdownTimerId = null;
let partyCelebrated = false;

function initCountdown() {
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");
  const countdownBox = document.getElementById("countdown-box");
  const editCountdownBtn = document.getElementById("edit-countdown-btn");
  const countdownModal = document.getElementById("countdown-modal");
  const countdownForm = document.getElementById("countdown-form");
  const countdownInput = document.getElementById("countdown-datetime-input");
  const closeCountdownModalBtn = document.getElementById("close-countdown-modal-btn");
  const presetButtons = document.querySelectorAll(".preset-time-btn");

  if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

  // 1. Restore saved target date from localStorage if available
  const savedDateStr = localStorage.getItem("celebration_target_date");
  if (savedDateStr) {
    const parsed = new Date(savedDateStr);
    if (!isNaN(parsed.getTime())) {
      appState.targetDate = parsed;
    }
  }

  // 2. Format Date for datetime-local input (YYYY-MM-DDTHH:mm)
  function formatForInput(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
  }

  // 3. Ticking function
  function renderCountdown() {
    const now = Date.now();
    const target = appState.targetDate ? appState.targetDate.getTime() : (now + 12 * 3600 * 1000);
    const diff = target - now;

    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMins.textContent = "00";
      cdSecs.textContent = "00";
      if (countdownBox) countdownBox.classList.add("party-active");

      if (!partyCelebrated) {
        partyCelebrated = true;
        createFireworkExplosion(window.innerWidth / 2, window.innerHeight / 3);
        launchGrandFireworks(3);
        if (audio && typeof audio.playChime === "function") audio.playChime();
        showMagicToast("🎉 IT'S PARTY TIME! 🎂 Happy Birthday!");
      }
      return;
    }

    if (countdownBox) countdownBox.classList.remove("party-active");

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, "0");
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMins.textContent = String(mins).padStart(2, "0");
    cdSecs.textContent = String(secs).padStart(2, "0");
  }

  // Start ticker
  if (countdownTimerId) clearInterval(countdownTimerId);
  countdownTimerId = setInterval(renderCountdown, 1000);
  renderCountdown();

  // 4. Modal Open & Controls
  function openModal(e) {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!countdownModal) return;
    if (countdownInput) {
      const d = appState.targetDate || new Date(Date.now() + 12 * 3600 * 1000);
      try {
        countdownInput.value = formatForInput(d);
      } catch (err) {
        console.warn("Date formatting error:", err);
      }
    }
    try {
      if (audio && typeof audio.playChime === "function") {
        audio.playChime();
      }
    } catch(err) {}

    try {
      if (typeof countdownModal.showModal === "function") {
        countdownModal.showModal();
      } else {
        countdownModal.setAttribute("open", "");
      }
    } catch(err) {
      countdownModal.setAttribute("open", "");
    }
  }

  function closeModal(e) {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!countdownModal) return;
    try {
      if (typeof countdownModal.close === "function") {
        countdownModal.close();
      } else {
        countdownModal.removeAttribute("open");
      }
    } catch(err) {
      countdownModal.removeAttribute("open");
    }
  }

  if (countdownBox) {
    countdownBox.addEventListener("click", openModal);
  }
  if (editCountdownBtn) {
    editCountdownBtn.addEventListener("click", openModal);
  }
  if (closeCountdownModalBtn) {
    closeCountdownModalBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside dialog window
  if (countdownModal) {
    countdownModal.addEventListener("click", (e) => {
      if (e.target === countdownModal) {
        closeModal(e);
        return;
      }
      const rect = countdownModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        closeModal(e);
      }
    });
  }

  // Preset Buttons Handlers
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playChime();
      const now = new Date();
      let newDate = new Date();

      if (btn.dataset.hours) {
        newDate = new Date(now.getTime() + Number(btn.dataset.hours) * 60 * 60 * 1000);
      } else if (btn.dataset.midnight) {
        newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0);
        if (newDate <= now) {
          newDate.setDate(newDate.getDate() + 1);
        }
      } else if (btn.dataset.days) {
        newDate = new Date(now.getTime() + Number(btn.dataset.days) * 24 * 60 * 60 * 1000);
      } else if (btn.dataset.now) {
        newDate = new Date(now.getTime() - 1000);
      }

      if (countdownInput) {
        countdownInput.value = formatForInput(newDate);
      }
    });
  });

  // Save Countdown Form Handler
  if (countdownForm) {
    countdownForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!countdownInput || !countdownInput.value) return;

      const chosenDate = new Date(countdownInput.value);
      if (isNaN(chosenDate.getTime())) {
        showMagicToast("⚠️ Please select a valid date and time");
        return;
      }

      appState.targetDate = chosenDate;
      partyCelebrated = chosenDate.getTime() > Date.now() ? false : true;

      // Save locally
      localStorage.setItem("celebration_target_date", chosenDate.toISOString());

      // Save to server
      fetch("/api/celebration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDate: chosenDate.toISOString() })
      }).catch(() => {});

      closeModal();
      renderCountdown();
      triggerConfettiCascade(120);
      if (audio && typeof audio.playChime === "function") audio.playChime();

      const timeFormatted = chosenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateFormatted = chosenDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      showMagicToast(`⏳ Countdown set for ${dateFormatted}, ${timeFormatted}! ✨`);
    });
  }
}

/* ==========================================================================
   14. FEATURE 1: MULTI-TRACK BIRTHDAY JUKEBOX
   ========================================================================== */
function initJukebox() {
  const jukeboxBtn = document.getElementById("jukebox-btn");
  const jukeboxModal = document.getElementById("jukebox-modal");
  const closeJukeboxBtn = document.getElementById("close-jukebox-modal-btn");
  const trackCards = document.querySelectorAll(".jukebox-track-card");

  if (!jukeboxModal) return;

  function openJukebox() {
    audio.playChime();
    try {
      if (typeof jukeboxModal.showModal === "function") jukeboxModal.showModal();
      else jukeboxModal.setAttribute("open", "");
    } catch(e) {
      jukeboxModal.setAttribute("open", "");
    }
  }

  function closeJukebox() {
    try {
      if (typeof jukeboxModal.close === "function") jukeboxModal.close();
      else jukeboxModal.removeAttribute("open");
    } catch(e) {
      jukeboxModal.removeAttribute("open");
    }
  }

  if (jukeboxBtn) jukeboxBtn.addEventListener("click", openJukebox);
  if (closeJukeboxBtn) closeJukeboxBtn.addEventListener("click", closeJukebox);

  jukeboxModal.addEventListener("click", (e) => {
    if (e.target === jukeboxModal) closeJukebox();
  });

  trackCards.forEach(card => {
    card.addEventListener("click", () => {
      const track = card.dataset.track;
      if (!track) return;

      trackCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      audio.currentTrack = track;
      appState.currentTrack = track;

      const trackTitle = card.querySelector(".track-title") ? card.querySelector(".track-title").textContent : track;
      showMagicToast(`🎵 Now playing: ${trackTitle}! ✨`);

      // Update badge text
      trackCards.forEach(c => {
        const badge = c.querySelector(".track-play-badge");
        if (badge) badge.textContent = "Play";
      });
      const thisBadge = card.querySelector(".track-play-badge");
      if (thisBadge) thisBadge.textContent = "Playing 🎵";

      // If song is currently toggled on, switch live to this track
      appState.musicPlaying = true;
      if (musicBtn) {
        musicBtn.classList.add("playing");
        musicBtn.setAttribute("aria-pressed", "true");
      }
      if (musicLabel) musicLabel.textContent = "Song Playing";

      audio.playCurrentTrack(() => {
        appState.musicPlaying = false;
        if (musicBtn) {
          musicBtn.classList.remove("playing");
          musicBtn.setAttribute("aria-pressed", "false");
        }
        if (musicLabel) musicLabel.textContent = "Play Song";
        if (thisBadge) thisBadge.textContent = "Play";
      });
      triggerConfettiCascade(80);
    });
  });
}

/* ==========================================================================
   15. FEATURE 2: LIVE THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById("theme-btn");
  const themeModal = document.getElementById("theme-modal");
  const closeThemeBtn = document.getElementById("close-theme-modal-btn");
  const themeCardBtns = document.querySelectorAll(".theme-card-btn");

  if (!themeModal) return;

  function openTheme() {
    audio.playChime();
    try {
      if (typeof themeModal.showModal === "function") themeModal.showModal();
      else themeModal.setAttribute("open", "");
    } catch(e) {
      themeModal.setAttribute("open", "");
    }
  }

  function closeTheme() {
    try {
      if (typeof themeModal.close === "function") themeModal.close();
      else themeModal.removeAttribute("open");
    } catch(e) {
      themeModal.removeAttribute("open");
    }
  }

  if (themeBtn) themeBtn.addEventListener("click", openTheme);
  if (closeThemeBtn) closeThemeBtn.addEventListener("click", closeTheme);

  themeModal.addEventListener("click", (e) => {
    if (e.target === themeModal) closeTheme();
  });

  function applyTheme(themeName) {
    if (!themeName || themeName === "royal") {
      document.documentElement.removeAttribute("data-theme");
      appState.currentTheme = "royal";
    } else {
      document.documentElement.setAttribute("data-theme", themeName);
      appState.currentTheme = themeName;
    }
    localStorage.setItem("birthday_theme", appState.currentTheme);

    themeCardBtns.forEach(btn => {
      if (btn.dataset.theme === appState.currentTheme) btn.classList.add("active");
      else btn.classList.remove("active");
    });
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem("birthday_theme") || "royal";
  applyTheme(savedTheme);

  themeCardBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      audio.playChimeFanfare();
      triggerConfettiCascade(100);
      showMagicToast(`🎨 Theme changed to ${btn.querySelector('span') ? btn.querySelector('span').textContent : theme}! ✨`);
      setTimeout(closeTheme, 450);
    });
  });
}

/* ==========================================================================
   16. FEATURE 7: INTERACTIVE SPIN THE BIRTHDAY WHEEL
   ========================================================================== */
function initSpinWheel() {
  const spinBtn = document.getElementById("spin-wheel-btn");
  const wheelModal = document.getElementById("wheel-modal");
  const closeWheelBtn = document.getElementById("close-wheel-modal-btn");
  const canvas = document.getElementById("wheel-canvas");
  const spinActionBtn = document.getElementById("spin-wheel-action-btn");
  const centerBtn = document.getElementById("spin-wheel-center-btn");

  if (!canvas || !wheelModal) return;
  const ctx = canvas.getContext("2d");

  const segments = [
    { label: "👑 VIP Crown", color: "#f59e0b", icon: "👑" },
    { label: "🍰 Giant Slice", color: "#ec4899", icon: "🍰" },
    { label: "🎁 Secret Gift", color: "#8b5cf6", icon: "🎁" },
    { label: "💖 100 Blessings", color: "#ef4444", icon: "💖" },
    { label: "✨ Golden Wish", color: "#10b981", icon: "✨" },
    { label: "🌟 Star Spotlight", color: "#06b6d4", icon: "🌟" },
    { label: "🍾 Party Toast", color: "#f97316", icon: "🍾" },
    { label: "🎉 Mega Blast", color: "#a855f7", icon: "🎉" }
  ];

  let currentAngle = 0;
  let isSpinning = false;
  const numSegments = segments.length;
  const arcSize = (Math.PI * 2) / numSegments;

  function drawWheel(angle) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w / 2 - 10;

    ctx.clearRect(0, 0, w, h);

    // Slices
    for (let i = 0; i < numSegments; i++) {
      const seg = segments[i];
      const startA = angle + i * arcSize;
      const endA = startA + arcSize;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Border line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text and Icon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startA + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, radius - 18, 5);
      ctx.restore();

      ctx.restore();
    }

    // Outer Gold Rim with studs
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffd166";
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Center Gold Knob
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#1c142e";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffd166";
    ctx.stroke();
    ctx.restore();
  }

  drawWheel(currentAngle);

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    if (spinActionBtn) spinActionBtn.disabled = true;

    const spins = 5 + Math.random() * 4; // 5 to 9 full revolutions
    const extraAngle = Math.random() * Math.PI * 2;
    const targetAngle = currentAngle + spins * Math.PI * 2 + extraAngle;
    const duration = 4000;
    const startTime = performance.now();
    const startAngle = currentAngle;

    let lastTickSegment = -1;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      currentAngle = startAngle + (targetAngle - startAngle) * ease;

      drawWheel(currentAngle);

      // Sound tick when crossing slice boundaries
      // Pointer is at the top (angle = 3*PI/2)
      const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      const currentSegment = Math.floor(normalized / arcSize);
      if (currentSegment !== lastTickSegment) {
        lastTickSegment = currentSegment;
        audio.playWheelTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        if (spinActionBtn) spinActionBtn.disabled = false;

        // Pointer points to top (angle = -PI/2)
        const winningAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
        const winningIdx = Math.floor(winningAngle / arcSize) % numSegments;
        const winner = segments[winningIdx];

        audio.playChimeFanfare();
        triggerConfettiCascade(160);
        showMagicToast(`🎉 You Won: ${winner.label}! Make a special birthday wish! ✨`);
      }
    }

    requestAnimationFrame(animate);
  }

  function openWheel() {
    audio.playChime();
    try {
      if (typeof wheelModal.showModal === "function") wheelModal.showModal();
      else wheelModal.setAttribute("open", "");
    } catch(e) {
      wheelModal.setAttribute("open", "");
    }
    drawWheel(currentAngle);
  }

  function closeWheel() {
    try {
      if (typeof wheelModal.close === "function") wheelModal.close();
      else wheelModal.removeAttribute("open");
    } catch(e) {
      wheelModal.removeAttribute("open");
    }
  }

  if (spinBtn) spinBtn.addEventListener("click", openWheel);
  if (closeWheelBtn) closeWheelBtn.addEventListener("click", closeWheel);
  if (spinActionBtn) spinActionBtn.addEventListener("click", spinWheel);
  if (centerBtn) centerBtn.addEventListener("click", spinWheel);

  wheelModal.addEventListener("click", (e) => {
    if (e.target === wheelModal) closeWheel();
  });
}

/* ==========================================================================
   17. FEATURE 5: BALLOON POP 30s ARCADE MINI-GAME
   ========================================================================== */
function initBalloonGame() {
  const gameBtn = document.getElementById("game-btn");
  const gameModal = document.getElementById("game-modal");
  const closeGameBtn = document.getElementById("close-game-modal-btn");
  const gameTimeEl = document.getElementById("game-time");
  const gameScoreEl = document.getElementById("game-score");
  const gameBestEl = document.getElementById("game-best");
  const gameArena = document.getElementById("game-arena");
  const startPrompt = document.getElementById("game-start-prompt");
  const startBtn = document.getElementById("start-game-btn");

  if (!gameModal || !gameArena) return;

  let isPlaying = false;
  let score = 0;
  let timeLeft = 30;
  let gameInterval = null;
  let spawnInterval = null;
  let bestScore = parseInt(localStorage.getItem("balloon_pop_best") || "0", 10);
  if (gameBestEl) gameBestEl.textContent = bestScore;

  function openGame() {
    audio.playChime();
    try {
      if (typeof gameModal.showModal === "function") gameModal.showModal();
      else gameModal.setAttribute("open", "");
    } catch(e) {
      gameModal.setAttribute("open", "");
    }
  }

  function closeGame() {
    endGame();
    try {
      if (typeof gameModal.close === "function") gameModal.close();
      else gameModal.removeAttribute("open");
    } catch(e) {
      gameModal.removeAttribute("open");
    }
  }

  if (gameBtn) gameBtn.addEventListener("click", openGame);
  if (closeGameBtn) closeGameBtn.addEventListener("click", closeGame);

  gameModal.addEventListener("click", (e) => {
    if (e.target === gameModal) closeGame();
  });

  const balloonColors = [
    { bg: "radial-gradient(circle at 35% 35%, #ff85a2, #e60045)", glow: "rgba(230,0,69,0.5)" },
    { bg: "radial-gradient(circle at 35% 35%, #ffd166, #ff9e00)", glow: "rgba(255,209,102,0.5)" },
    { bg: "radial-gradient(circle at 35% 35%, #00f2fe, #4facfe)", glow: "rgba(0,242,254,0.5)" },
    { bg: "radial-gradient(circle at 35% 35%, #a855f7, #6366f1)", glow: "rgba(168,85,247,0.5)" },
    { bg: "radial-gradient(circle at 35% 35%, #06d6a0, #059669)", glow: "rgba(6,214,160,0.5)" }
  ];

  function spawnGameBalloon() {
    if (!isPlaying) return;
    if (gameArena.querySelectorAll(".arena-balloon").length > 15) return;

    const balloon = document.createElement("div");
    balloon.className = "arena-balloon";
    const col = balloonColors[Math.floor(Math.random() * balloonColors.length)];

    const size = 44 + Math.random() * 26;
    const startX = 10 + Math.random() * (gameArena.clientWidth - 70);
    const speed = 2.2 + Math.random() * 2.0;

    balloon.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size * 1.25}px;
      left: ${startX}px;
      bottom: -60px;
      border-radius: 50% 50% 50% 50% / 45% 45% 55% 55%;
      background: ${col.bg};
      box-shadow: 0 8px 20px ${col.glow};
      cursor: pointer;
      user-select: none;
      z-index: 10;
      transition: transform 0.1s ease;
    `;

    // Knot at base
    const knot = document.createElement("div");
    knot.style.cssText = `
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 7px;
      height: 5px;
      background: inherit;
      border-radius: 2px;
    `;
    balloon.appendChild(knot);

    let posY = -60;
    const driftX = (Math.random() - 0.5) * 0.8;
    let currX = startX;

    function move() {
      if (!isPlaying || !balloon.parentNode) return;
      posY += speed;
      currX += driftX;
      balloon.style.bottom = posY + "px";
      balloon.style.left = currX + "px";

      if (posY > gameArena.clientHeight + 60) {
        balloon.remove();
      } else {
        requestAnimationFrame(move);
      }
    }
    requestAnimationFrame(move);

    balloon.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      if (!isPlaying) return;

      score++;
      if (gameScoreEl) gameScoreEl.textContent = score;
      audio.playBalloonPop();

      // Mini Pop Sparkle
      const rect = balloon.getBoundingClientRect();
      const arenaRect = gameArena.getBoundingClientRect();
      createScorePopup(rect.left - arenaRect.left + size / 2, rect.top - arenaRect.top, "+1");
      balloon.remove();
    });

    gameArena.appendChild(balloon);
  }

  function createScorePopup(x, y, text) {
    const pop = document.createElement("div");
    pop.textContent = text;
    pop.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: 20px;
      font-weight: 900;
      color: #ffd166;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      pointer-events: none;
      z-index: 30;
      animation: scoreRise 0.6s ease forwards;
    `;
    gameArena.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
  }

  function startGame() {
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    if (gameScoreEl) gameScoreEl.textContent = "0";
    if (gameTimeEl) gameTimeEl.textContent = "30";
    if (startPrompt) startPrompt.style.display = "none";

    // Clear any leftover balloons
    gameArena.querySelectorAll(".arena-balloon").forEach(b => b.remove());

    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    audio.playChimeFanfare();

    gameInterval = setInterval(() => {
      timeLeft--;
      if (gameTimeEl) gameTimeEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    spawnInterval = setInterval(spawnGameBalloon, 380);
    for (let i = 0; i < 4; i++) spawnGameBalloon();
  }

  function endGame() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("balloon_pop_best", bestScore);
      if (gameBestEl) gameBestEl.textContent = bestScore;
      triggerConfettiCascade(200);
      launchGrandFireworks(3);
      showMagicToast(`🏆 NEW HIGH SCORE: ${score} balloons popped! 🎉`);
    } else {
      audio.playChimeFanfare();
      triggerConfettiCascade(100);
      showMagicToast(`🎈 Game Over! You popped ${score} balloons! ✨`);
    }

    if (startPrompt) {
      startPrompt.style.display = "flex";
      startPrompt.innerHTML = `
        <div style="font-size: 44px; margin-bottom: 8px;">🎉 🏆</div>
        <h3>Round Finished!</h3>
        <p style="font-size: 16px; color: var(--gold); font-weight: 800; margin: 8px 0 16px;">
          You Popped: ${score} Balloons!
        </p>
        <button class="btn-primary-glow" id="start-game-btn" type="button"><span>🔄 Play Again!</span></button>
      `;
      const newStartBtn = startPrompt.querySelector("#start-game-btn");
      if (newStartBtn) newStartBtn.addEventListener("click", startGame);
    }
  }

  if (startBtn) startBtn.addEventListener("click", startGame);
}

/* ==========================================================================
   18. FEATURE 4: DOWNLOAD BIRTHDAY SOUVENIR POSTER (PNG)
   ========================================================================== */
function initGreetingCard() {
  const cardBtn = document.getElementById("download-card-btn");
  const cardModal = document.getElementById("card-modal");
  const closeCardBtn = document.getElementById("close-card-modal-btn");
  const canvas = document.getElementById("card-preview-canvas");
  const downloadBtn = document.getElementById("download-card-png-btn");

  if (!canvas || !cardModal) return;
  const ctx = canvas.getContext("2d");

  function drawCard() {
    const w = canvas.width;
    const h = canvas.height;

    // Background Luxury Gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 450);
    bgGrad.addColorStop(0, "#2a1545");
    bgGrad.addColorStop(0.65, "#160b26");
    bgGrad.addColorStop(1, "#0a0413");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Golden Star Dust
    ctx.fillStyle = "rgba(255, 209, 102, 0.45)";
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * h;
      const sr = 1 + (i % 3) * 1.2;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Double Golden Luxury Border
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.strokeStyle = "rgba(255, 209, 102, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Corner Ornaments
    const cornerSize = 22;
    const corners = [
      [28, 28], [w - 28, 28], [28, h - 28], [w - 28, h - 28]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Tag
    ctx.textAlign = "center";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.letterSpacing = "4px";
    ctx.fillText("★ OFFICIAL BIRTHDAY GALA SOUVENIR ★", w / 2, 95);

    // Main Greeting
    ctx.font = "900 48px 'Cinzel', serif";
    const textGrad = ctx.createLinearGradient(w / 2 - 180, 0, w / 2 + 180, 0);
    textGrad.addColorStop(0, "#ffeaa7");
    textGrad.addColorStop(0.5, "#ffd166");
    textGrad.addColorStop(1, "#f39c12");
    ctx.fillStyle = textGrad;
    ctx.shadowColor = "rgba(255, 209, 102, 0.5)";
    ctx.shadowBlur = 14;
    ctx.fillText("HAPPY BIRTHDAY", w / 2, 170);

    // Star Recipient Name
    ctx.font = "bold 42px 'Playfair Display', serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(appState.name, w / 2, 235);

    // Age ribbon if set
    if (appState.age) {
      ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffd166";
      ctx.fillText(`★ Celebrating ${appState.age} Fabulous Years ★`, w / 2, 280);
    } else {
      ctx.font = "italic 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffeaa7";
      ctx.fillText("★ Today Is All About You ★", w / 2, 280);
    }

    // Birthday Cake Illustration in Center
    ctx.font = "80px sans-serif";
    ctx.fillText("🎂", w / 2, 385);

    // Heartfelt Wish Box
    ctx.font = "italic 20px 'Playfair Display', serif";
    ctx.fillStyle = "#f3e8ff";
    ctx.shadowBlur = 0;
    const line1 = "May your days be blessed with boundless love,";
    const line2 = "heartwarming smiles, brilliant adventures,";
    const line3 = "and all the sweetest dreams come true!";
    ctx.fillText(line1, w / 2, 460);
    ctx.fillText(line2, w / 2, 492);
    ctx.fillText(line3, w / 2, 524);

    // Wax Seal / Ribbon Badge
    ctx.beginPath();
    ctx.arc(w / 2, 600, 32, 0, Math.PI * 2);
    ctx.fillStyle = "#c0392b";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffd166";
    ctx.stroke();

    ctx.font = "28px sans-serif";
    ctx.fillText("👑", w / 2, 610);

    // Date Footer
    ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`CELEBRATED ON ${dateStr.toUpperCase()}`, w / 2, 680);
  }

  function downloadCard() {
    drawCard();
    const link = document.createElement("a");
    link.download = `Birthday-Gala-${appState.name.replace(/[^a-zA-Z0-9]/g, '_')}-Card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    audio.playChimeFanfare();
    triggerConfettiCascade(140);
    showMagicToast("💾 Birthday Poster Saved! Share it with pride! ✨");
  }

  function openCard() {
    audio.playChime();
    drawCard();
    try {
      if (typeof cardModal.showModal === "function") cardModal.showModal();
      else cardModal.setAttribute("open", "");
    } catch(e) {
      cardModal.setAttribute("open", "");
    }
  }

  function closeCard() {
    try {
      if (typeof cardModal.close === "function") cardModal.close();
      else cardModal.removeAttribute("open");
    } catch(e) {
      cardModal.removeAttribute("open");
    }
  }

  if (cardBtn) cardBtn.addEventListener("click", openCard);
  if (closeCardBtn) closeCardBtn.addEventListener("click", closeCard);
  if (downloadBtn) downloadBtn.addEventListener("click", downloadCard);

  cardModal.addEventListener("click", (e) => {
    if (e.target === cardModal) closeCard();
  });
}

/* ==========================================================================
   19. FEATURE 8: AI / SMART BIRTHDAY WISH & SHAYARI GENERATOR
   ========================================================================== */
function initAiWishGenerator() {
  const toggleBtn = document.getElementById("toggle-ai-wish-btn");
  const aiBox = document.getElementById("ai-wish-box");
  const relationSel = document.getElementById("ai-relation-select");
  const vibeSel = document.getElementById("ai-vibe-select");
  const generateBtn = document.getElementById("generate-ai-wish-btn");
  const container = document.getElementById("ai-suggestions-container");
  const wishMsgInput = document.getElementById("wish-msg-input");

  if (!toggleBtn || !aiBox) return;

  toggleBtn.addEventListener("click", () => {
    aiBox.classList.toggle("open");
    if (aiBox.classList.contains("open")) {
      audio.playChime();
      if (!container.innerHTML.trim()) generateWishes();
    }
  });

  const wishBank = {
    friend: {
      emotional: [
        "Happy Birthday to my dearest friend {name}! Thank you for lighting up every dark day with your smile and laughter. May all your dreams come true! 💖",
        "Having a friend like you is life’s greatest gift, {name}. May this new year bring endless happiness and beautiful memories! 🎂✨"
      ],
      funny: [
        "Happy Birthday {name}! You're not getting older, you're just leveling up! Now where's my cake slice? 🍕😂",
        "Happy Birthday to someone who still laughs at their own jokes! May you stay young forever {name}! 😜🎉"
      ],
      shayari: [
        "हर लम्हा आपके होठों पे मुस्कान रहे, हर ग़म से आप सदा अनजान रहें। महक उठे आपकी ज़िन्दगी खुशियों से, जन्मदिन मुबारक {name}! 🌹✨",
        "दुआ है कि कामयाबी के हर शिखर पर आपका नाम होगा, कदम-कदम पर दुनिया का सलाम होगा। जन्मदिन की ढेरों शुभकामनाएं {name}! 🎂👑"
      ],
      short: [
        "Cheers to the absolute best! Happy Birthday, {name}! 🚀🔥",
        "Keep shining and conquering the world, {name}! Happy Birthday! 🌟✨"
      ]
    },
    sister: {
      emotional: [
        "Happy Birthday to my sweetest sister {name}! You bring so much warmth, comfort, and joy into my world. Forever blessed to have you! 🌸💕",
        "Dearest {name}, may your birthday be as tender, bright, and beautiful as your loving heart! 💖🎂"
      ],
      funny: [
        "Happy Birthday {name}! Thanks for always being my unpaid therapist and drama queen! Love you! 👑😂",
        "Another year wiser, sister? Let's not get ahead of ourselves! Happy Birthday {name}! 😜🎂"
      ],
      shayari: [
        "फूलों ने अमृत का जाम भेजा है, सूरज ने गगन से सलाम भेजा है। मुबारक हो आपको जन्मदिन का ये दिन, हमने तहे दिल से ये पैगाम भेजा है {name}! 🌸✨",
        "खुदा करे हर दिन तेरा खुशियों भरा हो, जो चाहे दिल से वो सपना पूरा हो। जन्मदिन मुबारक प्यारी बहना {name}! 💖🎂"
      ],
      short: [
        "Happy Birthday to the world's most wonderful sister, {name}! 🌸✨",
        "Love you to the moon and back, {name}! Have the sweetest birthday! 💖🎉"
      ]
    },
    brother: {
      emotional: [
        "Happy Birthday to my rock-solid brother {name}! Your strength, support, and guidance mean the world to me. May you always achieve greatness! ⚡👑",
        "Brother, having you by my side makes every journey easier. Happy Birthday {name}, wishing you limitless joy! 🎂💙"
      ],
      funny: [
        "Happy Birthday bro! Don't worry about your receding hairline, wisdom looks good on you {name}! 😂🍕",
        "Happy Birthday to my favorite sibling (mostly because I have no choice)! Cheers {name}! 🍻😜"
      ],
      shayari: [
        "खुशियों की महफ़िल सजती रहे, खूबसूरत हर रात रहे। आप इतने खुश रहें ज़िन्दगी में, कि हर खुशी आपकी दीवानी रहे। जन्मदिन मुबारक भाई {name}! ⚡👑",
        "तू जिए हजारों साल, साल के दिन हों पचास हजार! जन्मदिन की बहुत-बहुत बधाई भाई {name}! 🎂🔥"
      ],
      short: [
        "Happy Birthday to my champion brother {name}! ⚡🔥",
        "Brothers for life! Have an epic birthday celebration, {name}! 👑🎉"
      ]
    },
    love: {
      emotional: [
        "Happy Birthday to the love of my life, {name}. Every moment with you is pure magic. May this day surround you with all the love you give so generously! 💖✨",
        "You are my favorite thought, my biggest smile, and my forever home. Happy Birthday, my star {name}! 🌹💕"
      ],
      funny: [
        "Happy Birthday to the only person I'd gladly share my fries with! Love you endlessly {name}! 🍟❤️",
        "Happy Birthday to someone who is lucky enough to have me in their life! Just kidding, I love you {name}! 😜💖"
      ],
      shayari: [
        "तमन्नाओं से भरी हो ज़िन्दगी, ख्वाहिशों से भरा हो हर पल। दामन भी छोटा लगने लगे, इतनी खुशियां दे आपको आने वाला कल। जन्मदिन मुबारक मेरी जान {name}! 🌹💖",
        "तेरी धड़कन ही ज़िन्दगी का किस्सा है मेरा, तू ज़िन्दगी का एक अहम् हिस्सा है मेरा। जन्मदिन की ढेरों शुभकामनाएं {name}! 💍✨"
      ],
      short: [
        "Forever yours, forever loved. Happy Birthday, {name}! 💖✨",
        "To my heart's keeper: Happy Birthday, {name}! 🌹🎂"
      ]
    },
    colleague: {
      emotional: [
        "Wishing you a very Happy Birthday {name}! It is a true privilege working alongside someone as talented, supportive, and inspiring as you. 💼✨",
        "Happy Birthday {name}! May this coming year bring exceptional career milestones and abundant personal fulfillment! 🌟📈"
      ],
      funny: [
        "Happy Birthday {name}! May your day be free of meetings that could have been emails! ☕😂",
        "Happy Birthday! Don't work too hard today, cake calories don't count during office hours {name}! 🍰🎉"
      ],
      shayari: [
        "सफलता की हर मंज़िल आपके कदम चूमेगी, आपकी मेहनत की खुशबू चारों तरफ घूमेगी। जन्मदिन मुबारक {name}! 💼🌟",
        "कामयाबी का हर शिखर आपका हो, तरक्की के हर सफर में आपका नाम हो। Happy Birthday {name}! 🚀✨"
      ],
      short: [
        "Wishing you continued success and happiness! Happy Birthday, {name}! 💼🌟",
        "Cheers to another great year of achievements! Happy Birthday, {name}! 🚀🎉"
      ]
    }
  };

  function generateWishes() {
    const relation = relationSel ? relationSel.value : "friend";
    const vibe = vibeSel ? vibeSel.value : "emotional";
    const relBank = wishBank[relation] || wishBank.friend;
    const items = relBank[vibe] || relBank.emotional;

    container.innerHTML = "";
    items.forEach((template) => {
      const formatted = template.replace(/\{name\}/g, appState.name);
      const card = document.createElement("div");
      card.className = "ai-suggestion-card";
      card.innerHTML = `
        <div class="ai-suggestion-text">${formatted}</div>
        <button type="button" class="ai-use-btn"><span>Use This Wish ✨</span></button>
      `;

      card.querySelector(".ai-use-btn").addEventListener("click", () => {
        if (wishMsgInput) {
          wishMsgInput.value = formatted;
          wishMsgInput.focus();
          wishMsgInput.scrollIntoView({ behavior: "smooth", block: "center" });
          audio.playChime();
          showMagicToast("✨ Wish inserted into your message box!");
        }
      });

      container.appendChild(card);
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      audio.playChime();
      generateWishes();
    });
  }
}

/* ==========================================================================
   20. FEATURE 6: VOICE NOTE / AUDIO WISH RECORDING ENGINE
   ========================================================================== */
function initVoiceRecorder() {
  const recordBtn = document.getElementById("voice-record-btn");
  const recordIcon = document.getElementById("voice-record-icon");
  const recordLabel = document.getElementById("voice-record-label");
  const recordDot = document.getElementById("voice-record-dot");
  const audioPlayback = document.getElementById("voice-playback");
  const clearBtn = document.getElementById("voice-clear-btn");

  if (!recordBtn) return;

  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let recordTimer = null;
  let seconds = 0;

  window.clearRecordedVoice = function() {
    window.recordedVoiceBlob = null;
    audioChunks = [];
    isRecording = false;
    clearInterval(recordTimer);
    if (recordDot) recordDot.classList.remove("recording");
    if (recordIcon) recordIcon.textContent = "🎙️";
    if (recordLabel) recordLabel.textContent = "Record Voice Note (15s)";
    if (audioPlayback) {
      audioPlayback.pause();
      audioPlayback.src = "";
      audioPlayback.style.display = "none";
    }
    if (clearBtn) clearBtn.style.display = "none";
  };

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      window.clearRecordedVoice();
      showMagicToast("Voice note removed");
    });
  }

  recordBtn.addEventListener("click", async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      return;
    }

    // Start recording
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showMagicToast("⚠️ Microphone access not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        isRecording = false;
        clearInterval(recordTimer);
        stream.getTracks().forEach(track => track.stop());

        const blob = new Blob(audioChunks, { type: "audio/webm" });
        window.recordedVoiceBlob = blob;

        if (recordDot) recordDot.classList.remove("recording");
        if (recordIcon) recordIcon.textContent = "🎙️";
        if (recordLabel) recordLabel.textContent = "Recorded! Click to Re-record";

        if (audioPlayback) {
          audioPlayback.src = URL.createObjectURL(blob);
          audioPlayback.style.display = "inline-block";
        }
        if (clearBtn) clearBtn.style.display = "inline-block";

        audio.playChime();
        showMagicToast("🎙️ Voice wish recorded successfully! Post your wish to share it! ✨");
      };

      mediaRecorder.start();
      isRecording = true;
      seconds = 0;
      if (recordDot) recordDot.classList.add("recording");
      if (recordIcon) recordIcon.textContent = "⏹";
      if (recordLabel) recordLabel.textContent = "Recording (0s / 15s)...";

      recordTimer = setInterval(() => {
        seconds++;
        if (recordLabel) recordLabel.textContent = `Recording (${seconds}s / 15s)...`;
        if (seconds >= 15) {
          if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        }
      }, 1000);

    } catch (err) {
      console.warn("Microphone access error:", err);
      showMagicToast("⚠️ Microphone permission denied or unavailable");
    }
  });
}

/* ==========================================================================
   21. APPLICATION INITIALIZATION ON DOM LOAD
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  resizeCanvases();

  // 1. Restore Star Name & Age from localStorage or URL
  const queryName = urlParams.get("name");
  const queryAge = urlParams.get("age");
  const storedName = localStorage.getItem("birthday_star_name");
  const storedAge = localStorage.getItem("birthday_star_age");

  if (queryName && queryName.trim()) {
    updateName(queryName.trim(), queryAge ? queryAge.trim() : storedAge, false);
  } else if (storedName && storedName.trim()) {
    updateName(storedName.trim(), storedAge, false);
  } else {
    updateName("Birthday Star", "", false);
  }

  // 2. Initialize Core Engines
  initCountdown();
  loadWishes();
  loadRsvps();
  restoreSavedPhotos();

  // 3. Initialize All 8 New Features
  initJukebox();
  initThemeSwitcher();
  initSpinWheel();
  initBalloonGame();
  initGreetingCard();
  initAiWishGenerator();
  initVoiceRecorder();

  // 4. Fetch Celebration Config from Server
  fetch('/api/celebration')
    .then(r => r.json())
    .then(res => {
      if (res.success && res.data) {
        if (res.data.targetDate && !localStorage.getItem("celebration_target_date")) {
          appState.targetDate = new Date(res.data.targetDate);
        }
        if (res.data.name && res.data.name !== "Birthday Star" && !queryName) {
          updateName(res.data.name, res.data.age || appState.age, false);
        } else if ((!res.data.name || res.data.name === "Birthday Star") && !queryName) {
          try {
            localStorage.removeItem("birthday_star_name");
            localStorage.removeItem("birthday_star_age");
          } catch(e) {}
          updateName("Birthday Star", "", false);
        } else if (res.data.age && !appState.age) {
          updateName(appState.name, res.data.age, false);
        }
      }
    })
    .catch(() => {});
});
