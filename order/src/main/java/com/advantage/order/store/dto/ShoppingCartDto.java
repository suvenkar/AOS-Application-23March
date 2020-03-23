package com.advantage.order.store.dto;

import com.advantage.order.store.model.ShoppingCart;

/**
 * Used in REQUEST of a {@code Collection} of {@link ShoppingCart} products. Each product is identified by
 * unique combination of {@code userId}, {@code productId} and {@code color}.
 * <b><ul>IMPORTANT:</ul></b> You must convert {@link #hexColor} property to decimal {@code color} value using
 * {@link ShoppingCart#convertHexColorToInt(String)} and send it as an {@code int}.
 *
 * @author Binyamin Regev on 03/12/2015.
 */
public class ShoppingCartDto {

    private Long productId;
    private String hexColor;
    private int quantity;

    public ShoppingCartDto() {
    }

    public ShoppingCartDto(Long productId, String hexColor, int quantity) {
        this.productId = productId;
        this.hexColor = hexColor;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getHexColor() {
        return hexColor;
    }

    public void setHexColor(String hexColor) {
        this.hexColor = hexColor;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
