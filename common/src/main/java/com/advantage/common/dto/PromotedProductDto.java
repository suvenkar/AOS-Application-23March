package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class PromotedProductDto {

    private Long id;
    private String staringPrice;
    private String promotionHeader;
    private String promotionSubHeader;
    private String promotionImageId;
    @JsonIgnore
    private ProductDto product;
    private String productName;
    private double price;
    private String color;
    private String description;
    private String imageUrl;
    private List<AttributeItem> attributes;

    public PromotedProductDto() {
    }

    public PromotedProductDto(String staringPrice, String promotionHeader, String promotionSubHeader,
                              String promotionImageId, ProductDto product) {
        this.staringPrice = staringPrice;
        this.promotionHeader = promotionHeader;
        this.promotionSubHeader = promotionSubHeader;
        this.promotionImageId = promotionImageId;
        this.product = product;
        this.productName = product.getProductName();
        this.price = product.getPrice();
        this.description = product.getDescription();
        this.imageUrl = product.getImageUrl();
        this.attributes = product.getAttributes();
        this.id = product.getProductId();
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<AttributeItem> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeItem> attributes) {
        this.attributes = attributes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductDto getProduct() {
        return product;
    }

    public void setProduct(ProductDto product) {
        this.product = product;
    }

    public String getStaringPrice() {
        return staringPrice;
    }

    public void setStaringPrice(String staringPrice) {
        this.staringPrice = staringPrice;
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

    public String getPromotionImageId() {
        return promotionImageId;
    }

    public void setPromotionImageId(String promotionImageId) {
        this.promotionImageId = promotionImageId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
