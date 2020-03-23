package com.advantage.order.store.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Moti Ostrovski on 24/05/2016.
 */
public class HistoryOrderHeaderDto {

    private long orderNumber;
    private long orderTimestamp;
    private double shippingTrackingNumber;
    private String paymentMethod;
    private double orderTotalSum;
    private double orderShipingCost;
    private String shippingAddress;
    private HistoryOrderAccountDto customer;
    private List<HistoryOrderProductDto> products;


    public HistoryOrderHeaderDto(){
        initFields();
        products = new ArrayList<HistoryOrderProductDto>() {};
    }

    public HistoryOrderHeaderDto(long orderNumber, long orderTimestamp, double shippingTrackingNumber,
                                 String paymentMethod, double orderTotalSum, double orderShipingCost,
                                 String shippingAddress, HistoryOrderAccountDto customer) {
        initFields();
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.shippingTrackingNumber = shippingTrackingNumber;
        this.paymentMethod = paymentMethod;
        this.orderTotalSum = orderTotalSum;
        this.orderShipingCost = orderShipingCost;
        this.shippingAddress = shippingAddress;
        this.customer = customer;
        products = new ArrayList<HistoryOrderProductDto>() {};
    }

    public HistoryOrderHeaderDto(long orderNumber, long orderTimestamp,
                                 double shippingTrackingNumber, String paymentMethod,
                                 double orderTotalSum, double orderShipingCost,
                                 String shippingAddress, HistoryOrderAccountDto customer,
                                 List<HistoryOrderProductDto> products) {
        initFields();
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.shippingTrackingNumber = shippingTrackingNumber;
        this.paymentMethod = paymentMethod;
        this.orderTotalSum = orderTotalSum;
        this.orderShipingCost = orderShipingCost;
        this.shippingAddress = shippingAddress;
        this.customer = customer;
        this.products=products;
    }


    public long getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(long orderNumber) {
        this.orderNumber = orderNumber;
    }

    public long getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(long orderTimestamp) {
        this.orderTimestamp = orderTimestamp;
    }

    public double getShippingTrackingNumber() {
        return shippingTrackingNumber;
    }

    public void setShippingTrackingNumber(double shippingTrackingNumber) {
        this.shippingTrackingNumber = shippingTrackingNumber;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getOrderTotalSum() {
        return orderTotalSum;
    }

    public void setOrderTotalSum(double orderTotalSum) {
        this.orderTotalSum = orderTotalSum;
    }

    public double getOrderShipingCost() {
        return orderShipingCost;
    }

    public void setOrderShipingCost(double orderShipingCost) {
        this.orderShipingCost = orderShipingCost;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public HistoryOrderAccountDto getCustomer() {
        return customer;
    }

    public void setCustomer(HistoryOrderAccountDto customer) {
        this.customer = customer;
    }

    public List<HistoryOrderProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<HistoryOrderProductDto> products) {
        this.products = products;
    }

    public void addOrderHistoryProductDto(HistoryOrderProductDto product){
        this.products.add(product);
    }

    public void initFields(){
        orderNumber=0;
        orderTimestamp=0;
        shippingTrackingNumber=0;
        paymentMethod="";
        orderTotalSum=0.0;
        orderShipingCost=0.0;
        shippingAddress="";
        customer=new HistoryOrderAccountDto();
        products = products==null ? new ArrayList<HistoryOrderProductDto>() {} : products;
        products.clear();
    }


}
