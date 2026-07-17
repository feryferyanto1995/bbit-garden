# Deploying bbit-garden to GitHub Pages

The plan: push this project to a new GitHub repository and let GitHub
Actions build the Vite site and publish it to GitHub Pages on every push
to `main`. When you're happy with it, point `thebbitlab.com` here and
retire the old `bbit-site` deployment.

Everything in **Phase 1–3** is safe and reversible. **Phase 4** (the
domain move) is the only step visitors can notice — do it last.

---

## Phase 0 — one-time prerequisites

- A GitHub account (the old site already lives on one — use the same
  account so the domain transfer is painless).
- `gh` CLI authenticated. A bundled copy exists at
  `../.tools/gh_2.96.0_macOS_arm64/bin/gh`. Check with:

  ```bash
  gh auth status || gh auth login
  ```

## Phase 1 — turn the folder into a git repository

From `bbit-garden/`:

```bash
git init -b main
git add -A
git commit -m "bbit garden — initial planting"
```

Notes:
- `.gitignore` already excludes `node_modules/`, `dist/`, and `shots/`
  (screenshots are dev artifacts; they regenerate with `node shots.mjs`).
- `playwright` is a devDependency only used by the screenshot harness;
  it does not ship in the bundle.

## Phase 2 — create the GitHub repo and push

```bash
gh repo create bbit-garden --public --source . --push
```

(Private also works — GitHub Pages on private repos requires a paid plan,
so `--public` is the simple choice for a portfolio.)

## Phase 3 — enable GitHub Pages via Actions

The workflow file is already in the repo:
`.github/workflows/deploy.yml`. It runs `npm ci && npm run build` and
publishes `dist/` with the official `actions/deploy-pages` action.

One-time switch (either way works):

- **CLI**:

  ```bash
  gh api repos/{owner}/bbit-garden/pages -X POST \
    -f build_type=workflow 2>/dev/null \
  || gh api repos/{owner}/bbit-garden/pages -X PUT -f build_type=workflow
  ```

- **UI**: repo → Settings → Pages → "Build and deployment" → Source:
  **GitHub Actions**.

Then push (or re-run the workflow) and the site appears at:

```
https://<username>.github.io/bbit-garden/
```

### Important: the base path

At `https://<username>.github.io/bbit-garden/` the site lives in a
subfolder, so Vite must emit relative asset URLs. The workflow handles
this automatically: it builds with `--base=/bbit-garden/` **unless**
`public/CNAME` exists (custom domain = site at the root, `base=/`).
No manual editing needed in either mode.

## Phase 4 — custom domain (when ready to switch)

The old site (`../bbit-site`) currently owns `thebbitlab.com` via its
`CNAME` file. To move the domain to this site:

1. Add the CNAME file here so every deploy keeps it:

   ```bash
   echo "thebbitlab.com" > public/CNAME
   git add public/CNAME && git commit -m "point thebbitlab.com here" && git push
   ```

2. In the **old** repo, delete its `CNAME` file (or archive the repo /
   disable its Pages) so the two repos don't fight over the domain.

3. In the new repo: Settings → Pages → Custom domain →
   `thebbitlab.com` → save, and tick **Enforce HTTPS** once the
   certificate is issued (can take a few minutes).

4. DNS should already be correct (the domain already points at GitHub
   Pages for the old site): an `ALIAS/A` record to GitHub Pages IPs or a
   `CNAME` to `<username>.github.io`. Nothing to change if the old site
   worked.

Rollback: restore the `CNAME` file in the old repo and remove it here.

## Phase 5 — routine updates

Just commit and push to `main` — the workflow rebuilds and redeploys.

```bash
git add -A && git commit -m "tend the garden" && git push
```

## Verify after each deploy

- Load the Pages URL: cover wordmark assembles, no 404s in devtools.
- Check one deep asset directly (e.g. `/images/photo-2.jpg`).
- Plant a seed, reload — it should still be there (localStorage is
  per-domain, so seeds don't migrate between the github.io URL and
  thebbitlab.com; that's expected).
- Toggle day/dusk; check on a phone.
