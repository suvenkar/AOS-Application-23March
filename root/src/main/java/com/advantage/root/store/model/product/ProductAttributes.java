package com.advantage.root.store.model.product;

import com.advantage.root.store.model.attribute.Attribute;

/**
 * Created by dalie on 11/9/2015.
 */
public class ProductAttributes {
    private ProductAttributeId primaryKey = new ProductAttributeId();
    private String attributeValue;
    public ProductAttributeId getPrimaryKey() {
        return primaryKey;
    }
    public void setPrimaryKey(ProductAttributeId primaryKey) {
        this.primaryKey = primaryKey;
    }
    public Product getProduct() {
        return getPrimaryKey().getProduct();
    }
    public void setProduct(Product product) {
        primaryKey.setProduct(product);
    }
    public Attribute getAttribute() {
        return primaryKey.getAttribute();
    }
    public void setAttribute(Attribute attribute) {
        primaryKey.setAttribute(attribute);
    }
    public String getAttributeValue() {
        return attributeValue;
    }
    public void setAttributeValue(String attributeValue) {
        this.attributeValue = attributeValue;
    }
}
