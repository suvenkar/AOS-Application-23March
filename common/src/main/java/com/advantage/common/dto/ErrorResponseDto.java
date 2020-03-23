package com.advantage.common.dto;

import io.swagger.annotations.ApiModel;

/**
 * @author Evgeney Fiskin on 24-Jan-2016
 */
@ApiModel
public class ErrorResponseDto {
    boolean success;
    String reason;

    public ErrorResponseDto(boolean success, String reason) {
        this.success = success;
        this.reason = reason;
    }

    /**
     * Get {@code success} value
     *
     * @return {@code boolean} <i>true</i> or <i>false</i>
     */
    public boolean isSuccess() {
        return success;
    }


    /**
     * Get {@link String} {@code reason} value
     *
     * @return
     */
    public String getReason() {
        return reason;
    }

}
