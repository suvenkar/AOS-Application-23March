package com.advantage.order.store.model;

import java.io.Serializable;

/**
 * Primary-Key class for entity {@link OrderLines} which has composite primary key,
 * handled by {@code @ClassId} annotation.
 * @author Binyamin Regev on 06/01/2016.
 * @see OrderLines
 */
public class OrderLinesPk implements Serializable {
    private long userId;
    private long orderNumber;
    private Long productId;
    private int productColor;

    public OrderLinesPk() { }

    public OrderLinesPk(long userId, long orderNumber, Long productId, int productColor) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.productId = productId;
        this.productColor = productColor;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(long orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getProductColor() {
        return productColor;
    }

    public void setProductColor(int productColor) {
        this.productColor = productColor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OrderLinesPk that = (OrderLinesPk) o;

        if (getUserId() != that.getUserId()) return false;
        if (getOrderNumber() != that.getOrderNumber()) return false;
        if (getProductColor() != that.getProductColor()) return false;
        return getProductId().equals(that.getProductId());

    }

    @Override
    public int hashCode() {
        int result = (int) (getUserId() ^ (getUserId() >>> 32));
        result = 31 * result + (int) (getOrderNumber() ^ (getOrderNumber() >>> 32));
        result = 31 * result + getProductId().hashCode();
        result = 31 * result + getProductColor();
        return result;
    }
}
