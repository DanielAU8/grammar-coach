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

Progress is stored in `localStorage` under `grammar-coach-accounts-v1`. The built-in George, Carina and Daniel accounts have separate attempts, mistakes, reviews and XP. Use the account selector in the top bar to switch students, or the plus button to add another name. Reset Progress now offers the latest 1, 5 or 10 answers; resetting all progress requires a second confirmation and only affects the current account.

After a practice set, the learner can either redo only the incorrect questions or practise five new questions from the same grammar skills. The Mistake Book's `Practise this skill` action also creates a five-question set while excluding the saved mistake questions where possible.

## Publish with GitHub Pages

The repository includes `.github/workflows/pages.yml`. After pushing it to GitHub, open the repository's **Settings → Pages**, choose **GitHub Actions** if GitHub asks for a source, and wait for the workflow to finish. The family can then use the Pages URL shown in the workflow deployment, usually:

```text
https://YOUR-GITHUB-NAME.github.io/REPOSITORY-NAME/
```
