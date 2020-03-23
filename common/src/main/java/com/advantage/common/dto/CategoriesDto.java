package com.advantage.common.dto;

import java.util.List;
import java.util.Set;

/**
 * @author Binyamin Regev on 15/03/2016.
 */
public class CategoriesDto {
    private Long categoryId;
    private String categoryName;
    private String categoryImageId;
    private PromotedProductDto promotedProduct;
    private List<AttributeDto> attributes;
    private List<CategoryProductDto> products;
    private Set<String> colors;

    public CategoriesDto() {
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

    public void setCategoryImageId(String categoryImageId) {
        this.categoryImageId = categoryImageId;
    }

    public PromotedProductDto getPromotedProduct() {
        return promotedProduct;
    }

    public void setPromotedProduct(PromotedProductDto promotedProduct) {
        this.promotedProduct = promotedProduct;
    }

    public List<AttributeDto> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeDto> attributes) {
        this.attributes = attributes;
    }

    public List<CategoryProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<CategoryProductDto> products) {
        this.products = products;
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

        CategoriesDto that = (CategoriesDto) o;

        return !(categoryId != null ? !categoryId.equals(that.categoryId) : that.categoryId != null);
    }

    @Override
    public int hashCode() {
        return categoryId != null ? categoryId.hashCode() : 0;
    }
}
