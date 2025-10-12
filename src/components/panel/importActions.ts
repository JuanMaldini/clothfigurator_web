export type PickedFile = {
  file: File;
  objectUrl: string; // revoke with URL.revokeObjectURL when no longer needed
};

// Generic file picker with modern API fallback
async function pickSingleFile(accept: string): Promise<File | null> {
  const anyWin = window as any;
  try {
    if (typeof anyWin.showOpenFilePicker === "function") {
      const [handle] = await anyWin.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: accept,
            accept: { "*/*": accept.split(",").map((s) => s.trim()) },
          },
        ],
        excludeAcceptAllOption: false,
      });
      if (!handle) return null;
      const file: File = await handle.getFile();
      return file || null;
    }
  } catch (err) {
    // fall through to input fallback
  }

  // Fallback: hidden input
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.position = "fixed";
    input.style.left = "-10000px";
    document.body.appendChild(input);

    const cleanup = () => {
      input.removeEventListener("change", onChange);
      if (input.parentNode) input.parentNode.removeChild(input);
    };

    const onChange = () => {
      const file = input.files && input.files[0] ? input.files[0] : null;
      cleanup();
      resolve(file);
    };

    input.addEventListener("change", onChange);
    input.click();
  });
}

async function asPickedFile(file: File | null): Promise<PickedFile | null> {
  if (!file) return null;
  const objectUrl = URL.createObjectURL(file);
  return { file, objectUrl };
}

// Accepted formats can be expanded based on pipeline support
const MODEL_ACCEPT = ".fbx,.glb";
const TEXTURE_ACCEPT = ".png,.jpg,.jpeg";

export async function importModel(
  onPicked?: (picked: PickedFile) => void
): Promise<PickedFile | null> {
  const picked = await asPickedFile(await pickSingleFile(MODEL_ACCEPT));
  if (picked) {
    try {
      onPicked?.(picked);
    } catch {}
    // For now, only log. Integrations (upload/sendUE) can be added later.
    // eslint-disable-next-line no-console
    console.log("Model selected:", picked.file.name, picked.file.size);
  }
  return picked;
}

export async function importTexture(
  onPicked?: (picked: PickedFile) => void
): Promise<PickedFile | null> {
  const picked = await asPickedFile(await pickSingleFile(TEXTURE_ACCEPT));
  if (picked) {
    try {
      onPicked?.(picked);
    } catch {}
    // eslint-disable-next-line no-console
    console.log("Texture selected:", picked.file.name, picked.file.size);
  }
  return picked;
}
