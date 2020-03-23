package com.advantage.catalog.store.dao.attribute;

import com.advantage.catalog.store.dao.DefaultCRUDOperations;
import com.advantage.catalog.store.model.attribute.Attribute;
import com.advantage.catalog.store.model.category.CategoryAttributeFilter;
import com.advantage.common.dto.CatalogResponse;

public interface AttributeRepository extends DefaultCRUDOperations<Attribute> {
    /**
     * Get entity by record nane
     *
     * @param name Name of the category
     * @return entity reference
     */
    Attribute get(String name);
}