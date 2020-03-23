package com.advantage.root.store.model.product;

/**
 * Created by dalie on 11/9/2015.
 */

import com.advantage.root.store.model.attribute.Attribute;

import java.io.Serializable;


public class ProductAttributeId implements Serializable {
    private Product product;
    private Attribute attribute;
    public Product getProduct() {
        return product;
    }
    public void setProduct(Product product) {
        this.product = product;
    }
    public Attribute getAttribute() {
        return attribute;
    }
    public void setAttribute(Attribute attribute) {
        this.attribute = attribute;
    }
}
