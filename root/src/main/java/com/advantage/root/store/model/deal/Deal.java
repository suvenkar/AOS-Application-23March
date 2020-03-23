package com.advantage.root.store.model.deal;

import com.advantage.root.store.model.product.Product;

public class Deal {

    public static final String QUERY_GET_ALL = "deal.getAllDeals";
    public static final String QUERY_GET_BY_TYPE = "deal.getByType";

    public static final String FIELD_ID = "id";

    public static final String PARAM_DEAL_TYPE = "DEAL_PARAM_DEALTYPE";
    public static final String PARAM_DEAL_ID = "DEAL_PARAM_DEAL_ID";
    public static final String DEAL_GET_BY_PRODUCT_CATEGORY = "deal.getByProductCategory";

    private Long id;
    private Integer dealType;
    private String description;
    private String promotionHeader;
    private String promotionSubHeader;
    private String staringPrice;
    private String managedImageId;
    private double discount;
    private String dateFrom;
    private String dateTo;

    private Product product;

    public Deal(final Integer dealType, final String description, String promotionHeader,
                String promotionSubHeader, String staringPrice, String managedImageId,
                double discount, String dateFrom, String dateTo,
                final Product product) {
        this.dealType = dealType;
        this.description = description;
        this.product = product;
        this.promotionHeader = promotionHeader;
        this.promotionSubHeader = promotionSubHeader;
        this.staringPrice = staringPrice;
        this.managedImageId = managedImageId;
        this.discount = discount;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }

    public Deal(final DealType dealType, final String description, String promotionHeader,
                String promotionSubHeader, String staringPrice, String managedImageId, double discount, String dateFrom, String dateTo, final Product product) {

        this(dealType.getDealTypeCode(), description, promotionHeader, promotionSubHeader, staringPrice, managedImageId, discount, dateFrom, dateTo,
                product);
    }

    public Deal() {

    }

    public void setId(final Long id) {

        this.id = id;
    }

    public Long getId() {

        return id;
    }

    public void setDealType(final Integer dealType) {

        this.dealType = dealType;
    }

    public Integer getDealType() {

        return dealType;
    }

    public void setDescription(final String description) {

        this.description = description;
    }

    public String getDescription() {

        return description;
    }

    public void setProduct(final Product product) {

        this.product = product;
    }

    public Product getProduct() {

        return product;
    }

    public String getPromotionHeader() {
        return promotionHeader;
    }

    public void setPromotionHeader(String promotionHeader) {
        this.promotionHeader = promotionHeader;
    }

    public String getPromotionSubHeader() {
        return promotionSubHeader;
    }

    public void setPromotionSubHeader(String promotionSubHeader) {
        this.promotionSubHeader = promotionSubHeader;
    }

    public String getStaringPrice() {
        return staringPrice;
    }

    public void setStaringPrice(String staringPrice) {
        this.staringPrice = staringPrice;
    }

    public String getManagedImageId() {
        return managedImageId;
    }

    public void setManagedImageId(String managedImageId) {
        this.managedImageId = managedImageId;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public String getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(String dateFrom) {
        this.dateFrom = dateFrom;
    }

    public String getDateTo() {
        return dateTo;
    }

    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }

}