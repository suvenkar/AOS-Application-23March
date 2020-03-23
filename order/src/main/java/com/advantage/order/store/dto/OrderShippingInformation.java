package com.advantage.order.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 07/01/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class OrderShippingInformation {

    //@JsonProperty("Shipping.Cost")
    @JsonProperty("Shipping_Cost")
    private double shippingCost;                //  ##.##

    //@JsonProperty("Shipping.TrackingNumber")
    @JsonProperty("Shipping_TrackingNumber")
    private long trackingNumber;                //  10 digits

    //@JsonProperty("Shipping.NumberOfProducts")
    @JsonProperty("Shipping_NumberOfProducts")
    private int numberOfProducts;               //  Numeric. 1-5 digits

    //@JsonProperty("Shipping.Address.CustomerName")
    @JsonProperty("Shipping_Address_CustomerName")
    private String customerName;

    //@JsonProperty("Shipping.Address.CustomerPhone")
    @JsonProperty("Shipping_Address_CustomerPhone")
    private String customerPhone;

    //@JsonProperty("Shipping.Address.Address")
    @JsonProperty("Shipping_Address_Address")
    private String address;                     //  0-100 characters

    //@JsonProperty("Shipping.Address.City")
    @JsonProperty("Shipping_Address_City")
    private String city;                        //  City name

    //@JsonProperty("Shipping.Address.PostalCode")
    @JsonProperty("Shipping_Address_PostalCode")
    private String postalCode;                  //  0-10 digis

    //@JsonProperty("Shipping.Address.State")
    @JsonProperty("Shipping_Address_State")
    private String state;                       //  0-10 characters

    //@JsonProperty("Shipping.Address.CountryCode")
    @JsonProperty("Shipping_Address_CountryCode")
    private String countryCode;                 //  2 characters, by ISO3166

    public OrderShippingInformation() { }

    public double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public long getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(long trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public int getNumberOfProducts() {
        return numberOfProducts;
    }

    public void setNumberOfProducts(int numberOfProducts) {
        this.numberOfProducts = numberOfProducts;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OrderShippingInformation that = (OrderShippingInformation) o;

        if (Double.compare(that.getShippingCost(), getShippingCost()) != 0) return false;
        if (trackingNumber != that.trackingNumber) return false;
        if (getNumberOfProducts() != that.getNumberOfProducts()) return false;
        if (!getCustomerName().equals(that.getCustomerName())) return false;
        if (!getCustomerPhone().equals(that.getCustomerPhone())) return false;
        if (!getAddress().equals(that.getAddress())) return false;
        if (!getCity().equals(that.getCity())) return false;
        if (!getPostalCode().equals(that.getPostalCode())) return false;
        if (!getState().equals(that.getState())) return false;
        return getCountryCode().equals(that.getCountryCode());

    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        temp = Double.doubleToLongBits(getShippingCost());
        result = (int) (temp ^ (temp >>> 32));
        result = 31 * result + (int) (trackingNumber ^ (trackingNumber >>> 32));
        result = 31 * result + getNumberOfProducts();
        result = 31 * result + getCustomerName().hashCode();
        result = 31 * result + getCustomerPhone().hashCode();
        result = 31 * result + getAddress().hashCode();
        result = 31 * result + getCity().hashCode();
        result = 31 * result + getPostalCode().hashCode();
        result = 31 * result + getState().hashCode();
        result = 31 * result + getCountryCode().hashCode();
        return result;
    }
}
