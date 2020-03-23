package com.advantage.order.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MasterCreditRequest {

    @JsonProperty("MCTransactionType")
    private String transactionType;   //  PAYMENT - TransactioTypeEnum.PAYMENT

    @JsonProperty("MCCardNumber")
    private long cardNumber;          //  16 digits

    @JsonProperty("MCExpirationDate")
    private String expirationDate;       //   6 digits: MMYYYY

    @JsonProperty("MCCustomerName")
    private String customerName;      //  2-30 characters ([A-Za-z]{2,30})

    @JsonProperty("MCCustomerPhone")
    private String customerPhone;       //  0-20 digits and special characters

    @JsonProperty("MCCVVNumber")
    private int cvvNumber;         //  3 digits

    @JsonProperty("MCTransactionDate")
    private String transactionDate;     //  8 digits: DDMMYYYY

    @JsonProperty("MCRecevingCard.AccountNumber")
    private long accountNumber;       //  fixed 12 digits. String because can start with "0".

    @JsonProperty("MCRecevingAmount.Value")
    private double value;           //  Cart total cost: XXXXXXXXXX.XX (12,2 = 12 digits 2 of them decimal)

    @JsonProperty("MCRecevingCard.Currency")
    private String currency;        //  3 characters. Default "USD"

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public long getPhaseBit() {
        return phaseBit;
    }

    public void setPhaseBit(long phaseBit) {
        this.phaseBit = phaseBit;
    }

    public String getIntegrityCheck() {
        return integrityCheck;
    }

    public void setIntegrityCheck(String integrityCheck) {
        this.integrityCheck = integrityCheck;
    }

    //@JsonProperty("Transaction_MasterCredit_KeyId")
    @JsonProperty("MCCardKeyId")
    private String keyId;

    //@JsonProperty("Transaction_MasterCredit_phaseBit")
    @JsonProperty("MCCardPhaseBit")
    private long phaseBit;

    //@JsonProperty("Transaction_MasterCredit_IntegrityCheck")
    @JsonProperty("MCCardIntegrityCheck")
    private String integrityCheck;

    public MasterCreditRequest() {
    }

    public MasterCreditRequest(String transactionType, long cardNumber, String expirationDate, String customerName, String customerPhone, int cvvNumber, String transactionDate, long accountNumber, double value, String currency,String integrityCheck,long phaseBit,String keyId) {
        this.transactionType = transactionType;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.cvvNumber = cvvNumber;
        this.transactionDate = transactionDate;
        this.accountNumber = accountNumber;
        this.value = value;
        this.currency = currency;
        this.keyId = keyId;
        this.phaseBit = phaseBit;
        this.integrityCheck = integrityCheck;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public long getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(long cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationDate() { return expirationDate; }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public int getCvvNumber() {
        return cvvNumber;
    }

    public void setCvvNumber(int cvvNumber) {
        this.cvvNumber = cvvNumber;
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
        return "MasterCreditRequest{" +
                " MCTransactionType='" + this.getTransactionType() + '\'' +
                ", MCCardNumber=" + this.getCardNumber() +
                ", MCExpirationDate='" + this.getExpirationDate() + '\'' +
                ", MCCustomerName='" + this.getCustomerName() + '\'' +
                ", CustomerPhone='" + this.getCustomerPhone() + '\'' +
                ", MCCVVNumber='" + this.getCvvNumber() + '\'' +
                ", MCTransactionDate='" + this.getTransactionDate() + '\'' +
                ", MCReceivingCard.AccountNumber='" + this.getAccountNumber() + '\'' +
                ", MCReceivingAmount.Value=" + this.getValue() +
                ", MCReceivingAmount.Currency=\'" + this.getCurrency() + "\'" +
                '}';
    }
}