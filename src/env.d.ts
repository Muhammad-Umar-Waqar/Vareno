/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PS_STORE_URL?: string;
  readonly PUBLIC_XBOX_STORE_URL?: string;
  readonly PUBLIC_ROCKSTAR_URL?: string;
  readonly PUBLIC_AD_HEIGHT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    runtime?: {
      env?: {
        RUNCOMFY_TOKEN?: string;
      };
    };
  }
}
