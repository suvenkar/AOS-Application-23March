package com.advantage.order.store.dao;

import com.advantage.common.dao.DefaultCRUDOperations;
import com.advantage.order.store.dto.ShoppingCartDto;
import com.advantage.order.store.dto.ShoppingCartResponse;
import com.advantage.order.store.model.ShoppingCart;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

/**
 * @author Binyamin Regev on 03/12/2015.
 */
public interface ShoppingCartRepository extends DefaultCRUDOperations<ShoppingCart> {

    ShoppingCartResponse getShoppingCartResponse();

    /*  Retrieve all products of user's ShoppingCart    */
    @Transactional(readOnly = true)
    List<ShoppingCart> getShoppingCartProductsByUserId(long userId);

    /**
     * Find a specific product with specific color in user cart
     * @param userId Unique identifier of user account in <i><b>Account Service</b></i>.
     * @param productId Unique identifier of {@code Product} in <i><b>Catalog Service</b></i>.
     * @param color decimal RGB value
     * @return {@link ShoppingCart} product class
     */
    @Transactional(readOnly = true)
    ShoppingCart find(long userId, Long productId, int color);

    @Transactional
    void add(ShoppingCart shoppingCart);

    /* Update   */
    /*  Update a single product in user's ShoppingCart  */
    @Transactional
    ShoppingCartResponse update(long userId, Long productId, int color, int quantity);

    /* Replace user entire shopping cart */
    @Transactional
    ShoppingCartResponse replace(long userId, Collection<ShoppingCartDto> cartProducts);

    /*  Delete a specific product with specific color from user's ShoppingCart  */
    @Transactional
    int removeProductFromUserCart(long userId, Long productId, int color);

    /*  Delete all products of user's ShoppingCart  */
    @Transactional
    ShoppingCartResponse clearUserCart(long userId);

}
