package com.advantage.catalog.store.model.product;

/**
 * @author Eli Dali 09/11/2015.
 */

import com.advantage.catalog.store.model.attribute.Attribute;

import javax.persistence.CascadeType;
import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.io.Serializable;

 @Embeddable
public class ProductAttributeId implements Serializable {
    private Product product;
    private Attribute attribute;

    @ManyToOne(cascade = CascadeType.ALL)
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    @ManyToOne(cascade = CascadeType.ALL)
    public Attribute getAttribute() {
        return attribute;
    }

    public void setAttribute(Attribute attribute) {
        this.attribute = attribute;
    }
}
