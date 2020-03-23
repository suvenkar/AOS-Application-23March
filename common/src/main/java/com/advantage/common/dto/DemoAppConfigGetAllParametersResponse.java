package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigGetAllParametersResponse {
    @JsonProperty("parameters")
    protected List<DemoAppConfigParameter> parameters;

    public DemoAppConfigGetAllParametersResponse() {
    }

    public DemoAppConfigGetAllParametersResponse(List<DemoAppConfigParameter> parameters) {
        this.parameters = parameters;
    }

    public List<DemoAppConfigParameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<DemoAppConfigParameter> parameters) {
        this.parameters = parameters;
    }
}
