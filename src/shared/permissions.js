import OBR from "@owlbear-rodeo/sdk";

async function getPlayerRole() {
  return OBR.player.getRole();
}

export async function isGM() {
  return (await getPlayerRole()) === "GM";
}
