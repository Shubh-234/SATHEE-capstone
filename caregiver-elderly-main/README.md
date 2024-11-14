
## Getting Started

Install all dependencies

```bash
npm i
```
Run the development server:

```bash
npm run dev
```


### Steps for firebase deployment
```bash
npm install -g firebase-tools // Restart the VSCode or your editor for changes to take effect
firebase login // login with your firebase where you have created the firebase project
firebase init hosting // Chose existing project and app create in the firebase console and Overwrite any existing file if asked
npm run build
firebase deploy // Always execute npm run build before executing firebase deploy
```

### Datasets for Preferences
In the public/data/ folder, you’ll find three Excel files with datasets that include YouTube links. Feel free to modify the datasets as needed, but please ensure the headers remain unchanged.

### Site URL
https://caregiver-b392d.web.app

### Adtional information while running firebase init hosting
What do you want to use as your public directory? dist
Configure as a single-page app (rewrite all urls to /index.html)? n
Set up automatic builds and deploys with GitHub? (y/N) n
