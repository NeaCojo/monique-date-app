const listenBtn = document.getElementById('listenBtn');
const noBtn = document.getElementById('noBtn');
const responseText = document.getElementById('responseText');
const card = document.querySelector('.message-card');
const heartField = document.querySelector('.heart-field');

function createHeart() {
  if (!heartField) return;

  const heart = document.createElement('span');
  const symbols = ['❤', '♥', '♡'];
  heart.className = 'heart';
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${8 + Math.random() * 7}s`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.7}rem`;
  heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
  heartField.appendChild(heart);

  setTimeout(() => heart.remove(), 15000);
}

function startHeartRain() {
  if (!heartField) return;

  for (let i = 0; i < 24; i += 1) {
    setTimeout(createHeart, i * 260);
  }

  setInterval(createHeart, 500);
}

if (noBtn && card) {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setNoButtonPosition(left, top) {
    const padding = 18;
    const buttonWidth = noBtn.offsetWidth || 72;
    const buttonHeight = noBtn.offsetHeight || 32;
    const maxLeft = Math.max(card.clientWidth - buttonWidth - padding, padding);
    const maxTop = Math.max(card.clientHeight - buttonHeight - padding, padding);

    noBtn.style.left = `${clamp(left, padding, maxLeft)}px`;
    noBtn.style.top = `${clamp(top, padding, maxTop)}px`;
    noBtn.style.right = 'auto';
    noBtn.style.bottom = 'auto';
    noBtn.style.display = 'inline-block';
    noBtn.style.visibility = 'visible';
    noBtn.style.opacity = '1';
    noBtn.style.pointerEvents = 'auto';
  }

  function placeNoButtonDefault() {
    const padding = 18;
    const buttonWidth = noBtn.offsetWidth || 72;
    const buttonHeight = noBtn.offsetHeight || 32;
    const left = clamp(card.clientWidth * 0.72, padding, Math.max(card.clientWidth - buttonWidth - padding, padding));
    const top = clamp(card.clientHeight * 0.72, padding, Math.max(card.clientHeight - buttonHeight - padding, padding));
    setNoButtonPosition(left, top);
  }

  function moveNoButton() {
    const padding = 18;
    const buttonWidth = noBtn.offsetWidth || 72;
    const buttonHeight = noBtn.offsetHeight || 32;
    const maxLeft = Math.max(card.clientWidth - buttonWidth - padding, padding);
    const maxTop = Math.max(card.clientHeight - buttonHeight - padding, padding);

    const left = clamp(Math.random() * (maxLeft - padding) + padding, padding, maxLeft);
    const top = clamp(Math.random() * (maxTop - padding) + padding, padding, maxTop);

    setNoButtonPosition(left, top);
  }

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('focus', moveNoButton);
  noBtn.addEventListener('click', (event) => {
    event.preventDefault();
    moveNoButton();
  });

  window.addEventListener('load', () => {
    noBtn.style.position = 'absolute';
    noBtn.style.display = 'inline-block';
    noBtn.style.visibility = 'visible';
    noBtn.style.opacity = '1';
    noBtn.style.pointerEvents = 'auto';
    placeNoButtonDefault();
  });

  window.addEventListener('resize', () => {
    const currentLeft = parseFloat(noBtn.style.left) || 0;
    const currentTop = parseFloat(noBtn.style.top) || 0;
    setNoButtonPosition(currentLeft, currentTop);
  });
}

if (listenBtn) {
  listenBtn.addEventListener('click', () => {
    window.location.href = 'calendar.html';
  });
}

if (responseText) {
  responseText.hidden = true;
}

startHeartRain();
