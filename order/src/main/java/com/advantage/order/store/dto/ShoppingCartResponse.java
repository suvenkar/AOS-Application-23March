package com.advantage.order.store.dto;

/**
 * @author Binyamin Regev on 03/12/2015.
 */
public class ShoppingCartResponse {

    private boolean success;
    private String reason;
    private long id;

    public ShoppingCartResponse(boolean success, String reason, long id) {
        this.setSuccess(success);
        this.setReason(reason);
        this.setId(id);
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

    public void setReason(String reason) { this.reason = reason; }

    public long getId() { return id; }

    public void setId(long id) { this.id = id;}

    @Override
    public String toString() {
        return "ShoppingCartResponse{" +
                "success=" + success +
                ", reason='" + reason + '\'' +
                ", id=" + id +
                '}';
    }
}
