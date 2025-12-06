// Helper for selecting elements
const $ = (sel) => document.querySelector(sel);

const textArea = $('#textArea');
const copyBtn = $('#copyBtn');
const pasteBtn = $('#pasteBtn');
const status = $('#status');

// Display temporary status message
function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('error', isError);

  setTimeout(() => {
    if (status.textContent === message) status.textContent = '';
  }, 2200);
}

// Check Clipboard API support
const supportsClipboard = !!(
  navigator.clipboard &&
  navigator.clipboard.writeText &&
  navigator.clipboard.readText
);

if (!supportsClipboard) {
  showStatus('Clipboard API not supported', true);
  pasteBtn.disabled = true;
}

// COPY button
copyBtn.addEventListener('click', async () => {
  const text = textArea.value;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      showStatus('Copied!');
    } catch (err) {
      console.error(err);
      fallbackCopy(text);
    }
  } else {
    fallbackCopy(text);
  }
});

// PASTE button
pasteBtn.addEventListener('click', async () => {
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      const clipText = await navigator.clipboard.readText();
      textArea.value = clipText;
      showStatus('Pasted');
    } catch (err) {
      console.error(err);
      showStatus('Paste blocked or permission denied', true);
    }
  } else {
    showStatus('Paste not supported', true);
  }
});

// Fallback copy using execCommand
function fallbackCopy(text) {
  try {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);

    temp.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(temp);

    ok ? showStatus('Copied! (fallback)') : showStatus('Copy failed', true);
  } catch (e) {
    console.error(e);
    showStatus('Copy failed', true);
  }
}

// Keyboard shortcuts
// Ctrl/Cmd + Shift + C → copy
// Ctrl/Cmd + Shift + V → paste
document.addEventListener('keydown', (e) => {
  const isMod = e.ctrlKey || e.metaKey;
  if (!isMod) return;

  if (e.shiftKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    copyBtn.click();
  }

  if (e.shiftKey && e.key.toLowerCase() === 'v') {
    e.preventDefault();
    pasteBtn.click();
  }
});
