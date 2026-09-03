# Grammar Coach

Grammar Coach is a browser-first grammar practice MVP for Australian Year 6–7 students. It supports eight core grammar topics, immediate explanations, weak-area prioritisation, a mistake book, spaced review reminders, progress tracking, weekly reporting, and demo/fresh student modes.

## Run locally

Because Version 1 is a static browser app, serve this folder with any static file server. From the repository root:

```bash
python3 -m http.server 4173 --directory grammar-coach
```

Then open <http://localhost:4173>.

## Data and structure

- `index.html` — accessible app shell and metadata.
- `styles.css` — responsive visual system.
- `app.js` — curriculum, generated question bank, analytics, storage abstraction, and UI interactions.

Progress is stored in `localStorage` under `grammar-coach-v1`. The data layer is isolated behind `loadState`, `saveState`, and the analytics functions so it can be replaced by a remote store later.
