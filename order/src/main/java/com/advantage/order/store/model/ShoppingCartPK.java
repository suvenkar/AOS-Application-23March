package com.advantage.order.store.model;

import java.io.Serializable;

/**
 * Primary-Key class for entity {@link ShoppingCart} which has composite
 * primary key, handled by {@code @ClassId} annotation.
 *
 * @author Binyamin Regev on 08/12/2015.
 * @see ShoppingCart
 */
public class ShoppingCartPK implements Serializable {

    private long userId;
    private Long productId;
    private int color;

    /**
     * Mandatory Definition: Default Constructor
     */
    public ShoppingCartPK() {
    }

    /**
     * Mandatory Definition: Full Primay Key Constructor
     *
     * @param userId
     * @param productId
     * @param color
     */
    public ShoppingCartPK(long userId, Long productId, int color) {
        this.userId = userId;
        this.productId = productId;
        this.color = color;
    }

    /**
     * Get value from {@code userId} primary key field.
     *
     * @return long. value of {@code userId} primary key field.
     */
    public long getUserId() {
        return userId;
    }

    /**
     * Set value to {@code userId} primary key field.
     *
     * @param userId Value to set into {@code userId} primary key field.
     */
    public void setUserId(long userId) {
        this.userId = userId;
    }

    /**
     * Get value from {@code productId} primary key field.
     *
     * @return {@link Long}. value of {@code productId} primary key field.
     */
    public Long getProductId() {
        return productId;
    }

    /**
     * Set value to {@code productId} primary key field.
     *
     * @param productId Value to set into {@code productId} primary key field.
     */
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    /**
     * Get value from {@code color} primary key field.
     *
     * @return {@link Long}. value of {@code color} primary key field.
     */
    public int getColor() {
        return color;
    }

    /**
     * Set value to {@code color} primary key field.
     *
     * @param color Value to set into {@code color} primary key field.
     */
    public void setColor(int color) {
        this.color = color;
    }

    /**
     * Mandatory Definition override {@link #equals} method.
     *
     * @param o Object to compare to this object.
     * @return <b>true</b> if both objects are equal, <b>false</b> when objects are not equal.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ShoppingCartPK that = (ShoppingCartPK) o;

        if (getUserId() != that.getUserId()) return false;
        if (!getProductId().equals(that.getProductId())) return false;

        return (getColor() == that.getColor());
    }

    /**
     * Mandatory Definition override {@link #hashCode} method.
     *
     * @return integer representing {@code hashCode}.
     */
    @Override
    public int hashCode() {
        int result = (int) (getUserId() ^ (getUserId() >>> 32));
        result = 31 * result + getProductId().hashCode();
        result = 31 * result + Integer.valueOf(getColor()).hashCode();
        return result;
    }
}
