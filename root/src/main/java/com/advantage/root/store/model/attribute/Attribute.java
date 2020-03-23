package com.advantage.root.store.model.attribute;

import com.advantage.root.store.model.product.ProductAttributes;

import java.util.HashSet;
import java.util.Set;

public class Attribute {

    public static final String FIELD_ID = "attribute_id";
    public static final String PARAM_ID = "ATTRIBUTE_PARAM_ID";
    public static final String QUERY_GET_ALL = "attribute.GetAll";
    public static final String QUERY_ATTRIBUTE_GET_BY_NAME = "attribute.GetByName";
    public static final String PARAM_ATTRIBUTE_NAME = "PARAM_ATTRIBUTE_NAME";

    private Long id;
    private String name;
    private Set<ProductAttributes> productAttributes = new HashSet<>();

    public Attribute() {
    }

    public Attribute(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name.toUpperCase();
    }

    public Set<ProductAttributes> getProductAttributes() {
        return productAttributes;
    }

    public void setProductAttributes(Set<ProductAttributes> products) {
        this.productAttributes = products;
    }
}