package com.advantage.order.store.dev_only;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Binyamin Regev on 24/12/2015.
 */
public class OrderPurchaseRequest {

    public class CartProductForPurchase {
        private Long productId;
        private String productName;
        private int quantity;

        public CartProductForPurchase() { }

        public CartProductForPurchase(Long productId, String productName, int quantity) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
        }

        public Long getProductId() { return productId; }

        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }

        public void setProductName(String productName) { this.productName = productName; }

        public int getQuantity() { return quantity; }

        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    private List<CartProductForPurchase> productsToPurchase;
    private String paymentMethod;       //  MasterCredit / SafePay
    private String safePayUserName;     //  has a value only if paymentMethod = "SafePay"
    private String safePaypassword;     //  has a value only if paymentMethod = "SafePay"

    private String ShipExAddressCity;
    private String ShipExAddressCountryCode;    //  By ISO3166
    //private String ShipExAddressCountryName;
    private String ShipExAddressState;          //  0-10 characters
    private String ShipExAddressPostalCode;     //  0-10 digis
    private String ShipExAddressLine1;          //  0-50 characters
    private String ShipExAddressLine2;          //  0-50 characters

    public OrderPurchaseRequest() { }

    public OrderPurchaseRequest(String paymentMethod, String safePayUserName, String safePaypassword, String shipExAddressCity, String shipExAddressCountryCode, String shipExAddressState, String shipExAddressPostalCode, String shipExAddressLine1, String shipExAddressLine2) {
        this.productsToPurchase = new ArrayList<CartProductForPurchase>();

        this.paymentMethod = paymentMethod;
        this.safePayUserName = safePayUserName;
        this.safePaypassword = safePaypassword;
        ShipExAddressCity = shipExAddressCity;
        ShipExAddressCountryCode = shipExAddressCountryCode;
        ShipExAddressState = shipExAddressState;
        ShipExAddressPostalCode = shipExAddressPostalCode;
        ShipExAddressLine1 = shipExAddressLine1;
        ShipExAddressLine2 = shipExAddressLine2;
    }

    public OrderPurchaseRequest(List<CartProductForPurchase> productsToPurchase, String paymentMethod, String safePayUserName, String safePaypassword, String shipExAddressCity, String shipExAddressCountryCode, String shipExAddressState, String shipExAddressPostalCode, String shipExAddressLine1, String shipExAddressLine2) {
        this.productsToPurchase = productsToPurchase;
        this.paymentMethod = paymentMethod;
        this.safePayUserName = safePayUserName;
        this.safePaypassword = safePaypassword;
        ShipExAddressCity = shipExAddressCity;
        ShipExAddressCountryCode = shipExAddressCountryCode;
        ShipExAddressState = shipExAddressState;
        ShipExAddressPostalCode = shipExAddressPostalCode;
        ShipExAddressLine1 = shipExAddressLine1;
        ShipExAddressLine2 = shipExAddressLine2;
    }

    /**
     * Add {@link #productsToPurchase} with {@code productId}, {@code product name} and {@code quantity}.
     * @param productId
     * @param productName
     * @param quantity
     * @return
     */
    public boolean addProductToPurchase(Long productId, String productName, int quantity) {
        boolean result = productsToPurchase.add(new CartProductForPurchase(productId, productName, quantity));
        return result;
    }

    /**
     * Add {@link #productsToPurchase} with {@code productId} and {@code quantity}.
     * @param productId
     * @param quantity
     * @return
     */
    public boolean addProductToPurchase(Long productId, int quantity) {
        boolean result = productsToPurchase.add(new CartProductForPurchase(productId, "", quantity));
        return result;
    }

}
