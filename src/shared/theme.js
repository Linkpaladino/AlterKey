import OBR from "@owlbear-rodeo/sdk";

function applyTheme(theme) {
  const root = document.documentElement;

  root.dataset.theme = theme.mode.toLowerCase();
  root.style.setProperty("--ak-primary", theme.primary.main);
  root.style.setProperty("--ak-primary-contrast", theme.primary.contrastText);
  root.style.setProperty("--ak-background", theme.background.default);
  root.style.setProperty("--ak-surface", theme.background.paper);
  root.style.setProperty("--ak-text", theme.text.primary);
  root.style.setProperty("--ak-text-secondary", theme.text.secondary);
  root.style.setProperty("--ak-text-disabled", theme.text.disabled);
}

export async function initializeTheme() {
  applyTheme(await OBR.theme.getTheme());
  OBR.theme.onChange(applyTheme);
}
