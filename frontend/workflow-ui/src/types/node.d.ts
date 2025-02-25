/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare module 'vitest' {
  export * from 'vitest/vitest-environment-jsdom';
}

declare module '@testing-library/jest-dom';

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_KEYCLOAK_URL: string;
    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
    VITE_KEYCLOAK_URL: string;
    VITE_KEYCLOAK_REALM: string;
    VITE_KEYCLOAK_CLIENT_ID: string;
    [key: string]: string | undefined;
  }
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
