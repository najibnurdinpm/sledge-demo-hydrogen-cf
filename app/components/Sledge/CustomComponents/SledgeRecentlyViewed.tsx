import {CustomComponents} from '@sledge-app/core';
import {
  RecentlyViewed,
  RecentlyViewedHeaderDescription,
  RecentlyViewedHeaderTitle,
  RecentlyViewedList,
} from '@sledge-app/react-product-recommendation';
import {SledgeCustom} from '~/components';

interface ISledgeRecentlyViewed {
  productId?: string;
  displayLimit?: number;
  hiddenProductIds?: string[] | number[];
  useSlider?: boolean;
  sectionTitle?: string;
  sectionDescription?: string;
}

export const SledgeRecentlyViewed = (props: ISledgeRecentlyViewed) => {
  const {
    productId,
    displayLimit,
    hiddenProductIds,
    useSlider,
    sectionTitle,
    sectionDescription,
  } = props;
  return (
    <RecentlyViewed
      params={{
        productId,
      }}
      displayLimit={displayLimit}
      hiddenProductIds={hiddenProductIds}
      useSlider={useSlider}
    >
      <CustomComponents
        wishlistWidgetAlert={SledgeCustom.SledgeWishlistWidgetAlert}
        productCard={SledgeCustom.SledgeProductCard}
      />
      <RecentlyViewedHeaderTitle text={sectionTitle} />
      <RecentlyViewedHeaderDescription text={sectionDescription} />
      <RecentlyViewedList gridType="large" />
    </RecentlyViewed>
  );
};
