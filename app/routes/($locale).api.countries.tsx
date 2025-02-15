import {json} from '@remix-run/cloudflare';

import {CACHE_LONG} from '~/data/cache';
import {countries} from '~/data/countries';

export async function loader() {
  return json(
    {
      ...countries,
    },
    {
      headers: {
        'cache-control': 'no-store',
      },
    },
  );
}

// no-op
export default function CountriesApiRoute() {
  return null;
}
