import { onRequest as ____path___ts_onRequest } from "D:\\cloudflare\\hydrogen-last\\functions\\[[path]].ts"

export const routes = [
    {
      routePath: "/:path*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____path___ts_onRequest],
    },
  ]