package com.advantage.safepay.payment.services;

import com.advantage.safepay.payment.dto.ResponseEnum;
import com.advantage.safepay.payment.dto.SafePayDto;
import com.advantage.safepay.payment.dto.SafePayResponse;
import com.advantage.safepay.payment.dto.TransactionTypeEnum;
import com.advantage.safepay.util.ArgumentValidationHelper;
import com.advantage.root.util.ValidationHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

/**
 * <b>MasterCredit</b> MOCK server service. <br/>
 * The {@link SafePayResponse#referenceNumber} is set from {@link AtomicLong} type property.
 *
 * @author Binyamin Regev on 21/12/2015.
 * @see AtomicLong
 */
@Service
@Transactional
public class SafePayService {

    private static AtomicLong safePayRefNumber;

    public SafePayService() {

        long result = new Date().getTime();

        //  If more than 10 digits than take the 10 right-most digits
        if (result > 9999999999L) {
            result %= 10000000000L;
        }

        //  10 - 10 = 0 => Math.pow(10, 0) = 1 => result *= 1 = result
        int power = 10 - String.valueOf(result).length();
        result *= Math.pow(10, power);

        safePayRefNumber = new AtomicLong(result);
    }

    /**
     * {@link AtomicLong#getAndIncrement()} increments the value by 1 and
     * returns the previous value, before the incrementation.
     *
     * @return Value of {@code masterCreditRefNumber} before incrementation.
     */
    public static long referenceNumberNextValue() {
        return safePayRefNumber.getAndIncrement();
    }

    /**
     * Do <i>MOCK</i> <b>MasterCredit</b> payment. <br/>
     * Payment is successful unless{@link SafePayDto} {@code transactionDate}
     * did not occur yet (is in the future).
     *
     * @param safePayDto {@link SafePayDto} with payment {@code request} data.
     * @return {@link SafePayResponse} <b>MasterCredit</b> server {@code response} information.
     */
    @Transactional
    public SafePayResponse doPayment(SafePayDto safePayDto) {

        ArgumentValidationHelper.validateArgumentIsNotNull(safePayDto, "SafePay request data");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(safePayDto.getTransactionType(), "SafePay transaction type");

        SafePayResponse responseStatus = new SafePayResponse();
        boolean isValid = true;
        if (!safePayDto.getTransactionType().equals(TransactionTypeEnum.PAYMENT.getStringCode())) {
            isValid = false;
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'SPTransactionType\' value=" + safePayDto.getTransactionType());
            responseStatus.setReferenceNumber(0);

        } else {
            responseStatus.setTransactionType(TransactionTypeEnum.PAYMENT.getStringCode());
        }
        responseStatus.setTransactionDate(safePayDto.getTransactionDate());


        StringBuilder sb = new StringBuilder();

        //  Validate Request Fields values
        /*  User name*/
        if (safePayDto.getUserName() == null | safePayDto.getUserName().length() < 1 || safePayDto.getUserName().length() > 20) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'SPUserName\' value=" + safePayDto.getUserName());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }

        /*  User name*/
        if (safePayDto.getPassword() == null | safePayDto.getPassword().length() < 1 ) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'SPPassword\' value=" + safePayDto.getPassword());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }
        else if (safePayDto.getPassword().length() > 20) {
            //  SafePay Password ENCRYPTED - Get first 20 characters
            safePayDto.setPassword(safePayDto.getPassword().substring(0, 19));
        }
        else {
            //  SafePay Password size is 1-20 characters = Typed Password as is
        }

//        if (isValid) {
//            /*  Customer phone  */
//            //if (!ValidationHelper.isValidPhoneNumber(safePayDto.getCustomerPhone())) {
//            if (!(safePayDto.getCustomerPhone() != null)) {
//                if (safePayDto.getCustomerPhone().length() > 20) {
//                    responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
//                    responseStatus.setResponseReason("Wrong field value. Field \'SPCustomerPhone\' value=" + safePayDto.getCustomerPhone());
//                    responseStatus.setReferenceNumber(0);
//                    isValid = false;
//                }
//            }
//        }

        if (isValid) {
            /*  Transaction Date    */
            sb = new StringBuilder(safePayDto.getTransactionDate().substring(0, 2))
                    .append('.')
                    .append(safePayDto.getTransactionDate().substring(2, 4))
                    .append('.')
                    .append(safePayDto.getTransactionDate().substring(4, 8));

            if (!ValidationHelper.isValidDate(sb.toString())) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'SPTransactionDate\' value=" + safePayDto.getTransactionDate());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

        if (isValid) {
            /*  receiving card account number   */
            if (!ValidationHelper.isValidSafePayAccountNumber(String.valueOf(safePayDto.getAccountNumber()))) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'SPReceivingCard.AccountNumber\' value=" + safePayDto.getAccountNumber());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

        if ((safePayDto.getValue() < 0) || (10000000000.00 < safePayDto.getValue())) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'receiving amount value\' value=" + safePayDto.getValue());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }

        if (!ValidationHelper.isValidCurrency(safePayDto.getCurrency())) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'receiving amount currency\' value=" + safePayDto.getCurrency());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }

        if (isValid) {
            if (safePayDto.getUserName().equals(safePayDto.getPassword())) {
                responseStatus.setResponseCode(ResponseEnum.REJECTED.getStringCode());
                responseStatus.setResponseReason("Payment rejected, invalid user name or password");
                responseStatus.setReferenceNumber(0);
            } else {
                responseStatus.setResponseCode(ResponseEnum.APPROVED.getStringCode());
                responseStatus.setResponseReason(ResponseEnum.APPROVED.getStringCode());
                responseStatus.setReferenceNumber(this.referenceNumberNextValue());
            }
        }

        return responseStatus;
    }

    /**
     * Do <i>Refund</i> {@code request} received and return {@code response}
     *
     * @param paymentId {@code long}. <b>MasterCredit</b> unique payment identification.
     * @param dto       {@code request} data.
     * @return {@link SafePayResponse} <b>MasterCredit</b> server {@code response} to {@code request} received.
     */
    @Transactional
    public SafePayResponse doRefund(long paymentId, SafePayDto dto) {
        SafePayResponse responseStatus = new SafePayResponse();

        responseStatus.setTransactionType(TransactionTypeEnum.REFUND.getStringCode());
        responseStatus.setResponseCode(ResponseEnum.APPROVED.getStringCode());
        responseStatus.setResponseReason(ResponseEnum.APPROVED.getStringCode());
        responseStatus.setReferenceNumber(this.referenceNumberNextValue());
        responseStatus.setTransactionDate(new SimpleDateFormat("ddMMyyyy").format(new Date()));

        return responseStatus;
    }

}
