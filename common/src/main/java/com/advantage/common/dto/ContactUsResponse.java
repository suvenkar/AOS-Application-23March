package com.advantage.common.dto;

/**
 * This is a RESPONSE for a MOCK service class. It ALWAYS returns "OK".
 * @author Binyamin Regev on 02/02/2016.
 */
public class ContactUsResponse {
    private boolean success;
    private String reason;
    private long returnCode;

    public ContactUsResponse() {
    }

    public ContactUsResponse(boolean success, String reason, long returnCode) {
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
