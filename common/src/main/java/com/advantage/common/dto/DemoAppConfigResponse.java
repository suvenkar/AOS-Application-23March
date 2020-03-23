package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;

/**
 * @author Binyamin Regev on 30/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigResponse {
    @JsonProperty("parameters")
    private List<DemoAppConfigParameter> configParameters;

    public DemoAppConfigResponse() {
    }

    public DemoAppConfigResponse(List<DemoAppConfigParameter> configParameters) {
        this.configParameters = configParameters;
    }

    public List<DemoAppConfigParameter> getConfigParameters() {
        return configParameters;
    }

    public void setConfigParameters(List<DemoAppConfigParameter> configParameters) {
        this.configParameters = configParameters;
    }

}
