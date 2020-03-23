package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class UpdateDemoAppConfigParameterRequest {
    @JsonProperty("parameterName")
    private String parameterName;
    @JsonProperty("attributeTools")
    private String attributeTools;
    @JsonProperty("parameterNewValue")
    private String parameterNewValue;

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getAttributeTools() {
        return attributeTools;
    }

    public void setAttributeTools(String attributeTools) {
        this.attributeTools = attributeTools;
    }

    public String getParameterNewValue() {
        return parameterNewValue;
    }

    public void setParameterNewValue(String parameterNewValue) {
        this.parameterNewValue = parameterNewValue;
    }
}
