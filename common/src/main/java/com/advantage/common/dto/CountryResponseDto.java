package com.advantage.common.dto;

/**
 * @author Binyamin Regev on 29/11/2015.
 */
public class CountryResponseDto {
    boolean success;
    Integer countryId;        //  -1 = Invalid country name
    String reason;

    /**
     * Create Country Response Entity with given values.
     *
     * @param success
     * @param reason
     * @param countryId
     */
    public CountryResponseDto(boolean success, String reason, Integer countryId) {
        this.setSuccess(success);
        this.setCountryId(countryId);
        this.setReason(reason);
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
     * Set {@code success} value
     *
     * @param success
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * Get {@link Integer} {@code countryId} value
     *
     * @return
     */
    public Integer getCountryId() {
        return countryId;
    }

    /**
     * Set {@code countryId} {@link Integer} value
     *
     * @param countryId
     */
    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    /**
     * Get {@link String} {@code reason} value
     *
     * @return
     */
    public String getReason() {
        return reason;
    }

    /**
     * Get {@code reason} {@link String} value
     *
     * @param reason
     */
    public void setReason(String reason) {
        this.reason = reason;
    }

}
