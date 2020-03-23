package com.advantage.common.dto;

/**
 * @author Binyamin Regev on 14/03/2016.
 */
public class CatalogResponse {
    private boolean success;
    private String reason;
    private long returnCode;

    public CatalogResponse() {
    }

    public CatalogResponse(boolean success, String reason, long returnCode) {
        this.success = success;
        this.reason = reason;
        this.returnCode = returnCode;
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

    public long getReturnCode() {
        return returnCode;
    }

    public void setReturnCode(long returnCode) {
        this.returnCode = returnCode;
    }
}
