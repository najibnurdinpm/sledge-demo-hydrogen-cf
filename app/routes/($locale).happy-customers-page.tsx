import {Link} from '@remix-run/react';
import {CustomComponents} from '@sledge-app/core';
import {HappyCustomersPage} from '@sledge-app/react-product-review';
import {useEffect, useState} from 'react';
import * as gtag from '~/lib/gtags.client';

export default function HappyCustomersPageRoute() {
  const [isTracked, setTracked] = useState(false);

  useEffect(() => {
    if (!isTracked) {
      setTracked(true);
    } else {
      gtag.event({
        action: 'view_happy_customer_page_app',
        category: 'apps',
        label: `view_happy_customer_page_app`,
      });
    }
  }, [isTracked]);

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 mt-[10px] lg:mt-[40.5px]">
      <HappyCustomersPage.Root>
        <CustomComponents
          reviewProductInfo={({product}: any) => {
            const {name, handle = '#'} = product || {};

            return (
              <div className="sledge-product-review__widget-about-product-text">
                About{' '}
                <Link
                  className="sledge-product-review__widget-about-product-link"
                  to={'/products/' + handle}
                  onClick={(e) => e.stopPropagation()}
                >
                  {name}
                </Link>
              </div>
            );
          }}
        />
        <HappyCustomersPage.Header />
        <HappyCustomersPage.List />
      </HappyCustomersPage.Root>
    </div>
  );
}
