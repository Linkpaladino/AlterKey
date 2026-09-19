# AlterKey

*Token shortcuts, variants, and quick actions.*

AlterKey is an Owlbear Rodeo extension for faster, more flexible token control. It adds keyboard shortcuts for mirroring token images, switching between token variants, managing reusable variant sets, and performing common token actions without interrupting the table flow.

## Features

- Press `V` to activate the AlterKey tool.
- Press `1` to mirror selected image tokens horizontally.
- Press `2` through `9` to switch between up to eight token variants.
- Hold `Shift` and click tokens while AlterKey is active to add or remove them from the current selection.
- Keep slot `2` as the token's fixed base image.
- Add, remove, and reorder slots `3–9` as GM.
- Copy slots `3–9` from one token and paste them onto one or more destination tokens while preserving each destination's base image.
- Enable or disable Mirror, Variants, and Copy / Paste per room from the AlterKey settings panel.
- Use the interface in English or Portuguese (Brazil). English is the default language.
- Follow Owlbear Rodeo light and dark themes.

## Permissions

Players can use Mirror and switch variants when Owlbear Rodeo grants them update permission for the selected token.

Variant management, reordering, and Copy / Paste are GM-only operations.

## Shortcuts

| Key | Action |
| --- | --- |
| `V` | Activate AlterKey |
| `1` | Mirror selected image token(s) |
| `2–9` | Switch to the matching variant slot |
| `Shift + Click` | Add or remove a token from the current selection |

## Local development

AlterKey uses the Owlbear Rodeo SDK and Vite 8.

Requirements:

- Node.js 20.19+ or 22.12+
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then add the local manifest to Owlbear Rodeo:

```text
http://localhost:5173/manifest.json
```

## Project checks

Run the lightweight project validation before building:

```bash
npm run verify
```

It checks package and manifest versions, required entry files, icon availability, and translation-key parity between English and Portuguese.

## Production build

```bash
npm run build
```

The production output is generated in `dist/` and includes the background page, settings popover, variants embed, manifest, and public assets.

## Project structure

```text
src/
├── config/
├── features/
│   ├── mirror/
│   ├── settings/
│   └── variants/
├── i18n/
├── shared/
└── tools/
```

Business rules live outside UI rendering code. Shared Owlbear utilities, room settings, translations, and feature-specific logic remain separated so each part can evolve independently.

## Testing

See [`docs/TESTING.md`](docs/TESTING.md) for the release checklist covering GM/PLAYER behavior, themes, languages, desktop, touch, clipboard behavior, and room states.

## Author

Created by **Linkpaladino**.

## License

AlterKey is released under the MIT License. See [`LICENSE`](LICENSE).
