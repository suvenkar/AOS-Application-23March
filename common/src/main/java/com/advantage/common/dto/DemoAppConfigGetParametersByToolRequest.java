package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 22/03/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class DemoAppConfigGetParametersByToolRequest {

    @JsonProperty("toolName")
    private String toolName;

    public DemoAppConfigGetParametersByToolRequest() {
    }

    public DemoAppConfigGetParametersByToolRequest(String toolName) {
        this.toolName = toolName;
    }

    public String getToolName() {
        return this.toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }
}
