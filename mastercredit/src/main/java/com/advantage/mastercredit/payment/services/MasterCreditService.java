package com.advantage.mastercredit.payment.services;

import com.advantage.mastercredit.payment.dto.MasterCreditDto;
import com.advantage.mastercredit.payment.dto.MasterCreditResponse;
import com.advantage.common.enums.ResponseEnum;
import com.advantage.common.enums.TransactionTypeEnum;
import com.advantage.mastercredit.util.ArgumentValidationHelper;
import com.advantage.root.util.StringHelper;
import com.advantage.root.util.ValidationHelper;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

import static com.advantage.root.util.StringHelper.convertStringToDate;

/**
 * <b>MasterCredit</b> MOCK server service. <br/>
 * The {@link MasterCreditResponse#referenceNumber} is set from {@code static}
 * {@link AtomicLong} type property.
 *
 * @author Binyamin Regev on 21/12/2015.
 * @see AtomicLong
 */
@Service
@Transactional
public class MasterCreditService {

    private static AtomicLong masterCreditRefNumber;

    private Logger logger = Logger.getLogger(MasterCreditService.class);

    public MasterCreditService() {

        long result = new Date().getTime();

        //  If more than 10 digits than take the 10 right-most digits
        if (result > 9999999999L) {
            result %= 10000000000L;
        }

        //  10 - 10 = 0 => Math.pow(10, 0) = 1 => result *= 1 = result
        int power = 10 - String.valueOf(result).length();
        result *= Math.pow(10, power);

        masterCreditRefNumber = new AtomicLong(result);
    }

    /**
     * {@link AtomicLong#getAndIncrement()} increments the value by 1 and
     * returns the previous value, before the incrementation.
     *
     * @return Value of {@code masterCreditRefNumber} before incrementation.
     */
    public static long referenceNumberNextValue() {
        return masterCreditRefNumber.getAndIncrement();
    }

    /**
     * Do <i>MOCK</i> <b>MasterCredit</b> payment. <br/>
     * Payment is successful unless{@link MasterCreditDto} {@code transactionDate}
     * did not occur yet (is in the future).
     *
     * @param masterCreditDto {@link MasterCreditDto} with payment {@code request} data.
     * @return {@link MasterCreditResponse} <b>MasterCredit</b> server {@code response} information.
     */
    @Transactional
    public MasterCreditResponse doPayment(MasterCreditDto masterCreditDto) {

        ArgumentValidationHelper.validateArgumentIsNotNull(masterCreditDto, "MasterCredit request data");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(masterCreditDto.getTransactionType(), "MasterCredit transaction type");

        MasterCreditResponse responseStatus = new MasterCreditResponse();

        responseStatus.setTransactionType(TransactionTypeEnum.PAYMENT.getStringCode().toUpperCase());
        responseStatus.setTransactionDate(masterCreditDto.getTransactionDate());

        boolean isValid = true;
        StringBuilder sb = new StringBuilder();

        //  Validate Request Fields values
        /*  Card number */
        if (!ValidationHelper.isValidMasterCreditCardNumber(String.valueOf(masterCreditDto.getCardNumber()))) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'card number\' value=" + masterCreditDto.getCardNumber());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }

        if (isValid) {
            /*  Expiration Date */
            switch (masterCreditDto.getExpirationDate().substring(0, 2)) {
                case "01":
                case "03":
                case "05":
                case "07":
                case "08":
                case "10":
                case "12":
                    sb = new StringBuilder("31.");
                    break;
                case "04":
                case "06":
                case "09":
                case "11":
                    sb = new StringBuilder("30.");
                    break;
                default:
                    //  "02" is left - "28." or "29."
                    if (Integer.valueOf(masterCreditDto.getExpirationDate().substring(2, 6))%4 == 0) {
                        sb = new StringBuilder("29.");
                    } else {
                        sb = new StringBuilder("28.");
                    }
            }

            sb.append(masterCreditDto.getExpirationDate().substring(0, 2))
                    .append('.')
                    .append(masterCreditDto.getExpirationDate().substring(2, 6));

            Date expirationDate = StringHelper.convertStringToDate(sb.toString(), "dd.MM.yyyy");

            if (expirationDate.before(new Date())) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("MasterCredit card has expired. \'expiration date\' " + masterCreditDto.getExpirationDate() + " has passed");
                responseStatus.setReferenceNumber(0);
                isValid = false;
            } else {
                if (!ValidationHelper.isValidDate(sb.toString())) {
                    responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                    responseStatus.setResponseReason("Wrong field value. Field \'expiration date\' value=" + masterCreditDto.getExpirationDate());
                    responseStatus.setReferenceNumber(0);
                    isValid = false;
                }
            }
        }

        if (isValid) {
            /*  Card holder full name */
            if (!ValidationHelper.isValidFullName(masterCreditDto.getCustomerName())) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'customer name\' value=" + masterCreditDto.getCustomerName());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

//        if (isValid) {
//            /*  Customer phone  */
//            if (!ValidationHelper.isValidPhoneNumber(masterCreditDto.getCustomerPhone())) {
//                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
//                responseStatus.setResponseReason("Wrong field value. Field \'customer phone\' value=" + masterCreditDto.getCustomerPhone());
//                responseStatus.setReferenceNumber(0);
//                isValid = false;
//            }
//        }

        if (isValid) {
            /*  CVV Number  */
            String tempCVV=String.valueOf(masterCreditDto.getCvvNumber());
            if(tempCVV.length()==1)
                tempCVV = "00"+tempCVV;
            if(tempCVV.length()==2)
                tempCVV="0"+tempCVV;
            if (!ValidationHelper.isValidMasterCreditCVVNumber(tempCVV)) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'CVV Number\' value=" + masterCreditDto.getCvvNumber());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

        if (isValid) {
            /*  Transaction Date    */
            if (masterCreditDto.getTransactionDate() == null) {
                masterCreditDto.setTransactionDate(new SimpleDateFormat("ddMMyyyy").format(new Date()));
            }

            sb = new StringBuilder(masterCreditDto.getTransactionDate().substring(0, 2))
                    .append('.')
                    .append(masterCreditDto.getTransactionDate().substring(2, 4))
                    .append('.')
                    .append(masterCreditDto.getTransactionDate().substring(4, 8));
            if (!ValidationHelper.isValidDate(sb.toString())) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'transaction date\' value=" + masterCreditDto.getTransactionDate());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

        if (isValid) {
            /*  receiving card account number   */
            if (!ValidationHelper.isValidMasterCreditAccountNumber(String.valueOf(masterCreditDto.getAccountNumber()))) {
                responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
                responseStatus.setResponseReason("Wrong field value. Field \'receiving card account number\' value=" + masterCreditDto.getAccountNumber());
                responseStatus.setReferenceNumber(0);
                isValid = false;
            }
        }

        if ((masterCreditDto.getValue() < 0) || (10000000000.00 < masterCreditDto.getValue())) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'receiving amount value\' value=" + masterCreditDto.getValue());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }
        else {
            logger.debug("masterCreditDto.getValue=" + masterCreditDto.getValue() + " : true");
        }

        if (masterCreditDto.getCurrency() == null) {
            masterCreditDto.setCurrency("USD");
        }

        if (!ValidationHelper.isValidCurrency(masterCreditDto.getCurrency())) {
            responseStatus.setResponseCode(ResponseEnum.ERROR.getStringCode());
            responseStatus.setResponseReason("Wrong field value. Field \'receiving amount currency\' value=" + masterCreditDto.getCurrency());
            responseStatus.setReferenceNumber(0);
            isValid = false;
        }

        if (isValid) {
            /*
                IF TransactionDate > Today Then Transaction REJECTED (Payment Failed)
                IF TransactionDate <= Today Then Transaction APPROVED (Payment Successful)
             */
            Date date = convertStringToDate(sb.toString(), "dd.MM.yyyy");
            if (date.getTime() > new Date().getTime()) {
                responseStatus.setResponseCode(ResponseEnum.REJECTED.getStringCode());
                responseStatus.setResponseReason("Payment rejected");
                responseStatus.setReferenceNumber(0);
            } else {
                logger.info("Payment Approved");
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
     * @return {@link MasterCreditResponse} <b>MasterCredit</b> server {@code response} to {@code request} received.
     */
    @Transactional
    public MasterCreditResponse doRefund(long paymentId, MasterCreditDto dto) {
        MasterCreditResponse responseStatus = new MasterCreditResponse();

        responseStatus.setTransactionType(TransactionTypeEnum.REFUND.getStringCode().toUpperCase());
        responseStatus.setResponseCode(ResponseEnum.APPROVED.getStringCode());
        responseStatus.setResponseReason(ResponseEnum.APPROVED.getStringCode());
        responseStatus.setReferenceNumber(this.referenceNumberNextValue());
        responseStatus.setTransactionDate(new SimpleDateFormat("ddMMyyyy").format(new Date()));

        return responseStatus;
    }

}
