# Aprenda Brincando (HTML/CSS/JS)

Jogo educativo simples (site estático) com **Alfabetização** e **Matemática**, feito para publicar no **GitHub Pages**.

## Como rodar no seu computador

1. Abra a pasta do projeto.
2. Dê duplo clique em `index.html`  
   (ou use um servidor local para evitar qualquer bloqueio do navegador).

### Rodar com servidor local (opcional)

Se você tiver Python instalado:

```bash
python -m http.server 8000
```

Depois acesse: `http://localhost:8000/`

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `aprenda-brincando`).
2. Envie **todos os arquivos desta pasta** (`index.html`, `css/`, `js/`, etc.).
3. No GitHub, vá em **Settings → Pages**.
4. Em **Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` (root)
5. Salve e aguarde. O GitHub vai mostrar o link do site publicado.

## Personalizar as perguntas

### Alfabetização

No arquivo `js/features/portugues.js`, edite a lista `LITERACY_ITEMS` (banco de palavras):

```js
const LITERACY_ITEMS = [
  { emoji: "🍎", word: "MACA", theme: "alimentos", difficulty: "facil" },
  { emoji: "🐶", word: "CACHORRO", theme: "animais", difficulty: "dificil" },
];
```

### Matemática

No arquivo `js/features/matematica.js`, você pode ajustar regras (trilhas, sessões e dificuldade).
