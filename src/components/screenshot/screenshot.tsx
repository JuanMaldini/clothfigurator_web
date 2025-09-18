import { sendUE } from "../arcware/ps-functions";

type ArcwareApp = {
  getApplicationResponse?: (cb: (response: string) => void) => void;
  webRtcController?: { file?: any };
};
let appRef: ArcwareApp | null = null;
let attached = false;
let counter = 1;
function createFile(file: any) {
  if (!file || !file.data) return;
  try {
    const blob = new Blob(file.data, { type: file.mimetype || "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const num = String(counter).padStart(2, "0");
    a.download = `screenshot${num}${file.extension || ".png"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    counter++;
  } catch (e) {
    console.warn("createFile failed", e);
  }
}
export function registerScreenshotApplication(app: ArcwareApp) {
  appRef = app;
  if (attached) return;
  attached = true;
  try {
    app.getApplicationResponse?.((response: string) => {
      if (typeof response === "string" && response.startsWith("CreateScreenshot")) {
        const file = appRef?.webRtcController?.file;
        if (file) createFile(file);
      }
    });
  } catch (e) {
    console.warn("registerScreenshotApplication failed", e);
  }
}
export function triggerScreenshot() {
  // Central place for payload shape
  try {
    sendUE({ CreateScreenshot: "CreateScreenshot" });
  } catch (e) {
    console.warn("triggerScreenshot failed", e);
  }
}
