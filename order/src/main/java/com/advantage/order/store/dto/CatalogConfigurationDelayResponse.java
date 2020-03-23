package com.advantage.order.store.dto;

import com.advantage.common.enums.ResponseEnum;
import com.advantage.common.enums.TransactionTypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * {@code response} for <b>REST API</b> request. <br/>
 * {@link #parameterName}  <br/>
 * {@link #datatype}  <br/>
 * {@link #description}  <br/>
 * {@link #attributeTools} <br/>
 * {@link #parameterValue}  <br/>
 *
 * @author Evgeney Fiskin Jul-2017.
 */
public class CatalogConfigurationDelayResponse {

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("datatype")
    private String datatype;

    @JsonProperty("description")
    private String description;

    @JsonProperty("attributeTools")
    private String attributeTools;

    @JsonProperty("parameterValue")
    private String parameterValue;

    public CatalogConfigurationDelayResponse() {
    }

    public CatalogConfigurationDelayResponse(String transactionType, String responseCode, String responseReason, String referenceNumber, String transactionDate) {
        this.parameterName = transactionType;
        this.datatype = responseCode;
        this.description = responseReason;
        this.attributeTools = referenceNumber;
        this.parameterValue = transactionDate;
    }

    public String getParameterName() {
        return this.parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getDatatype() {
        return this.datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAttributeTools() {
        return this.attributeTools;
    }

    public void setAttributeTools(String attributeTools) {
        this.attributeTools = attributeTools;
    }

    public String getParameterValue() {
        return this.parameterValue;
    }

    public void setParameterValue(String parameterValue) {
        this.parameterValue = parameterValue;
    }


    @Override
    public String toString() {
        return "CatalogConfigurationDelayResponse{" +
                "parameterName='" + parameterName + '\'' +
                ", datatype='" + datatype + '\'' +
                ", description='" + description + '\'' +
                ", attributeTools='" + attributeTools + '\'' +
                ", parameterValue='" + parameterValue + '\'' +
                '}';
    }
}
