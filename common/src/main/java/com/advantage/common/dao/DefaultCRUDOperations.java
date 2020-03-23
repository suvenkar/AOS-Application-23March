package com.advantage.common.dao;

import org.springframework.transaction.annotation.Transactional;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.Collection;
import java.util.List;

public interface DefaultCRUDOperations<T> {
    /**
     * Create new entity
     *
     * @param name value of a field name
     * @return reference of a new object
     */
    @Transactional
    default T create(String name) {
        throw new NotImplementedException();
    }

    /**
     * Create new entity
     *
     * @param entity
     * @return entity Id
     */
    @Transactional
    default Long create(T entity) {
        throw new NotImplementedException();
    }

    /**
     * Delete records
     *
     * @param entities One or more entities
     * @return the number of entities updated or deleted
     */
    @Transactional
    int delete(T... entities);

    /**
     * Delete recprd by id
     *
     * @param id record id
     * @return entity reference
     */
    @Transactional
    default T delete(Long id) {
        throw new NotImplementedException();
    }

    /**
     * Delete entities by ids collection
     *
     * @param ids
     * @return the number of entities deleted
     */
    @Transactional
    default int deleteByIds(Collection<Long> ids) {
        throw new NotImplementedException();
    }

    /**
     * Get entities collection
     *
     * @return entities collection
     */
    List<T> getAll();

    /**
     * Get entity by record id
     *
     * @param entityId record id
     * @return entity reference
     */
    T get(Long entityId);
}
