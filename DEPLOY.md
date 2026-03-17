# Deploy Guide — ryanschill.co

## What to push

All files in this folder go into the root of `rpschill/rpschill.github.io`.

**Keep from the existing repo:**
- `CNAME` — already maps ryanschill.co to the repo
- `googlefd460deec372d06b.html` — Google Search Console verification

**Replace or add everything else.**

---

## Images needed in `/img/`

You need to create an `/img/` directory and add these files before the site
looks right. Rename them exactly as shown.

| Filename | Source file | Notes |
|---|---|---|
| `headshot.jpg` | IMG_4398.jpg | B&W looking-up shot. Used in hero. |
| `about-editorial.jpg` | feet_up.jpg | Airport photo. Used in about strip. |
| `project-portfolio.png` | project-portfolio.png | Already uploaded. |
| `project-projectr.png` | projectr.png | Already uploaded. |
| `project-jjie.png` | jjie.png | Already uploaded. |

---

## Step-by-step deploy

```bash
# 1. Clone your repo (if you haven't already)
git clone https://github.com/rpschill/rpschill.github.io.git
cd rpschill.github.io

# 2. Remove old files (keep CNAME and Google verification)
git rm -r --cached .
# Then manually delete everything except:
#   CNAME
#   googlefd460deec372d06b.html

# 3. Copy in all new files from this folder
# (everything in ryanschill/ goes to the repo root)

# 4. Create the img directory and add your images
mkdir img
# Copy your renamed images into img/

# 5. Add, commit, push
git add .
git commit -m "Complete redesign — Phase 1-8"
git push origin master
```

GitHub Pages will deploy automatically within ~60 seconds.

---

## Things to fill in after deploy

These are placeholders in the current build:

### Resume (`/resume/`)
- Add exact dates for Capgemini and IBM/ADP roles
- Add Railroad19 bullet points if desired

### Work page (`/work/`)
- The projectr card links to `/work/projectr/` — confirm that path works
  with the existing projectr app at `/projectr/` (different path, no conflict)

### Blog posts (`/writing/`)
- Three posts show "Coming soon" badges
- When ready: replace the badge span with a proper `<a href="/writing/post-slug/">` link
- Each post needs its own `writing/post-slug/index.html` file

### Email
- `ryan@ryanschill.co` is hardcoded throughout — confirm this address is active

---

## Testing checklist before pushing

- [ ] Open `index.html` locally — hero animation plays, headline rotates
- [ ] Theme toggle switches light/dark, persists on refresh
- [ ] All nav links work (no 404s)
- [ ] Resume prints cleanly — open `/resume/`, Cmd+P, check layout
- [ ] All project card images load
- [ ] Mobile nav opens and closes correctly (test at 375px)
- [ ] Tab through the page — focus rings visible on all interactive elements
- [ ] Scroll a case study — reading progress bar appears at top

---

## Post-deploy

Once live at ryanschill.co:

1. **Test View Transitions** — click between pages, should cross-fade smoothly
2. **Check Lighthouse** — run in Chrome DevTools, target 90+ on Performance,
   100 on Accessibility, 100 on Best Practices, 100 on SEO
3. **Submit to Google Search Console** — reindex now that the site is rebuilt
4. **Update LinkedIn** with the new URL (it's the same, but worth a fresh share)
