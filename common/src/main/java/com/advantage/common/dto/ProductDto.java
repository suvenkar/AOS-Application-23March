package com.advantage.common.dto;

import com.advantage.common.enums.ProductStatusEnum;

import java.util.*;

public class ProductDto {
    private Long productId;
    private Long categoryId;
    private String productName;
    private double price;
    private String description;
    private String imageUrl;
    private List<AttributeItem> attributes;
    private List<ColorAttributeDto> colors;
    private List<String> images;
    private String productStatus;

    public ProductDto() {
    }

    public ProductDto(Long productId,
                      Long categoryId,
                      String productName,
                      double price,
                      String description,
                      String imageUrl,
                      List<AttributeItem> attributes,
                      List<ColorAttributeDto> colors,
                      List<String> images) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.attributes = attributes;
        setColors( colors);
        setImages(images);
        this.productStatus= ProductStatusEnum.ACTIVE.getStringCode();
    }

    public ProductDto(Long productId,
                      Long categoryId,
                      String productName,
                      double price,
                      String description,
                      String imageUrl,
                      List<AttributeItem> attributes,
                      List<ColorAttributeDto> colors,
                      List<String> images, String productStatus ) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.attributes = attributes;
        setColors( colors);
        setImages(images);
        this.productStatus= productStatus;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
        images.sort((a,b)->a.compareTo(b));
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

    public List<ColorAttributeDto> getColors() {
        return colors;
    }

    public void setColors(List<ColorAttributeDto> colors) {
        colors.sort((a,b) -> a.getName().compareTo(b.getName()));
        this.colors = colors;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductStatus() { return productStatus; }

    public void setProductStatus(String productStatus) { this.productStatus = productStatus; }
}