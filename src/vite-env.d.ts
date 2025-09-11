/// <reference types="vite/client" />

// Allow importing global CSS files (e.g., from libraries)
declare module "react-color-palette/css" {
  const content: any;
  export default content;
}

// Allow importing local CSS files from TS/TSX when not using CSS modules
declare module "*.css" {
  const content: string;
  export default content;
}
