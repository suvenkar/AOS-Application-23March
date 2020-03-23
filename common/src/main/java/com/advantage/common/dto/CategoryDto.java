package com.advantage.common.dto;

import java.util.List;
import java.util.Set;

public class CategoryDto {
    private Long categoryId;
    private String categoryName;
    private String categoryImageId;
    private PromotedProductDto promotedProduct;
    private List<AttributeDto> attributes;
    private List<ProductDto> products;
    private Set<String> colors;


    public List<AttributeDto> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeDto> attributeItems) {
        this.attributes = attributeItems;
    }

    public Long getCategoryId() {

        return categoryId;
    }

    public void setCategoryId(Long categoryId) {

        this.categoryId = categoryId;
    }

    public String getCategoryName() {

        return categoryName;
    }

    public void setCategoryName(String categoryName) {

        this.categoryName = categoryName;
    }

    public String getCategoryImageId() {

        return categoryImageId;
    }

    public void setCategoryImageId(String managedImageId) {

        this.categoryImageId = managedImageId;
    }

    public List<ProductDto> getProducts() {

        return products;
    }

    public void setProducts(final List<ProductDto> products) {

        this.products = products;
    }

    public PromotedProductDto getPromotedProduct() {
        return promotedProduct;
    }

    public void setPromotedProduct(PromotedProductDto promotedProduct) {
        this.promotedProduct = promotedProduct;
    }

    public Set<String> getColors() {
        return colors;
    }

    public void setColors(Set<String> colors) {
        this.colors = colors;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CategoryDto that = (CategoryDto) o;

        return !(categoryId != null ? !categoryId.equals(that.categoryId) : that.categoryId != null);

    }

    @Override
    public int hashCode() {
        return categoryId != null ? categoryId.hashCode() : 0;
    }
}

