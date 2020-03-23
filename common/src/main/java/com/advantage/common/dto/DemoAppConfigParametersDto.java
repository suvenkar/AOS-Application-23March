package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigParametersDto {
    @JsonProperty("parameters")
    protected List<DemoAppConfigParameterDto> parameters;

    /**
     *
     */
    public DemoAppConfigParametersDto() {
    }

    /**
     *
     * @param parameters
     *
     */
    public DemoAppConfigParametersDto(List<DemoAppConfigParameterDto> parameters) {
        this.parameters = parameters;
    }

    public List<DemoAppConfigParameterDto> getParameters() {
        return parameters;
    }

    public void setParameters(List<DemoAppConfigParameterDto> parameters) {
        this.parameters = parameters;
    }
}
