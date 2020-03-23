package com.advantage.order.store.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Binyamin Regev on 06/01/2016.
 */
public class OrderPurchaseResponse {
    private boolean success;
    private String code;
    private String reason;
    private long orderNumber;
    private long paymentConfirmationNumber;
    private long trackingNumber;

    public OrderPurchaseResponse() {  }

    public OrderPurchaseResponse(boolean success) {
        this.success = success;
        this.code = "";
        this.reason = "";
        this.orderNumber = 0L;
        this.paymentConfirmationNumber = 0L;
        this.trackingNumber = 0L;
    }

    public OrderPurchaseResponse(boolean success, String code, String reason) {
        this.success = success;
        this.code = code;
        this.reason = reason;
        this.orderNumber = 0L;
        this.paymentConfirmationNumber = 0L;
        this.trackingNumber = 0L;
    }

    public OrderPurchaseResponse(boolean success, String code, String reason, long orderNumber) {
        this.success = success;
        this.code = code;
        this.reason = reason;
        this.orderNumber = orderNumber;
        this.paymentConfirmationNumber = 0L;
        this.trackingNumber = 0L;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public long getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(long orderNumber) {
        this.orderNumber = orderNumber;
    }

    public long getPaymentConfirmationNumber() {
        return paymentConfirmationNumber;
    }

    public void setPaymentConfirmationNumber(long paymentConfirmationNumber) {
        this.paymentConfirmationNumber = paymentConfirmationNumber;
    }

    public long getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(long trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    @Override
    @JsonIgnore
    public String toString() {
        return "OrderPurchaseResponse{" +
                "success=" + success +
                ", code='" + code + '\'' +
                ", reason='" + reason + '\'' +
                ", orderNumber=" + orderNumber +
                ", paymentConfirmationNumber=" + paymentConfirmationNumber +
                ", trackingNumber=" + trackingNumber +
                '}';
    }
}
