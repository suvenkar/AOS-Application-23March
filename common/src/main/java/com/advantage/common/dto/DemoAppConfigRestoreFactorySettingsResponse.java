package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigRestoreFactorySettingsResponse {
    @JsonProperty("StatusMessage")
    private DemoAppConfigStatusResponse response;

    public DemoAppConfigRestoreFactorySettingsResponse() {
    }

    public DemoAppConfigRestoreFactorySettingsResponse(DemoAppConfigStatusResponse response) {
        this.response = response;
    }

    public DemoAppConfigStatusResponse getResponse() {
        return response;
    }

    public void setResponse(DemoAppConfigStatusResponse response) {
        this.response = response;
    }
}
