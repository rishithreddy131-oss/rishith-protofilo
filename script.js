"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const terminalFiles = {
  "about.py": `<span class="code-comment"># A little about Rishi</span>
<span class="code-key">name</span> <span class="code-punct">=</span> <span class="code-string">"Rishith Reddy"</span>
<span class="code-key">focus</span> <span class="code-punct">=</span> <span class="code-string">"Computer Science"</span>
<span class="code-key">currently_learning</span> <span class="code-punct">=</span> <span class="code-string">["Python", "Web Development"]</span>
<span class="code-key">mindset</span> <span class="code-punct">=</span> <span class="code-string">"curious + building"</span>`,
  "skills.json": `<span class="code-punct">{</span>
  <span class="code-key">"languages"</span><span class="code-punct">:</span> <span class="code-string">["Python", "JavaScript"]</span><span class="code-punct">,</span>
  <span class="code-key">"web"</span><span class="code-punct">:</span> <span class="code-string">["HTML5", "CSS3", "Responsive UI"]</span><span class="code-punct">,</span>
  <span class="code-key">"workflow"</span><span class="code-punct">:</span> <span class="code-string">["Git", "GitHub"]</span>
<span class="code-punct">}</span>`,
  "goals.md": `<span class="code-comment"># What I'm working toward</span>
<span class="code-key">01.</span> Strengthen computer science fundamentals
<span class="code-key">02.</span> Build useful projects, one iteration at a time
<span class="code-key">03.</span> Keep learning how the web works`
};

const terminal = document.querySelector("#terminal-content");
const terminalTabs = [...document.querySelectorAll(".terminal-tab")];

function selectTerminalTab(tab) {
  if (!terminal || !tab) return;
  terminalTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  terminal.innerHTML = terminalFiles[tab.dataset.terminal] || "";
  terminal.setAttribute("aria-labelledby", tab.id);
}

terminalTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTerminalTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? terminalTabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + terminalTabs.length) % terminalTabs.length;
    terminalTabs[nextIndex].focus();
    selectTerminalTab(terminalTabs[nextIndex]);
  });
});
if (terminalTabs[0]) selectTerminalTab(terminalTabs[0]);

const clock = document.querySelector("#ist-clock");
function updateClock() {
  if (!clock) return;
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
  clock.textContent = `${time} IST`;
}
updateClock();
window.setInterval(updateClock, 1000);

const typedLine = document.querySelector("#typed-line");
if (typedLine && !reducedMotion) {
  const subtitle = typedLine.textContent.trim();
  typedLine.textContent = "";
  let characterIndex = 0;
  const typeNextCharacter = () => {
    if (characterIndex >= subtitle.length) return;
    typedLine.textContent += subtitle[characterIndex];
    characterIndex += 1;
    window.setTimeout(typeNextCharacter, 22);
  };
  window.setTimeout(typeNextCharacter, 320);
}

const portrait = document.querySelector("[data-portrait]");
if (portrait) {
  const revealPortrait = () => portrait.classList.add("loaded");
  portrait.addEventListener("load", revealPortrait, { once: true });
  portrait.addEventListener("error", () => {
    portrait.hidden = true;
  }, { once: true });
  if (portrait.complete && portrait.naturalWidth > 0) revealPortrait();
}

const filterButtons = [...document.querySelectorAll(".filter-chip")];
const skillCards = [...document.querySelectorAll(".skill-card")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    skillCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const skillDetails = {
  python: {
    title: "Python Programming",
    icon: "Py",
    summary: "Writing readable scripts and practicing the building blocks of programming.",
    concepts: "Variables, conditionals, loops, functions, collections, and organizing code into smaller reusable steps.",
    application: "I use Python for small automation and logic exercises, focusing on making each step clear and the data easy to follow."
  },
  html: {
    title: "HTML5 & CSS3",
    icon: "</>",
    summary: "Structuring web pages semantically and styling them into cohesive interfaces.",
    concepts: "Semantic HTML, accessible landmarks, layout with Flexbox and Grid, responsive breakpoints, and visual states.",
    application: "I use these foundations to build interfaces that remain clear and usable across different screen sizes."
  },
  javascript: {
    title: "JavaScript ES6+",
    icon: "JS",
    summary: "Adding useful behavior and interaction to browser-based projects.",
    concepts: "Modern syntax, DOM selection and updates, event handling, arrays and objects, and browser storage.",
    application: "I use JavaScript to connect interface controls to application state, such as filtering content or updating a shared-expense view."
  },
  logic: {
    title: "Problem Solving & Logic",
    icon: "∴",
    summary: "Turning a larger task into smaller, understandable problems.",
    concepts: "Defining inputs and outputs, decomposition, conditionals, iteration, and checking edge cases.",
    application: "This approach helps me reason through Python exercises and make interface behavior predictable before I write the code."
  },
  git: {
    title: "Git & GitHub",
    icon: "⌘",
    summary: "Keeping track of code changes and making projects easier to revisit.",
    concepts: "Repositories, commits, branches, diffs, and using GitHub to host and share code.",
    application: "I use version control to record project progress and keep a clear history while experimenting and learning."
  },
  responsive: {
    title: "Responsive UI Design",
    icon: "▣",
    summary: "Designing layouts that work comfortably on small and large screens.",
    concepts: "Fluid sizing, flexible grids, breakpoints, readable type scales, and touch-friendly controls.",
    application: "I apply responsive patterns to portfolio and web projects so content and controls adapt to the available space."
  }
};

const skillDialog = document.querySelector(".skill-dialog");
const dialogClose = document.querySelector(".dialog-close");
let lastSkillTrigger = null;
skillCards.forEach((card) => {
  card.addEventListener("click", () => {
    const detail = skillDetails[card.dataset.skill];
    if (!detail || !skillDialog) return;
    lastSkillTrigger = card;
    skillDialog.querySelector("#dialog-title").textContent = detail.title;
    skillDialog.querySelector(".dialog-icon").textContent = detail.icon;
    skillDialog.querySelector(".dialog-summary").textContent = detail.summary;
    skillDialog.querySelector(".dialog-concepts").textContent = detail.concepts;
    skillDialog.querySelector(".dialog-application").textContent = detail.application;
    skillDialog.showModal();
    dialogClose?.focus();
  });
  if (finePointer && !reducedMotion) {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateY = ((x / bounds.width) - 0.5) * 4;
      const rotateX = (0.5 - (y / bounds.height)) * 4;
      card.style.setProperty("--mx", `${(x / bounds.width) * 100}%`);
      card.style.setProperty("--my", `${(y / bounds.height) * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "30%");
    });
  }
});
dialogClose?.addEventListener("click", () => skillDialog?.close());
skillDialog?.addEventListener("close", () => lastSkillTrigger?.focus());

const commandDialog = document.querySelector(".command-dialog");
const commandTrigger = document.querySelector(".command-trigger");
const commandSearch = commandDialog?.querySelector(".command-search input");
const commandOptions = [...(commandDialog?.querySelectorAll('[role="option"]') || [])];
let selectedCommandIndex = 0;

function openCommandMenu() {
  if (!commandDialog || commandDialog.open) return;
  commandDialog.showModal();
  if (commandSearch) {
    commandSearch.value = "";
    commandSearch.focus();
  }
  filterCommands();
}
function closeCommandMenu() {
  if (!commandDialog?.open) return;
  commandDialog.close();
  commandTrigger?.focus();
}
function filterCommands() {
  const query = commandSearch?.value.trim().toLowerCase() || "";
  let firstVisible = -1;
  commandOptions.forEach((option, index) => {
    const visible = option.textContent.toLowerCase().includes(query);
    option.hidden = !visible;
    option.classList.remove("selected");
    option.setAttribute("aria-selected", "false");
    if (visible && firstVisible < 0) firstVisible = index;
  });
  selectedCommandIndex = firstVisible;
  setCommandSelection();
}
function setCommandSelection() {
  const visibleOptions = commandOptions.filter((option) => !option.hidden);
  if (!visibleOptions.length) return;
  const selected = commandOptions[selectedCommandIndex];
  if (!selected || selected.hidden) selectedCommandIndex = commandOptions.indexOf(visibleOptions[0]);
  const option = commandOptions[selectedCommandIndex];
  option.classList.add("selected");
  option.setAttribute("aria-selected", "true");
}
function moveCommandSelection(direction) {
  const visibleIndices = commandOptions
    .map((option, index) => option.hidden ? -1 : index)
    .filter((index) => index >= 0);
  if (!visibleIndices.length) return;
  const current = visibleIndices.indexOf(selectedCommandIndex);
  selectedCommandIndex = visibleIndices[(current + direction + visibleIndices.length) % visibleIndices.length];
  commandOptions.forEach((option) => {
    option.classList.remove("selected");
    option.setAttribute("aria-selected", "false");
  });
  setCommandSelection();
}
commandTrigger?.addEventListener("click", openCommandMenu);
commandSearch?.addEventListener("input", filterCommands);
commandSearch?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveCommandSelection(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveCommandSelection(-1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    commandOptions[selectedCommandIndex]?.click();
  }
});
commandDialog?.addEventListener("click", (event) => {
  if (event.target === commandDialog) closeCommandMenu();
});
commandDialog?.addEventListener("close", () => commandTrigger?.focus());
commandOptions.forEach((option) => {
  option.addEventListener("mouseenter", () => {
    commandOptions.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-selected", "false");
    });
    selectedCommandIndex = commandOptions.indexOf(option);
    option.classList.add("selected");
    option.setAttribute("aria-selected", "true");
  });
  option.addEventListener("click", (event) => {
    const target = document.querySelector(option.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeCommandMenu();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", option.getAttribute("href"));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && commandDialog?.open) {
    closeCommandMenu();
    return;
  }
  const target = event.target;
  const typing = target instanceof HTMLElement
    && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  if (event.key === "/" && !typing && !skillDialog?.open && !commandDialog?.open) {
    event.preventDefault();
    openCommandMenu();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
function closeMobileNav() {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mainNav.classList.remove("open");
}
menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  mainNav?.classList.toggle("open", !expanded);
});
mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileNav));

const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
  sections.forEach((section) => navObserver.observe(section));
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".section-label, .about-layout, .about-stats, .section-intro, .skill-card, .project-card, .timeline-item, .contact-form")
    .forEach((element) => {
      element.classList.add("reveal-ready");
      revealObserver.observe(element);
    });
}

const toast = document.querySelector(".toast");
let toastTimeout;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}
document.querySelector(".email-copy")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const email = button.dataset.email;
  if (!email) return;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email address copied to clipboard.");
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = email;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.append(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    showToast(copied ? "Email address copied to clipboard." : `Email me at ${email}`);
  }
});

document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;
  const name = new FormData(form).get("name");
  const success = document.querySelector("#form-success");
  const successName = success?.querySelector("[data-success-name]");
  if (successName) successName.textContent = String(name || "").trim();
  if (success) success.hidden = false;
  showToast("This demo does not send messages. Please use the email link.");
});

const cursorRing = document.querySelector(".cursor-ring");
const cursorGlow = document.querySelector(".cursor-glow");
if (finePointer && cursorRing && cursorGlow && !reducedMotion) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let cursorFrame = 0;
  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorRing.classList.add("visible");
    cursorGlow.style.left = `${pointerX}px`;
    cursorGlow.style.top = `${pointerY}px`;
  }, { passive: true });
  document.addEventListener("pointerleave", () => cursorRing.classList.remove("visible"));
  document.addEventListener("pointerover", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
    if (target) {
      cursorRing.classList.add("is-hover");
      cursorRing.querySelector("span").textContent = target.dataset.cursor || "OPEN";
    } else {
      cursorRing.classList.remove("is-hover");
      cursorRing.querySelector("span").textContent = "";
    }
  });
  function moveCursor() {
    ringX += (pointerX - ringX) * 0.22;
    ringY += (pointerY - ringY) * 0.22;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    cursorFrame = window.requestAnimationFrame(moveCursor);
  }
  cursorFrame = window.requestAnimationFrame(moveCursor);
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(cursorFrame), { once: true });
}

const canvas = document.querySelector(".ambient-canvas");
const context = canvas?.getContext("2d", { alpha: true });
if (canvas && context) {
  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointer = { x: -1000, y: -1000 };
  let particles = [];
  let animationFrame = 0;
  let lastFrame = 0;
  const spacing = 54;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(42, Math.max(12, Math.round((width * height) / 26000)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: (index * 167.37 + 43) % width,
      y: (index * 293.71 + 97) % height,
      phase: index * 1.71,
      size: index % 7 === 0 ? 1.8 : 1
    }));
    drawCanvas(performance.now());
  }
  function drawCanvas(time) {
    context.clearRect(0, 0, width, height);
    const drift = reducedMotion ? 0 : time * 0.000018;
    const step = spacing;
    const columns = Math.ceil(width / step);
    const rows = Math.ceil(height / step);
    for (let column = 0; column <= columns; column += 1) {
      for (let row = 0; row <= rows; row += 1) {
        const x = column * step;
        const y = row * step;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 210);
        const wave = reducedMotion ? 0 : Math.sin(drift * 8 + column * 0.42 + row * 0.3) * 0.5 + 0.5;
        const alpha = 0.04 + influence * 0.36 + wave * 0.035;
        context.fillStyle = `rgba(93, 227, 180, ${alpha})`;
        context.fillRect(x - 1, y - 1, 2 + influence, 2 + influence);
      }
    }
    particles.forEach((particle) => {
      const float = reducedMotion ? 0 : Math.sin(time * 0.0005 + particle.phase) * 5;
      const x = particle.x;
      const y = particle.y + float;
      const distance = Math.hypot(x - pointer.x, y - pointer.y);
      const alpha = 0.1 + (distance < 220 ? (1 - distance / 220) * 0.5 : 0);
      context.beginPath();
      context.fillStyle = `rgba(16, 185, 129, ${alpha})`;
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
  }
  function animateCanvas(time) {
    if (time - lastFrame > 40) {
      drawCanvas(time);
      lastFrame = time;
    }
    animationFrame = window.requestAnimationFrame(animateCanvas);
  }
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();
  if (!reducedMotion) animationFrame = window.requestAnimationFrame(animateCanvas);
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(animationFrame), { once: true });
}
