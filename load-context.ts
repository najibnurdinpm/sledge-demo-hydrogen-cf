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
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = async ({
  context,
  request
}: {
  request: Request;
	context: {
		cloudflare: Omit<
			PlatformProxy<Env, IncomingRequestCfProperties>,
			'dispose' | 'caches'
		> & {
			caches:
				| PlatformProxy<Env, IncomingRequestCfProperties>['caches']
				| CacheStorage;
		};
	};
}) => {

  const [session] = await Promise.all([
    HydrogenSession.init(request, [context.cloudflare.env.SESSION_SECRET as string]),
  ]);

  const storefront = createStorefrontClient({
    buyerIp: request.headers.get('x-forwarded-for') ?? undefined,
    i18n: getLocaleFromRequest(request),
    privateStorefrontToken: context.cloudflare.env.PRIVATE_ADMIN_API_TOKEN,
    publicStorefrontToken: context.cloudflare.env.PUBLIC_STOREFRONT_API_TOKEN,
    storeDomain: `https://${context.cloudflare.env.PUBLIC_STORE_DOMAIN}`,
  }).storefront

  const cart = createCartHandler({
    storefront,
    getCartId: cartGetIdDefault(request.headers),
    setCartId: cartSetIdDefault(),
  });

  return {
    ...context,
    env:context.cloudflare.env,
    session,
    storefront,
    cart,
  };
};
