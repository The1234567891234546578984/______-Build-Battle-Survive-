const canvas = document.querySelector(".plains");
const context = canvas.getContext("2d");
const dialog = document.querySelector(".menu-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector(".dialog-body");
const screen = document.querySelector(".menu-screen");
const status = document.querySelector(".screen-reader-status");
const closeButton = document.querySelector(".dialog-close");
const menuButtons = [...document.querySelectorAll(".menu-button")];
const worldSeed = 8421;
let lastMenuButton = menuButtons[0];
let dialogUsesFallback = false;

const animals = [
  {
    id: "fox",
    name: "Fox",
    sprite: [
      "...M.........M...",
      "...MM.......MM...",
      "...MMM.....MMM...",
      "....MMMMMMMMM....",
      "...MMMMMMMMMMM...",
      "..MMMMMMMMMMMMM..",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMMMMMMMMMMMM..",
      "..MMMMMMMMMMMMM...",
      "...MMDMMMMMDMM....",
      ".....DMMMMMD......",
      "......DD.DD.......",
    ],
    colors: { M: "#e58b43", D: "#603b32", C: "#f7e7bd" },
  },
  {
    id: "rabbit",
    name: "Rabbit",
    sprite: [
      "......M..M......",
      "......M..M......",
      "......M..M......",
      ".....MM..MM.....",
      ".....MM..MM.....",
      "....MMMMMMMM....",
      "...MMMMMMMMMM...",
      "...MMDDMMDDMM...",
      "...MMDDMMDDMM...",
      "...MMMMMMMMMM...",
      "....MMMMMMMM....",
      "....MM.MMMM.....",
      "....M...MM.......",
      "........MM.......",
      ".......DDDD......",
    ],
    colors: { M: "#e6dcc3", D: "#59494a" },
  },
  {
    id: "deer",
    name: "Deer",
    sprite: [
      "...D...D..D...D...",
      "...D...D..D...D...",
      "....D..D..D..D....",
      ".....D.D..D.D.....",
      "......MMMMMM......",
      ".....MMMMMMMM.....",
      "....MMMMMMMMMM....",
      "...MMCCMMMMCCMM...",
      "...MMCCMMMMCCMM...",
      "...MMMMMMMMMMMM...",
      "....MMMMMMMMMM....",
      ".....MM.MMMM.......",
      ".....D....D........",
      ".....D....D........",
    ],
    colors: { M: "#b77a48", D: "#5b4534", C: "#f5dfb0" },
  },
  {
    id: "bear",
    name: "Bear",
    sprite: [
      "....MM......MM....",
      "...MMMM....MMMM...",
      "..MMMMMMMMMMMMMM..",
      "..MMMMMMMMMMMMMM..",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMMMMMMMMMMMMM.",
      "..MMMMMMMMMMMMMM..",
      "...MMMMMMMMMMMM...",
      "...MMMMMMMMMMMM...",
      "....MMMMMMMMMM....",
      "....MM.MMMM.MM....",
      "....DD....DD.......",
    ],
    colors: { M: "#986345", D: "#42352f", C: "#f0d7aa" },
  },
  {
    id: "owl",
    name: "Owl",
    sprite: [
      ".......MM.........",
      "......MMMM........",
      ".....MMMMMM.......",
      "....MMMMMMMM......",
      "...MMMCCMMCCMMM...",
      "..MMMMCCMMCCMMMM..",
      "..MMMMMMMMMMMMMM..",
      "...MMMMMMMMMMMM...",
      "....MMMMMMMMMM....",
      ".....MMMMMMMM.....",
      "......MM..MM......",
      ".....DD....DD.....",
      "....DD......DD....",
    ],
    colors: { M: "#8a6546", D: "#39383c", C: "#f4d681" },
  },
  {
    id: "boar",
    name: "Boar",
    sprite: [
      ".....MMMMMMMM.....",
      "...MMMMMMMMMMMM...",
      "..MMMMMMMMMMMMMM..",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMCCMMMMCCMMMM.",
      ".MMMMMMMMMMMMMMMM.",
      "..MMMMMMMMMMMMMM..",
      "...MMMMMMMMMMMM...",
      "....MMMMMMMMMM....",
      "....MMDDDDDDMM....",
      "....MMLLLLMM.......",
      ".....MMMMMM........",
      ".....MM..MM........",
      ".....DD..DD........",
    ],
    colors: { M: "#896253", D: "#433638", C: "#efe0c4", L: "#d8a69a" },
  },
];

const dialogs = {
  about: {
    title: "Build. Battle. Survive.",
    body: "<p>A cozy little sandbox about making a home in the wild, finding your feet, and seeing what the horizon holds.</p><p>Made for the daydreamers.</p>",
  },
};

function randomGenerator(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function drawScene() {
  const scale = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(1, Math.floor(window.innerWidth / 3));
  const height = Math.max(1, Math.floor(window.innerHeight / 3));
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.imageSmoothingEnabled = false;

  const w = width;
  const h = height;
  const random = randomGenerator(worldSeed);
  const sky = context.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#547d83");
  sky.addColorStop(0.52, "#d99469");
  sky.addColorStop(1, "#e5aa66");
  context.fillStyle = sky;
  context.fillRect(0, 0, w, h);

  // Soft blocky clouds and the low morning sun.
  context.fillStyle = "rgba(244, 202, 151, 0.45)";
  for (let i = 0; i < 13; i++) {
    const x = random() * w;
    const y = h * (0.12 + random() * 0.24);
    const cloudWidth = 12 + random() * 28;
    context.fillRect(x, y, cloudWidth, 2);
    context.fillRect(x + 4, y - 2, cloudWidth * 0.56, 2);
  }

  const sunX = w * 0.77;
  const sunY = h * 0.34;
  context.fillStyle = "#f4cc83";
  context.fillRect(sunX - 11, sunY - 11, 22, 22);
  context.fillStyle = "rgba(247, 209, 147, 0.18)";
  context.fillRect(sunX - 17, sunY - 17, 34, 34);
  context.fillStyle = "#f4cc83";
  context.fillRect(sunX - 11, sunY - 11, 22, 22);

  drawHills(w, h, random);
  drawForeground(w, h, random);
}

function drawHills(width, height, random) {
  const horizon = height * 0.56;

  context.fillStyle = "#627e69";
  context.beginPath();
  context.moveTo(0, horizon + 3);
  for (let x = 0; x <= width + 10; x += 10) {
    context.lineTo(x, horizon + Math.sin(x * 0.012) * 8 + Math.sin(x * 0.031) * 3);
  }
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.fill();

  context.fillStyle = "#78905f";
  context.beginPath();
  context.moveTo(0, height * 0.68);
  for (let x = 0; x <= width + 14; x += 14) {
    context.lineTo(x, height * 0.68 + Math.sin(x * 0.009 + 2) * 10 + Math.sin(x * 0.02) * 4);
  }
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.fill();

  context.fillStyle = "rgba(212, 184, 112, 0.48)";
  for (let i = 0; i < width * height / 850; i++) {
    const x = random() * width;
    const y = height * 0.66 + random() * height * 0.34;
    const size = random() > 0.75 ? 2 : 1;
    context.fillRect(x, y, size, size);
  }
}

function drawTree(x, ground, size, color) {
  context.fillStyle = "#453f39";
  context.fillRect(x - size * 0.09, ground - size * 0.25, size * 0.18, size * 0.27);
  context.fillStyle = color;
  context.fillRect(x - size * 0.3, ground - size * 0.52, size * 0.6, size * 0.3);
  context.fillRect(x - size * 0.2, ground - size * 0.7, size * 0.4, size * 0.2);
  context.fillRect(x - size * 0.1, ground - size * 0.8, size * 0.2, size * 0.1);
}

function drawForeground(width, height, random) {
  const ground = height * 0.78;

  // A distant tree line gives the plains their sense of scale.
  for (let x = 0; x < width; x += 25 + random() * 23) {
    const size = 8 + random() * 8;
    drawTree(x, ground + 7, size, random() > 0.5 ? "#476b50" : "#526e4d");
  }

  // A warm footpath leading into the open landscape.
  context.fillStyle = "rgba(194, 146, 83, 0.63)";
  context.beginPath();
  context.moveTo(width * 0.58, height);
  context.lineTo(width * 0.68, height);
  context.lineTo(width * 0.57, ground);
  context.lineTo(width * 0.54, ground);
  context.fill();
  context.fillStyle = "rgba(228, 180, 111, 0.45)";
  context.fillRect(width * 0.565, ground + 3, 5, height * 0.2);

  for (let i = 0; i < width * height / 1800; i++) {
    const x = random() * width;
    const y = ground + random() * (height - ground);
    const size = 1 + random() * 2;
    const color = random();
    context.fillStyle = color > 0.78 ? "#e5c779" : color > 0.48 ? "#89995d" : "#506d4b";
    context.fillRect(x, y, size, size);
  }

  drawTree(width * 0.88, height * 0.82, height * 0.13, "#3d6048");
  drawTree(width * 0.94, height * 0.83, height * 0.09, "#496b4d");
}

function openDialog(title, body, className = "") {
  dialog.classList.toggle("animal-selection", className === "animal-selection");
  dialogTitle.textContent = title;
  dialogBody.innerHTML = body;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialogUsesFallback = true;
    dialog.setAttribute("open", "");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
  }
  closeButton.focus();
}

function closeDialog() {
  if (!dialog.hasAttribute("open")) return;
  if (!dialogUsesFallback && typeof dialog.close === "function") {
    dialog.close();
    return;
  }

  dialog.removeAttribute("open");
  dialog.removeAttribute("aria-modal");
  dialogUsesFallback = false;
  lastMenuButton.focus();
}

function drawAnimalSprite(canvas, animal) {
  const spriteContext = canvas.getContext("2d");
  canvas.width = Math.max(...animal.sprite.map((row) => row.length));
  canvas.height = animal.sprite.length;
  spriteContext.imageSmoothingEnabled = false;

  animal.sprite.forEach((row, y) => {
    [...row].forEach((pixel, x) => {
      if (pixel === ".") return;
      spriteContext.fillStyle = animal.colors[pixel];
      spriteContext.fillRect(x, y, 1, 1);
    });
  });
}

function openAnimalSelection() {
  const cards = animals
    .map(
      (animal) => `
        <button class="animal-card" type="button" data-animal="${animal.id}" aria-pressed="false">
          <span class="animal-name">${animal.name}</span>
          <canvas class="animal-sprite" width="18" height="15" aria-hidden="true"></canvas>
        </button>
      `,
    )
    .join("");

  openDialog(
    "Choose your companion",
    `<p class="animal-intro">Every adventure is better with a friend. Who will join you?</p>
      <div class="animal-grid">${cards}</div>
      <div class="animal-page-footer">
        <p class="animal-status" role="status" aria-live="polite">Choose an animal for your journey.</p>
        <button class="animal-back" type="button">BACK TO MENU</button>
      </div>`,
    "animal-selection",
  );

  animals.forEach((animal) => {
    drawAnimalSprite(dialog.querySelector(`[data-animal="${animal.id}"] canvas`), animal);
  });

  const animalCards = [...dialog.querySelectorAll(".animal-card")];
  const animalStatus = dialog.querySelector(".animal-status");
  animalCards.forEach((card) => {
    card.addEventListener("click", () => {
      animalCards.forEach((item) => item.setAttribute("aria-pressed", String(item === card)));
      const animal = animals.find((item) => item.id === card.dataset.animal);
      animalStatus.textContent = `${animal.name} is ready to join your journey!`;
    });
  });

  dialog.querySelector(".animal-back").addEventListener("click", closeDialog);
  animalCards[0].focus();
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lastMenuButton = button;
    const type = button.dataset.dialog;
    if (type === "start") {
      openAnimalSelection();
      return;
    }

    if (type === "settings") {
      openDialog(
        "Make yourself at home.",
        `<div class="settings-row"><span>Reduce motion</span><button class="toggle" type="button" role="switch" aria-checked="${screen.classList.contains("reduce-motion")}" aria-label="Reduce motion"></button></div><div class="settings-row"><span>Full screen</span><button class="toggle fullscreen-toggle" type="button" role="switch" aria-checked="${Boolean(document.fullscreenElement)}" aria-label="Full screen"></button></div>`,
      );
      bindSettings();
      return;
    }

    openDialog(dialogs.about.title, dialogs.about.body);
  });
});

function bindSettings() {
  const toggles = dialog.querySelectorAll(".toggle");
  const [motionToggle, fullscreenToggle] = toggles;

  motionToggle.addEventListener("click", () => {
    const enabled = motionToggle.getAttribute("aria-checked") !== "true";
    motionToggle.setAttribute("aria-checked", String(enabled));
    screen.classList.toggle("reduce-motion", enabled);
    status.textContent = `Reduce motion ${enabled ? "on" : "off"}.`;
  });

  fullscreenToggle.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await screen.requestFullscreen();
      }
      fullscreenToggle.setAttribute("aria-checked", String(Boolean(document.fullscreenElement)));
      status.textContent = `Full screen ${document.fullscreenElement ? "on" : "off"}.`;
    } catch (error) {
      status.textContent = "Full screen could not be changed.";
      console.error("Could not change full screen mode.", error);
    }
  });
}

closeButton.addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("close", () => {
  lastMenuButton.focus();
});
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener("keydown", (event) => {
  if (dialogUsesFallback && event.key === "Escape") closeDialog();
});
document.querySelector(".dialog-backdrop").addEventListener("click", closeDialog);
document.addEventListener("fullscreenchange", () => {
  const fullscreenToggle = dialog.querySelector(".fullscreen-toggle");
  if (fullscreenToggle) {
    fullscreenToggle.setAttribute("aria-checked", String(Boolean(document.fullscreenElement)));
  }
});

menuButtons.forEach((button, index) => {
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const offset = event.key === "ArrowDown" ? 1 : -1;
    menuButtons[(index + offset + menuButtons.length) % menuButtons.length].focus();
  });
});

window.addEventListener("resize", drawScene);
drawScene();
