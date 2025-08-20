// Central Arcware configuration (single place to change values)
export const ARCWARE_SHARE_ID = 'share-0be4620b-77aa-42b1-98cb-f7ee61be443';
export const ARCWARE_AUTO_CONNECT = true;
export const ARCWARE_OPTIONS = {
  initialSettings: { AutoConnect: ARCWARE_AUTO_CONNECT },
  settings: {}
};

// --- Application reference handling ---
// Se guarda la instancia para poder enviar inputs luego sin re-inicializar.
// Tipo la dejamos como any para no acoplar fuerte mientras tanto.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _arcwareApplication: any | null = null;

// Guardar instancia (llamado desde APlayer después de ArcwareInit)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setArcwareApplication(app: any) {
  _arcwareApplication = app;
}

// Obtener instancia (por si se necesita directamente)
export function getArcwareApplication() {
  return _arcwareApplication;
}

// Enviar interacción genérica a Unreal (descriptor puede ser objeto o string)
export function sendUIInteraction(descriptor: object | string) {
  if (!_arcwareApplication) {
    console.warn('[Arcware] Application no inicializada todavía. Ignorando interacción:', descriptor);
    return;
  }
  try {
    _arcwareApplication.emitUIInteraction(descriptor);
  } catch (e) {
    console.error('[Arcware] Error enviando interacción', e, descriptor);
  }
}

// Helper pequeño para construir un comando estándar (puedes ajustarlo a tu formato UE)
export function buildInteraction(
  collection: string, 
  subcollection: string,
  name: string,
  variation: string
) {
  return {
    type: 'interact',
    payload: { collection, subcollection, name, variation }
  };
}

