# Release process

## 1. Manual QA

Complete every applicable item in `docs/TESTING.md` using the release candidate source.

The release candidate should be tested locally first. Mobile checks can be completed later using the hosted preview deployment.

## 2. Validate and build

```bash
npm run verify
npm run build
```

Confirm that `dist/` contains:

- `index.html`
- `settings.html`
- `variants.html`
- `manifest.json`
- `icons/alterkey.svg`
- `icons/alterkey-icon.png`
- bundled assets

## 3. Test the production build locally

```bash
npm run preview
```

Install the previewed `manifest.json` in Owlbear Rodeo and repeat the core GM/PLAYER smoke tests.

Confirm that the production build behaves the same as the development version before pushing the release candidate.

## 4. Push the release branch

Confirm that `README.md`, `CHANGELOG.md`, `LICENSE`, and the files in `docs/` match the release candidate.

Push the `v1.1.0` branch to GitHub:

```bash
git add .
git commit -m "Release AlterKey v1.1.0"
git push -u origin v1.1.0
```

If the branch is already tracking the remote, use:

```bash
git push
```

Do not merge into `main` yet.

## 5. Vercel preview deployment

Wait for Vercel to create a preview deployment for the `v1.1.0` branch.

Use the preview deployment's public `manifest.json` URL to install the release candidate in Owlbear Rodeo.

The production URL must remain unchanged while preview testing is in progress.

## 6. Hosted QA

Repeat the relevant production checklist using the Vercel preview deployment.

At minimum, verify:

- core shortcuts;
- Mirror;
- variant switching;
- per-variant scale;
- `Replace Image` synchronization;
- base variant reordering;
- full-card drag and drop;
- Copy / Paste;
- GM and PLAYER permissions;
- English and Portuguese;
- light and dark themes;
- desktop;
- at least one touch/mobile device.

Do not continue to production if a release-blocking regression is found.

## 7. Merge to production

Once hosted QA passes, merge the `v1.1.0` branch into `main`.

After the merge, push `main` to GitHub and confirm that Vercel deploys the new production build to:

```text
https://alter-key.vercel.app
```

Install the production manifest and perform one final smoke test:

```text
https://alter-key.vercel.app/manifest.json
```

## 8. Finalize the release

Once the production deployment passes the final smoke test:

- add the release date to the `1.1.0` entry in `CHANGELOG.md`;
- commit and push the final release metadata if the date was added after the production test;
- create the `v1.1.0` Git tag;
- push the tag to GitHub;
- publish the GitHub Release using the relevant `CHANGELOG.md` notes.

Store/showcase submission can be prepared separately after the public extension URL is stable.
