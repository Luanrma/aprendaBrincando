// Utilitários do projeto (ESM)

export function $(id) {
  return document.getElementById(id);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function unique(arr) {
  return [...new Set(arr)];
}
