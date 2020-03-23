package com.advantage.catalog.store.model.product;

import com.advantage.catalog.store.model.attribute.Attribute;

import javax.persistence.*;

/**
 * @author Eli Dali on 09/11/2015.
 */
@Entity
@Table(name = "PRODUCT_ATTRIBUTES")
@AssociationOverrides({
        @AssociationOverride(name = "primaryKey.product",
                joinColumns = @JoinColumn(name = "product_id")),
        @AssociationOverride(name = "primaryKey.attribute",
                joinColumns = @JoinColumn(name = "attribute_id"))
})
public class ProductAttributes {
    private ProductAttributeId primaryKey = new ProductAttributeId();

    private String attributeValue;

    @EmbeddedId
    public ProductAttributeId getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(ProductAttributeId primaryKey) {
        this.primaryKey = primaryKey;
    }

    @Transient
    public Product getProduct() {
        return getPrimaryKey().getProduct();
    }

    public void setProduct(Product product) {
        primaryKey.setProduct(product);
    }

    @Transient
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
