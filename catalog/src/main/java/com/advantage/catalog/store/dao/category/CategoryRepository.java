package com.advantage.catalog.store.dao.category;

import com.advantage.catalog.store.dao.DefaultCRUDOperations;
import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.model.category.CategoryAttributeFilter;
import com.advantage.common.dto.CatalogResponse;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;

public interface CategoryRepository extends DefaultCRUDOperations<Category> {
    /**
     * Create Category entity
     *
     * @param name           Name of category
     * @param managedImageId Image identificator
     * @return
     *
     *
     */
    Category createCategory(String name, String managedImageId);

    /**
     *
     * @param categoryAttributeFilterObj object of category+Attribute+inFilter value(bool)
     */
    void addCategoryAttributeFilter(CategoryAttributeFilter categoryAttributeFilterObj);

    List<CategoryAttributeFilter> getAllCategoryAttributeFilter();

    /**
     *
     * @param categoryId category identificator
     * @param attributeId attribute identificator
     * @param showInFilter show in filter
     */
    void updateCategoryAttributeFilter(Long categoryId, Long attributeId, boolean showInFilter);

    CategoryAttributeFilter findCategoryAttributeFilter(Long categoryId, Long attributeId);
}