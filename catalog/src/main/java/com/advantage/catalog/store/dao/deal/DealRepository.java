package com.advantage.catalog.store.dao.deal;

import com.advantage.catalog.store.model.deal.DealType;
import com.advantage.catalog.store.dao.DefaultCRUDOperations;
import com.advantage.catalog.store.model.deal.Deal;
import com.advantage.catalog.store.model.product.Product;

public interface DealRepository extends DefaultCRUDOperations<Deal> {
    /**
     * Create Deal entity
     *
     * @param dealType           {@link DealType}  deal type
     * @param description        {@link String}  deal description
     * @param promotionHeader    {@link String}  promotion header
     * @param promotionSubHeader {@link String} promotion subheader
     * @param staringPrice       {@link String} deal price
     * @param managedImageId     {@link String} image URL
     * @param discount           {@link Double} discount value
     * @param dateFrom           {@link String} the start date of the deal
     * @param dateTo             {@link String} date when the deal expires
     * @param product            {@link Product} product of a deal
     * @return entity reference of a new Deal
     */
    Deal create(DealType dealType, String description, String promotionHeader,
                String promotionSubHeader, String staringPrice, String managedImageId,
                double discount, String dateFrom, String dateTo,
                Product product);

    /**
     * Get deal of the day
     *
     * @return entity reference of a Deal
     */
    Deal getDealOfTheDay();

    Deal getDealOfTheDay(Long categoryId);
}