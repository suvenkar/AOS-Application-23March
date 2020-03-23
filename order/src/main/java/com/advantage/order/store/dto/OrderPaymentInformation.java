package com.advantage.order.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * @author Binyamin Regev on 07/01/2016.
 *
 *  TransactionType, 							# Both (Payment / Refund)
 *  customerPhone,								# Both
 *  TransactionDate, 							# Both
 *  ReceivingCard.AccountNumber, 				# Both
 *  ReceivingAmount.Value,						# Both
 *  ReceivingAmount.Currency					# Both
 *
 *  ------------------------------------------
 *  MasterCreditInformation:
 *  ------------------------------------------
 *  cardNumber, 								# MasterCredit ONLY
 *  expirationDate, 							# MasterCredit ONLY
 *  customerName, 							# MasterCredit ONLY
 *  cvvNumber, 								# MasterCredit ONLY
 *  keyId                                   # MasterCredit Only for decryption
 *  phaseBit                                # MasterCredit Only for decryption
 *  integrityCheck                          # MasterCredit Only for decryption
 *
 *  ------------------------------------------
 *  SafePayPaymentInformation:
 *  ------------------------------------------
 *  SafePay.username, 							# SafePay ONLY
 *  SafePay.password, 							# SafePay ONLY
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class OrderPaymentInformation {
    //@JsonProperty("Transaction.PaymentMethod")
    @JsonProperty("Transaction_PaymentMethod")
    private String paymentMethod;       //  by PaymentMethodEnum

    //@JsonProperty("Transaction.Type")
    @JsonProperty("Transaction_Type")
    private String transactionType;     //  by TransactioTypeEnum

    //@JsonProperty("Transaction.ReferenceNumber")
    @JsonProperty("Transaction_ReferenceNumber")
    private long referenceNumber;

    //@JsonProperty("Transaction.CustomerPhone")
    @JsonProperty("Transaction_CustomerPhone")
    private String customerPhone;

    //@JsonProperty("Transaction.TransactionDate")
    @JsonProperty("Transaction_TransactionDate")
    private String transactionDate;

    //@JsonProperty("Transaction.AccountNumber")
    @JsonProperty("Transaction_AccountNumber")
    private String accountNumber;

    //@JsonProperty("Transaction.Currency")
    @JsonProperty("Transaction_Currency")
    private String currency;

    //@JsonProperty("Transaction.MasterCredit.CardNumber")
    @JsonProperty("Transaction_MasterCredit_CardNumber")
    private String cardNumber;

    //@JsonProperty("Transaction.MasterCredit.ExpirationDate")
    @JsonProperty("Transaction_MasterCredit_ExpirationDate")
    private String expirationDate;

    //@JsonProperty("Transaction.MasterCredit.CustomerName")
    @JsonProperty("Transaction_MasterCredit_CustomerName")
    private String customerName;

    //@JsonProperty("Transaction.MasterCredit.CVVNumber")
    @JsonProperty("Transaction_MasterCredit_CVVNumber")
    private String cvvNumber;

    //@JsonProperty("Transaction_MasterCredit_KeyId")
    @JsonProperty("Transaction_MasterCredit_KeyId")
    private String keyId;

    //@JsonProperty("Transaction_MasterCredit_phaseBit")
    @JsonProperty("Transaction_MasterCredit_PhaseBit")
    private String phaseBit;

    //@JsonProperty("Transaction_MasterCredit_IntegrityCheck")
    @JsonProperty("Transaction_MasterCredit_IntegrityCheck")
    private String integrityCheck;

    //@JsonProperty("Transaction.SafePay.UserName")
    @JsonProperty("Transaction_SafePay_UserName")
    private String username;

    //@JsonProperty("Transaction.SafePay.Password")
    @JsonProperty("Transaction_SafePay_Password")
    private String password;

    public OrderPaymentInformation() { }

    /**
     * Constructor for <b><i>SafePay</i></b> Payment or Refund
     * @param transactionType
     * @param customerPhone
     * @param transactionDate
     * @param accountNumber
     * @param currency
     * @param cardNumber
     * @param expirationDate
     * @param customerName
     * @param cvvNumber
     */
    public OrderPaymentInformation(String paymentMethod, String transactionType, long referenceNumber, String customerPhone, String transactionDate, String accountNumber, String currency, String cardNumber, String expirationDate, String customerName, String cvvNumber) {
        this.paymentMethod = paymentMethod;
        this.transactionType = transactionType;
        this.referenceNumber = referenceNumber;
        this.customerPhone = customerPhone;
        this.transactionDate = transactionDate;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.customerName = customerName;
        this.cvvNumber = cvvNumber;


        // SafePay information
        this.username = null;
        this.password = null;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getPhaseBit() {
        return phaseBit;
    }

    public void setPhaseBit(String phaseBit) {
        this.phaseBit = phaseBit;
    }

    public String getIntegrityCheck() {
        return integrityCheck;
    }

    public void setIntegrityCheck(String integrityCheck) {
        this.integrityCheck = integrityCheck;
    }

    /**
     * Constructor for <b><i>SafePay</i></b> Payment or Refund
     * @param transactionType
     * @param customerPhone
     * @param transactionDate
     * @param accountNumber
     * @param currency
     * @param username
     * @param password
     * @param keyId
     * @param phaseBit
     * @param integrityCheck
     */
    public OrderPaymentInformation(String paymentMethod, String transactionType, long referenceNumber, String customerPhone, String transactionDate, String accountNumber, String currency, String username, String password,String keyId, String phaseBit, String integrityCheck) {
        this.paymentMethod = paymentMethod;
        this.transactionType = transactionType;
        this.referenceNumber = referenceNumber;
        this.customerPhone = customerPhone;
        this.transactionDate = transactionDate;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.username = username;
        this.password = password;

        // MasterCredit information
        this.cardNumber = null;
        this.expirationDate = null;
        this.customerName = null;
        this.cvvNumber = null;
        this.keyId = keyId;
        this.phaseBit = phaseBit;
        this.integrityCheck = integrityCheck;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public long getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(long referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getCustomerPhone() {
        return customerPhone;
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

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCvvNumber() {
        return cvvNumber;
    }

    public void setCvvNumber(String cvvNumber) {
        this.cvvNumber = cvvNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OrderPaymentInformation that = (OrderPaymentInformation) o;

        if (getReferenceNumber() != that.getReferenceNumber()) return false;
        if (!getPaymentMethod().equals(that.getPaymentMethod())) return false;
        if (!getTransactionType().equals(that.getTransactionType())) return false;
        if (!getCustomerPhone().equals(that.getCustomerPhone())) return false;
        if (!getTransactionDate().equals(that.getTransactionDate())) return false;
        if (!getAccountNumber().equals(that.getAccountNumber())) return false;
        if (!getCurrency().equals(that.getCurrency())) return false;
        if (!getCardNumber().equals(that.getCardNumber())) return false;
        if (!getExpirationDate().equals(that.getExpirationDate())) return false;
        if (!getCustomerName().equals(that.getCustomerName())) return false;
        if (!getCvvNumber().equals(that.getCvvNumber())) return false;
        if (!getUsername().equals(that.getUsername())) return false;
        if (!getKeyId().equals(that.getKeyId())) return false;
        if (!getPhaseBit().equals(that.getPhaseBit())) return false;
        if (!getIntegrityCheck().equals(that.getIntegrityCheck())) return false;
        return getPassword().equals(that.getPassword());

    }

    @Override
    public int hashCode() {
        int result = getPaymentMethod().hashCode();
        result = 31 * result + getTransactionType().hashCode();
        result = 31 * result + (int) (getReferenceNumber() ^ (getReferenceNumber() >>> 32));
        result = 31 * result + getCustomerPhone().hashCode();
        result = 31 * result + getTransactionDate().hashCode();
        result = 31 * result + getAccountNumber().hashCode();
        result = 31 * result + getCurrency().hashCode();
        result = 31 * result + getCardNumber().hashCode();
        result = 31 * result + getExpirationDate().hashCode();
        result = 31 * result + getCustomerName().hashCode();
        result = 31 * result + getCvvNumber().hashCode();
        result = 31 * result + getUsername().hashCode();
        result = 31 * result + getPassword().hashCode();
        result = 31 * result + getKeyId().hashCode();
        result = 31 * result + getPhaseBit().hashCode();
        result = 31 * result + getIntegrityCheck().hashCode();

        return result;
    }
}
