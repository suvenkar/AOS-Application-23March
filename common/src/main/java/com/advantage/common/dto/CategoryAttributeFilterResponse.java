package com.advantage.common.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.ArrayList;
import java.util.List;


/**
 * @author Moti Ostrovski on 01/02/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class CategoryAttributeFilterResponse {

    private List<CategoryAttributeShowInFilter> categoriesAttributes = new ArrayList<>();

    public CategoryAttributeFilterResponse() {
    }

    public CategoryAttributeFilterResponse(List<CategoryAttributeShowInFilter> categoriesAttributes) {
        this.categoriesAttributes = categoriesAttributes;
    }

    public List<CategoryAttributeShowInFilter> getCategoriesAttributes() {
        return categoriesAttributes;
    }

    public void setCategoriesAttributes(List<CategoryAttributeShowInFilter> categoriesAttributes) {
        this.categoriesAttributes = categoriesAttributes;
    }

    public void createCategoryAttributeShowInFilter(CategoryAttributeShowInFilter categoryAttributeShowInFilter) {
        categoriesAttributes.add(categoryAttributeShowInFilter);
    }

}
