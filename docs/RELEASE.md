# Release process

## 1. Manual QA

Complete every applicable item in `docs/TESTING.md` using the release candidate source.

Mobile checks may remain pending until the extension is available from a hosted URL.

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
- `icons/alterkey-icon.png`
- bundled assets

## 3. Test the production build

```bash
npm run preview
```

Install the previewed `manifest.json` in Owlbear Rodeo and repeat the core GM/PLAYER smoke tests.

## 4. GitHub

Create the public `alterkey` repository and push the release source.

Before publishing a release, confirm that `README.md`, `CHANGELOG.md`, `LICENSE`, and the files in `docs/` match the current version.

## 5. Hosting

Deploy the project as a static site using:

- Build command: `npm run build`
- Publish directory: `dist`

The hosting provider must expose the built `manifest.json` and all generated assets over HTTPS.

## 6. Hosted QA

Install the hosted `manifest.json` URL in Owlbear Rodeo and repeat the production checklist.

At this stage, complete the mobile tests that are not practical while using `localhost`.

## 7. Release

Once hosted QA passes:

- add the release date to the `1.0.0` entry in `CHANGELOG.md`;
- create the `v1.0.0` Git tag;
- publish the GitHub release using the relevant `CHANGELOG.md` notes.

Store/showcase submission can be prepared separately after the public extension URL is stable.
