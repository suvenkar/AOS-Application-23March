package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigStatusResponse {
    @JsonProperty("success")
    private boolean success;
    @JsonProperty("reason")
    private String reason;
    @JsonProperty("code")
    private long code;

    public DemoAppConfigStatusResponse() {
    }

    public DemoAppConfigStatusResponse(boolean success, String reason) {
        this.success = success;
        this.reason = reason;
    }

    public DemoAppConfigStatusResponse(boolean success, String reason, long code) {
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
