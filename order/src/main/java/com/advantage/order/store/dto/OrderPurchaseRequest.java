package com.advantage.order.store.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;

/**
 * @author Binyamin Regev on 24/12/2015.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class OrderPurchaseRequest {

    private OrderShippingInformation orderShippingInformation;

    private OrderPaymentInformation orderPaymentInformation;

    private List<ShoppingCartDto> purchasedProducts;

    public OrderPurchaseRequest() { }

    public OrderPurchaseRequest(String paymentMethod, OrderShippingInformation orderShippingInformation, OrderPaymentInformation orderPaymentInformation) {
        this.orderShippingInformation = orderShippingInformation;
        this.orderPaymentInformation = orderPaymentInformation;
    }

    public OrderPurchaseRequest(String paymentMethod, OrderShippingInformation orderShippingInformation, OrderPaymentInformation orderPaymentInformation, List<ShoppingCartDto> purchasedProducts) {
        this.orderShippingInformation = orderShippingInformation;
        this.orderPaymentInformation = orderPaymentInformation;
        this.purchasedProducts = purchasedProducts;
    }

    public OrderShippingInformation getOrderShippingInformation() {
        return orderShippingInformation;
    }

    public void setOrderShippingInformation(OrderShippingInformation orderShippingInformation) {
        this.orderShippingInformation = orderShippingInformation;
    }

    public OrderPaymentInformation getOrderPaymentInformation() {
        return orderPaymentInformation;
    }

    public void setOrderPaymentInformation(OrderPaymentInformation orderPaymentInformation) {
        this.orderPaymentInformation = orderPaymentInformation;
    }

    public List<ShoppingCartDto> getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(List<ShoppingCartDto> purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }

    /**
     * Add {@link ShoppingCartDto} with {@code productId}, {@code hexColor} and {@code quantity}.
     * @param productId
     * @param hexColor
     * @param quantity
     * @return
     */
    public boolean addProductToPurchase(Long productId, String hexColor, int quantity) {
        boolean result = purchasedProducts.add(new ShoppingCartDto(productId, hexColor, quantity));
        return result;
    }
}
