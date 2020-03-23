package com.advantage.common.dto;

/**
 * Describes the {@code Category} {@code Product} {@code attribute} in the {@code CategoryProductDTO}.
 * @author Binyamin Regev on 14/03/2016.
 */
public class CategoryProductAttributeItem {
    private String attributeName;
    private String attributeValue;
    private boolean showInFilter;

    public CategoryProductAttributeItem() {
    }

    public CategoryProductAttributeItem(String attributeName, String attributeValue) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
        this.showInFilter = false;
    }

    public CategoryProductAttributeItem(String attributeName, String attributeValue, boolean showInFilter) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
        this.showInFilter = showInFilter;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(String attributeValue) {
        this.attributeValue = attributeValue;
    }

    public boolean isShowInFilter() {
        return showInFilter;
    }

    public void setShowInFilter(boolean showInFilter) {
        this.showInFilter = showInFilter;
    }
}
