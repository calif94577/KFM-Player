import OBR from "@owlbear-rodeo/sdk";

OBR.onReady(() => {
  // Register the action with a popover
  OBR.action.setTitle("Kenku FM Player");
  OBR.action.setIcon("/speaker.svg");
});