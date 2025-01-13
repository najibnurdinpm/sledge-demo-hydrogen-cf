import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import { getLoadContext } from "./load-context";

import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy({getLoadContext}),
    hydrogen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      buildDirectory: 'build',
    }),
    tsconfigPaths(),
  ]
});
