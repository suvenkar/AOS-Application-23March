package com.advantage.catalog.store.dao.product;

import java.util.Collection;
import java.util.List;

import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.dao.DefaultCRUDOperations;
import com.advantage.catalog.store.model.product.ColorAttribute;
import com.advantage.catalog.store.model.product.LastUpdate;
import com.advantage.catalog.store.model.product.Product;
import com.advantage.common.dto.CatalogResponse;
import com.advantage.common.dto.ProductDto;
import org.springframework.transaction.annotation.Transactional;

public interface ProductRepository extends DefaultCRUDOperations<Product> {
    /**
     * Create Product entity
     *
     * @param name        {@link String} product name
     * @param description {@link String} product description
     * @param price       {@link Integer} product price
     * @param category    {@link Category} category which be related with product
     * @return entity reference
     */
    @Transactional
    Product create(String name, String description, double price, String imgUrl, Category category, String productStatus);

    @Transactional
    Product update(ProductDto productDto, long id);

    @Transactional
    Product create(String name, String description, double price, String imgUrl, Category category);

    /**
     * Get product categories by categoryId
     *
     * @param categoryId {@link Long} Category id
     * @return Product collection
     */
    List<Product> getCategoryProducts(Long categoryId);

    /**
     * Get product categories by Category
     *
     * @param category {@link Category} Category of a product
     * @return Product collection
     */
    List<Product> getCategoryProducts(Category category);

    /**
     * Delete collection of a product
     *
     * @param products {@link List<Product>} product collection
     * @return the number of entities deleted
     */
    int delete(final Collection<Product> products);

    /**
     * Search products by name pattern
     *
     * @param pattern  name pattern
     * @param quantity quantity of products
     * @return {@link List} collection of Products
     */
    List<Product> filterByName(String pattern, int quantity);

    /**
     * Search products by name pattern
     *
     * @param pattern name pattern
     * @return {@link List} collection of Products
     */
    List<Product> filterByName(String pattern);

    List<Product> filterByCategoryId(Long categoryId, int quantity);

    List<Product> filterByCategoryId(Long categoryId);

    List<ColorAttribute> getColorAttributeByProductIdAndColorCode(Long productId, String hexColor);

    CatalogResponse dbRestoreFactorySettings();

    List<LastUpdate> getAllLastUpdates();

    LastUpdate getLastUpdate(Long entityId);

    LastUpdate getLastUpdateByName(final String name);

    LastUpdate createLastUpdate(String lastUpdateName, long lastUpdateTimestamp);

    LastUpdate updateLastUpdate(LastUpdate lastUpdateDto, long id);

}