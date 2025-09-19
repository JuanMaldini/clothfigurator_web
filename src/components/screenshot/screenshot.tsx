import { sendUE } from "../arcware/ps-functions";
import { getCurrentVariation, buildVariationSlug } from "../../state/currentVariation";

type ArcwareApp = {
  getApplicationResponse?: (cb: (response: string) => void) => void;
  webRtcController?: { file?: any };
};
let appRef: ArcwareApp | null = null;
let attached = false;

// One-shot interceptor: when set, a received screenshot will be passed here instead of downloaded.
let screenshotInterceptor: null | ((file: any) => void) = null;
function createFile(file: any) {
  if (!file || !file.data) return;
  try {
    const blob = new Blob(file.data, { type: file.mimetype || "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
  const slug = buildVariationSlug(getCurrentVariation()) || "unassigned";
    a.download = `render_${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        if (!file) return;
        // If interceptor exists, hand over the file without downloading
        if (screenshotInterceptor) {
          const consume = screenshotInterceptor;
          screenshotInterceptor = null; // ensure one-shot
          try {
            consume(file);
          } catch (e) {
            console.warn("screenshot interceptor failed", e);
          }
          return;
        }
        // Default behavior: download
        createFile(file);
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

// Capture screenshot as a Blob without downloading; resolves on next screenshot response.
export function captureScreenshotBlob(): Promise<{ blob: Blob; mimetype: string; extension: string }> {
  return new Promise((resolve, reject) => {
    if (!appRef) {
      reject(new Error("Arcware application not registered yet"));
      return;
    }
    if (screenshotInterceptor) {
      reject(new Error("A screenshot capture is already in progress"));
      return;
    }
    screenshotInterceptor = (file: any) => {
      try {
        const mimetype = file?.mimetype || "image/png";
        const extension = file?.extension || ".png";
        const blob = new Blob(file?.data ?? [], { type: mimetype });
        resolve({ blob, mimetype, extension });
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    };
    try {
      triggerScreenshot();
    } catch (e) {
      screenshotInterceptor = null;
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
}
