package com.advantage.mastercredit.payment.dto;

import com.advantage.common.enums.ResponseEnum;
import com.advantage.common.enums.TransactionTypeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * {@code response} for <b>REST API</b> request. <br/>
 * {@link #transactionType} Values by {@link TransactionTypeEnum}. <br/>
 * {@link #responseCode} Values by {@link ResponseEnum}. <br/>
 * {@link #responseReason} "Approved" or "Rejected" + Description. <br/>
 * {@link #referenceNumber} 10-digits number, only when {@link #responseCode} is "Approved". <br/>
 * {@link #transactionDate} {@link String} date in format <i>"DDMMYYY"</i>. <br/>
 * @author Binyamin Regev on 20/12/2015.
 */
@JsonPropertyOrder({"MCTransactionType", "MCResponse.Code", "MCResponse.Reason", "MCRefNumber", "TransactionDate"})
public class MasterCreditResponse {

    @JsonProperty("MCTransactionType")
    private String transactionType;

    @JsonProperty("MCResponse.Code")
    private String responseCode;

    @JsonProperty("MCResponse.Reason")
    private String responseReason;

    @JsonProperty("MCRefNumber")
    private long referenceNumber;       //  10 digits

    @JsonProperty("TransactionDate")
    private String transactionDate; //  DDMMYYYY

    public MasterCreditResponse() {
    }

    public MasterCreditResponse(String transactionType, String responseCode, String responseReason, long referenceNumber, String transactionDate) {
        this.transactionType = transactionType;
        this.responseCode = responseCode;
        this.responseReason = responseReason;
        this.referenceNumber = referenceNumber;
        this.transactionDate = transactionDate;
    }

    public String getTransactionType() {
        return this.transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getResponseCode() {
        return this.responseCode;
    }

    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseReason() {
        return this.responseReason;
    }

    public void setResponseReason(String responseReason) {
        this.responseReason = responseReason;
    }

    public long getReferenceNumber() {
        return this.referenceNumber;
    }

    public void setReferenceNumber(long referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getTransactionDate() {
        return this.transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    @Override
    @JsonIgnore
    public String toString() {
        return "MasterCreditResponse{" +
                "transactionType='" + transactionType + '\'' +
                ", responseCode='" + responseCode + '\'' +
                ", responseReason='" + responseReason + '\'' +
                ", referenceNumber=" + referenceNumber +
                ", transactionDate='" + transactionDate + '\'' +
                '}';
    }
}
