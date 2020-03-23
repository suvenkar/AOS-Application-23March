package com.advantage.safepay.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/*@JsonPropertyOrder({
        "SPTransactionType",
        "SPUserName",
        "SPPassword",
        "SPPassword",
        "SPCustomerPhone",
        "SPTransactionDate",
        "SPReceivingCard.AccountNumber",
        "SPRecevingAmount.Value",
        "SPRecevingCard.Currency"
})*/
public class SafePayDto {

    @JsonProperty("SPTransactionType")
    private String transactionType;   //  PAYMENT - TransactioTypeEnum.PAYMENT

    @JsonProperty("SPUserName")
    private String userName;          //

    @JsonProperty("SPPassword")
    private String password;       //

    @JsonProperty("SPCustomerPhone")
    private String customerPhone;       //  0-20 digits and special characters

    @JsonProperty("SPTransactionDate")
    private String transactionDate;     //  8 digits: DDMMYYYY

    @JsonProperty("SPReceivingCard.AccountNumber")
    private long accountNumber;       //  fixed 12 digits. String because can start with "0".

    @JsonProperty("SPReceivingAmount.Value")
    private double value;           //  Cart total cost: XXXXXXXXXX.XX (12,2 = 12 digits 2 of them decimal)

    @JsonProperty("SPReceivingAmount.Currency")
    private String currency;        //  3 characters. Default "USD"

    public SafePayDto() {
    }

    public SafePayDto(String transactionType, String userName, String password, String customerPhone, String transactionDate, long accountNumber, double value, String currency) {
        this.transactionType = transactionType;
        this.userName = userName;
        this.password = password;
        this.customerPhone = customerPhone;
        this.transactionDate = transactionDate;
        this.accountNumber = accountNumber;
        this.value = value;
        this.currency = currency;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public long getAccountNumber() {
        return this.accountNumber;
    }

    public void setAccountNumber(long accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    @Override
    public String toString() {
        return "SafePayDto{" +
                "transactionType='" + transactionType + '\'' +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", customerPhone='" + customerPhone + '\'' +
                ", transactionDate='" + transactionDate + '\'' +
                ", accountNumber=" + accountNumber +
                ", value=" + value +
                ", currency='" + currency + '\'' +
                '}';
    }

}