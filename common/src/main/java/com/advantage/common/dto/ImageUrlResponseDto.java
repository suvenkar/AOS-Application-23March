package com.advantage.common.dto;

public class ImageUrlResponseDto {
    String id;
    boolean success;
    String reason;

    public ImageUrlResponseDto(String id, boolean success, String reason) {
        this.id = id;
        this.success = success;
        this.reason = reason;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
