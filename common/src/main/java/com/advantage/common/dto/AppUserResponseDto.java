package com.advantage.common.dto;

/**
 * @author Binyamin Regev on 19/11/2015.
 */
public class AppUserResponseDto {
    boolean success;
    long userId;        //  -1 = Invalid user login name
    String reason;
    String token;
    String sessionId;

    /**
     * @param success
     * @param reason
     * @param userId
     */
    public AppUserResponseDto(boolean success, String reason, long userId) {
        this.setUserId(userId);
        this.setReason(reason);
        this.setSuccess(success);
    }

    /**
     * @param success
     * @param reason
     * @param userId
     * @param token
     */
    public AppUserResponseDto(boolean success, String reason, long userId, String token) {
        this.setUserId(userId);
        this.setReason(reason);
        this.setSuccess(success);
        this.setToken(token);
    }

    /**
     * @return
     */
    public long getUserId() {
        return userId;
    }

    /**
     * @param userId
     */
    public void setUserId(long userId) {
        this.userId = userId;
    }

    /**
     * @return
     */
    public String getReason() {
        return reason;
    }

    /**
     * @param reason
     */
    public void setReason(String reason) {
        this.reason = reason;
    }

    /**
     * @return
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * @param success
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * @return
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * @return
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * @param sessionId
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
