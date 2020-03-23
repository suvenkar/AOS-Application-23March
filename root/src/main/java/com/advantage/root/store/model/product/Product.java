package com.advantage.root.store.model.product;

import com.advantage.root.store.model.category.Category;

import java.util.HashSet;
import java.util.Set;

public class Product {
    public static final String QUERY_GET_ALL = "product.getAll";

    public static final String FIELD_ID = "product_id";
    public static final String FIELD_CATEGORY_ID = "category.categoryId";

    public static final String PARAM_ID = "PARAM_PRODUCT_ID";
    public static final String PARAM_CATEGORY_ID = "PARAM_PRODUCT_CATEGORY_ID";
    public static final String PRODUCT_FILTER_BY_NAME = "product.FilterByName";
    public static final String GETFILTEREDPRODUCTS = "getfilteredproducts";
    public static final String PROCEDURE_PROD = "procedure_prod";

    private Long id;

    private String productName;
    private double price;
    private String description;

    private String managedImageId;

    private Category category;

    private Set<ProductAttributes> productAttributes = new HashSet<>();

    private Set<ColorAttribute> colors = new HashSet<>();

    private Set<ImageAttribute> images = new HashSet<>();

    public Product() {
    }

    public Product(String name, String description, int price) {
        this.productName = name;
        this.description = description;
        this.price = price;
    }

    public Product(String name, String description, double price, Category category) {
        this.productName = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Product(String name) {
        this.productName = name;
    }

    public String getProductName() {

        return productName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getManagedImageId() {
        return managedImageId;
    }

    public void setManagedImageId(String managedImageId) {
        this.managedImageId = managedImageId;
    }

    public Set<ColorAttribute> getColors() {
        return colors;
    }

    public void setColors(Set<ColorAttribute> colors) {
        this.colors = colors;
    }

    public Set<ImageAttribute> getImages() {
        return images;
    }

    public void setImages(Set<ImageAttribute> images) {
        this.images = images;
    }

    public Set<ProductAttributes> getProductAttributes() {
        return productAttributes;
    }

    public void setProductAttributes(Set<ProductAttributes> attributes) {
        this.productAttributes = attributes;
    }
}