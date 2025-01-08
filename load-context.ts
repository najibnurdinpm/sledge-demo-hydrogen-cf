import { type AppLoadContext } from "@remix-run/cloudflare";
import { type PlatformProxy } from "wrangler";
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
} from '@shopify/hydrogen';
import {HydrogenSession} from './app/lib/session.server';
import {getLocaleFromRequest} from './app/lib/i18n';

interface Env {}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    extra: string; // augmented
  }
}

type GetLoadContext = (args: {
  request: Request;
  env: Env,
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = async ({
  context,
  request
}) => {

  const [session] = await Promise.all([
    HydrogenSession.init(request, [process.env.SESSION_SECRET as string]),
  ]);

  const env: Env = {
    SESSION_SECRET: '',
    PUBLIC_STOREFRONT_API_TOKEN: '',
    PRIVATE_STOREFRONT_API_TOKEN: '',
    PUBLIC_STORE_DOMAIN: '',
    PRIVATE_ADMIN_API_TOKEN: '',
    PRIVATE_ADMIN_API_VERSION: '',
    PUBLIC_STOREFRONT_ID: '',
    SLEDGE_API_KEY: '',
    SLEDGE_INSTANT_SEARCH_API_KEY: '',
    GA_TRACKING_ID: '',
  };
  
  env.SESSION_SECRET = process.env.SESSION_SECRET as string;
  env.PUBLIC_STOREFRONT_API_TOKEN = process.env
    .PUBLIC_STOREFRONT_API_TOKEN as string;
  env.PRIVATE_STOREFRONT_API_TOKEN = process.env
    .PRIVATE_STOREFRONT_API_TOKEN as string;
  env.PUBLIC_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN as string;
  env.PRIVATE_ADMIN_API_TOKEN = process.env.PRIVATE_ADMIN_API_TOKEN as string;
  env.PRIVATE_ADMIN_API_VERSION = process.env
    .PRIVATE_ADMIN_API_VERSION as string;
  env.SLEDGE_API_KEY = process.env.SLEDGE_API_KEY;
  env.SLEDGE_INSTANT_SEARCH_API_KEY =
    process.env.SLEDGE_INSTANT_SEARCH_API_KEY;
  env.GA_TRACKING_ID = process.env.GA_TRACKING_ID;

  const storefront = createStorefrontClient({
    buyerIp: request.headers.get('x-forwarded-for') ?? undefined,
    i18n: getLocaleFromRequest(request),
    privateStorefrontToken: process.env.PRIVATE_ADMIN_API_TOKEN,
    publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    storeDomain: `https://${process.env.PUBLIC_STORE_DOMAIN}`,
  }).storefront

  const cart = createCartHandler({
    storefront,
    getCartId: cartGetIdDefault(request.headers),
    setCartId: cartSetIdDefault(),
  });

  return {
    ...context,
    env,
    session,
    storefront,
    cart,
  };
};
