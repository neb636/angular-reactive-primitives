/// <reference types="vite/client" />

// Support for importing TypeScript files as raw text
declare module '*.ts?raw' {
  const content: string;
  export default content;
}

declare module '*.composable.ts?raw' {
  const content: string;
  export default content;
}

declare module '*.effect.ts?raw' {
  const content: string;
  export default content;
}
