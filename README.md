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

Progress is stored in `localStorage` under `grammar-coach-accounts-v1`. The built-in Alex, Carina and George accounts have separate attempts, mistakes, reviews and XP. Use the account selector in the top bar to switch students, or the plus button to add another name. Reset Progress now offers the latest 1, 5 or 10 answers; resetting all progress requires a second confirmation and only affects the current account.
