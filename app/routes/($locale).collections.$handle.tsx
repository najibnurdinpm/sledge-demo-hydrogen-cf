import {useLoaderData, useLocation} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer} from '@remix-run/cloudflare';
import {CustomComponents} from '@sledge-app/core';
import {ProductFilterWidget} from '@sledge-app/react-instant-search';
import {useEffect, useState} from 'react';
import {SledgeCustom} from '~/components';
import * as gtag from '~/lib/gtags.client';

export async function loader({params, context}: any) {
  const {handle} = params;
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
    },
  });

  // console.log('collection', collection)
  

  console.log('ProductFilterWidget', parseGid(collection?.id).id)

  if (!collection && handle !== 'all') {
    throw new Response(null, {status: 404});
  }

  return defer({
    collection,
  });
}

const seo = ({data}: any) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export default function Collection() {
  const {collection} = useLoaderData();
  const {pathname} = useLocation();
  const [isTracked, setTracked] = useState(false);

  useEffect(() => {
    if (!isTracked) {
      setTracked(true);
    } else {
      gtag.event({
        action: 'view_product_filter_app',
        category: 'apps',
        label: `view_product_filter_app`,
        value: pathname,
      });
    }
  }, [isTracked]);

  return (
    <div
      key={collection?.id}
      className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0"
    >
      <ProductFilterWidget
        query={{
          keyword: 'q',
        }}
        params={{
          collectionId: Number(parseGid(collection?.id).id),
        }}
      >
        <CustomComponents productCard={SledgeCustom.SledgeProductCard} />
      </ProductFilterWidget>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
    }
  }
`;
