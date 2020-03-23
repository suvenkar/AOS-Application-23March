package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigParameterDto {
    @JsonProperty("name")
    private String name;

    @JsonProperty("newValue")
    private String newValue;

    /**
     *
     */
    public DemoAppConfigParameterDto() {
    }

    /**
     *
     * @param parameterName
     * @param parameterValue
     */
    public DemoAppConfigParameterDto(String parameterName, String parameterValue) {
        this.name = parameterName;
        this.newValue = parameterValue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }
}
