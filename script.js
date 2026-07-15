const intro = document.querySelector("#intro");
const enterButton = document.querySelector("#enterButton");
const countdown = document.querySelector("#countdown");
const countdownNumber = document.querySelector("#countdownNumber");
const experience = document.querySelector("#experience");
const envelope = document.querySelector("#envelope");
const envelopeScene = document.querySelector("#envelopeScene");
const openHint = document.querySelector("#openHint");
const decisionZone = document.querySelector("#decisionZone");
const noButton = document.querySelector("#noButton");
const noMessage = document.querySelector("#noMessage");
const yesButton = document.querySelector("#yesButton");
const credits = document.querySelector("#credits");
const creditsRoll = document.querySelector("#creditsRoll");
const closeCredits = document.querySelector("#closeCredits");
const replayButton = document.querySelector("#replayButton");
const confetti = document.querySelector("#confetti");
const soundtrackPanel = document.querySelector("#soundtrackPanel");
const collapseSoundtrack = document.querySelector("#collapseSoundtrack");
const soundButton = document.querySelector("#soundButton");
const soundButtonText = document.querySelector("#soundButtonText");

let player;
let wantsMusic = false;
let soundtrackCollapsed = false;
let noAttempt = 0;
let envelopeOpened = false;

const noMessages = [
  "Pensa bem... o ingresso já criou expectativas.",
  "Por favor! O botão “Sim” parece bem mais simpático.",
  "Tem certeza? Penélope esperou vinte anos. Eu só peço uma quinta-feira.",
  "Esse botão não foi treinado para lidar com rejeição.",
  "Plot twist: ele continua fugindo.",
];

// Player oficial: o vídeo fica visível e respeita as regras de reprodução do navegador.
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("youtubePlayer", {
    height: "174",
    width: "310",
    videoId: "Jne9t8sHpUc",
    playerVars: {
      autoplay: 0,
      controls: 1,
      loop: 1,
      playlist: "Jne9t8sHpUc",
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        if (wantsMusic) tryToPlaySoundtrack();
      },
    },
  });
};

function tryToPlaySoundtrack() {
  if (!player?.playVideo) return;
  try {
    player.setVolume(38);
    player.playVideo();
  } catch {
    // O próprio player permanece visível para que a pessoa possa apertar play.
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function startPremiere() {
  enterButton.disabled = true;
  wantsMusic = true;
  soundtrackPanel.classList.add("is-visible");
  tryToPlaySoundtrack();

  countdown.classList.add("active");
  countdown.setAttribute("aria-hidden", "false");

  for (const value of ["3", "2", "1", "AÇÃO!"]) {
    countdownNumber.textContent = value;
    countdownNumber.style.animation = "none";
    // Reinicia a animação a cada número.
    void countdownNumber.offsetWidth;
    countdownNumber.style.animation = "";
    await wait(value === "AÇÃO!" ? 550 : 650);
  }

  intro.classList.add("is-leaving");
  experience.classList.add("is-visible");
  experience.setAttribute("aria-hidden", "false");
  soundtrackCollapsed = true;
  soundtrackPanel.classList.add("is-collapsed");
  soundButton.setAttribute("aria-expanded", "false");
  soundButtonText.textContent = "Abrir trilha";
  countdown.classList.remove("active");
  countdown.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  await wait(950);
  experience.querySelector(".hero")?.focus?.();
}

enterButton.addEventListener("click", startPremiere);

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.add("opened");
  envelopeScene.classList.add("is-open");
  openHint.textContent = "Ingresso liberado. Próximo ato: a decisão.";
  envelope.setAttribute(
    "aria-label",
    "Envelope aberto com o ingresso revelado",
  );
}

envelope.addEventListener("click", openEnvelope);

function showNoMessage() {
  noMessage.textContent = noMessages[noAttempt % noMessages.length];
  noAttempt += 1;
  noMessage.classList.remove("pop");
  void noMessage.offsetWidth;
  noMessage.classList.add("pop");
}

function moveNoButton() {
  showNoMessage();

  const zoneRect = decisionZone.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const padding = 8;
  const maxX = Math.max(padding, zoneRect.width - buttonRect.width - padding);
  const maxY = Math.max(padding, zoneRect.height - buttonRect.height - padding);

  noButton.classList.add("is-running");
  noButton.style.left = `${Math.floor(padding + Math.random() * (maxX - padding))}px`;
  noButton.style.top = `${Math.floor(padding + Math.random() * (maxY - padding))}px`;
}

// No computador ele foge do cursor. Em telas de toque, a mensagem aparece ao clicar.
noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") moveNoButton();
});

noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

function buildConfetti() {
  if (confetti.children.length) return;

  const colors = ["#d3ad62", "#f8f4e9", "#b92545", "#5579a8"];
  for (let index = 0; index < 42; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--fall-duration", `${4 + Math.random() * 4}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * -7}s`);
    piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    confetti.appendChild(piece);
  }
}

function showCredits() {
  buildConfetti();
  creditsRoll.style.animation = "none";
  void creditsRoll.offsetWidth;
  creditsRoll.style.animation = "";
  credits.classList.add("is-visible");
  credits.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  soundtrackPanel.classList.add("is-collapsed");
  closeCredits.focus();
}

function hideCredits({ scrollToTop = false } = {}) {
  credits.classList.remove("is-visible");
  credits.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  yesButton.focus();
}

yesButton.addEventListener("click", showCredits);
closeCredits.addEventListener("click", () => hideCredits());
replayButton.addEventListener("click", () =>
  hideCredits({ scrollToTop: true }),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && credits.classList.contains("is-visible"))
    hideCredits();
});

function toggleSoundtrack() {
  soundtrackCollapsed = !soundtrackCollapsed;
  soundtrackPanel.classList.toggle("is-collapsed", soundtrackCollapsed);
  soundButton.setAttribute("aria-expanded", String(!soundtrackCollapsed));
  soundButtonText.textContent = soundtrackCollapsed ? "Abrir trilha" : "Trilha";
}

collapseSoundtrack.addEventListener("click", toggleSoundtrack);
soundButton.addEventListener("click", () => {
  if (!soundtrackPanel.classList.contains("is-visible"))
    soundtrackPanel.classList.add("is-visible");
  if (soundtrackCollapsed) toggleSoundtrack();
  tryToPlaySoundtrack();
});

window.addEventListener("resize", () => {
  if (!noButton.classList.contains("is-running")) return;
  noButton.classList.remove("is-running");
  noButton.style.left = "";
  noButton.style.top = "";
});

document.body.style.overflow = "hidden";
