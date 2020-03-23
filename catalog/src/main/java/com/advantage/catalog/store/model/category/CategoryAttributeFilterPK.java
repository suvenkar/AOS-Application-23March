package com.advantage.catalog.store.model.category;

import java.io.Serializable;


/**
 * Created by ostrovsm on 31/01/2016.
 */
public class CategoryAttributeFilterPK implements Serializable {

    private Long categoryId;
    private Long attributeId;

    public CategoryAttributeFilterPK(){}

    public CategoryAttributeFilterPK(long categoryId, long attributeId){
        this.categoryId=categoryId;
        this.attributeId=attributeId;
    }

    public Long getCategoryId() { return categoryId;  }

    public void setCategoryId(Long categoryId) {this.categoryId = categoryId; }

    public Long getAttributeId() { return attributeId; }

    public void setAttributeId(Long attributeId) { this.attributeId = attributeId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CategoryAttributeFilterPK that = (CategoryAttributeFilterPK) o;

        if (!categoryId.equals(that.categoryId)) return false;
        return attributeId.equals(that.attributeId);

    }

    @Override
    public int hashCode() {
        int result = categoryId.hashCode();
        result = 31 * result + attributeId.hashCode();
        return result;
    }
}







