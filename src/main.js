console.log("main.js loaded");

if (typeof window.OBR !== "undefined" && window.OBR) {
  console.log("OBR detected, initializing...");
  window.OBR.onReady(() => {
    console.log("OBR ready");
    window.OBR.action.setTitle("Kenku FM Player");
    window.OBR.action.setIcon("/speaker.svg"); // Or /dog.svg
  });
} else {
  console.log("OBR not available - expected in Owlbear Rodeo only");
}