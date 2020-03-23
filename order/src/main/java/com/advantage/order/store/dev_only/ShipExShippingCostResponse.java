package com.advantage.order.store.dev_only;

/**
 * @author Binyamin Regev on 24/12/2015.
 */
public class ShipExShippingCostResponse {
    private boolean success;
    private String reason;
    private long code;

    public ShipExShippingCostResponse() { }

    public ShipExShippingCostResponse(boolean success, String reason, long code) {
        this.success = success;
        this.reason = reason;
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public long getCode() {
        return code;
    }

    public void setCode(long code) {
        this.code = code;
    }
}
