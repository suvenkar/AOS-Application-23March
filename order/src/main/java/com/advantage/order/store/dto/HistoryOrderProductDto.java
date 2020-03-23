package com.advantage.order.store.dto;

/**
 * @author Moti Ostrovski on 24/05/2016.
 */
public class HistoryOrderProductDto {

    private long productId;
    private String productName;
    private String productColor;
    private double pricePerItem;
    private int productQuantity;
    private long orderNumber;

    public HistoryOrderProductDto(){
        initFields();
    }

    public HistoryOrderProductDto(long productId, String productName, String productColor,
                                  double pricePerItem, int productQuantity, long orderNumber) {
        initFields();
        this.productId = productId;
        this.productName = productName;
        this.productColor = productColor;
        this.pricePerItem = pricePerItem;
        this.productQuantity = productQuantity;
        this.orderNumber = orderNumber;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductColor() {
        return productColor;
    }

    public void setProductColor(String productColor) {
        this.productColor = productColor;
    }

    public double getPricePerItem() {
        return pricePerItem;
    }

    public void setPricePerItem(double pricePerItem) {
        this.pricePerItem = pricePerItem;
    }

    public int getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(int productQuantity) {
        this.productQuantity = productQuantity;
    }

    public long getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(long orderNumber) {
        this.orderNumber = orderNumber;
    }

    private void initFields()
    {
        productId = 0;
        productName="";
        productColor="";
        pricePerItem=0.0;
        productQuantity=0;
        orderNumber=0;
    }
}
