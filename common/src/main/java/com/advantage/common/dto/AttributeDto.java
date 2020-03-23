package com.advantage.common.dto;

import java.util.*;

public class AttributeDto {

    private String attributeName;
    private Set<String> attributeValues;

    public AttributeDto() {
    }

    public AttributeDto(String attributeName, Set<String> attributeValues) {
        this.attributeName = attributeName;
        this.attributeValues = attributeValues;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public Set<String> getAttributeValues() {
        return attributeValues;
    }

    public void setAttributeValues(Set<String> attributeValues) {
        this.attributeValues = attributeValues;
    }
}