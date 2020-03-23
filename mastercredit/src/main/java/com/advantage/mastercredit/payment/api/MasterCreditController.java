package com.advantage.mastercredit.payment.api;

import com.advantage.common.Constants;
import com.advantage.common.cef.CefHttpModel;
import com.advantage.common.enums.ResponseEnum;
import com.advantage.mastercredit.payment.dto.MasterCreditDto;
import com.advantage.mastercredit.payment.dto.MasterCreditResponse;
import com.advantage.mastercredit.payment.services.MasterCreditService;
import com.advantage.mastercredit.util.DecryptionHelper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Binyamin Regev on 20/12/2015.
 */
@RestController
@RequestMapping(value = Constants.URI_API + "/v1")
public class MasterCreditController {

    private Logger logger = Logger.getLogger(MasterCreditController.class);

    @Autowired
    private MasterCreditService masterCreditService;

    @ModelAttribute
    public void setResponseHeaderForAllRequests(HttpServletResponse response) {
//        response.setHeader(com.google.common.net.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        response.setHeader("Expires", "0");
        response.setHeader("Cache-control", "no-store");
    }

    /**
     * @param masterCreditDto
     * @param request
     * @param response
     * @return {@link MasterCreditResponse} <b>MasterCredit</b> server {@code response} for <i>Payment</i> {@code request}
     */
    @RequestMapping(value = "/payments/payment", method = RequestMethod.POST)
    public ResponseEntity<MasterCreditResponse> doPayment(@RequestBody MasterCreditDto masterCreditDto,
                                                          HttpServletRequest request,
                                                          HttpServletResponse response) {
        CefHttpModel cefData = (CefHttpModel) request.getAttribute("cefData");
        if (cefData != null) {
            logger.trace("cefDataId=" + cefData.toString());
            cefData.setEventRequiredParameters(String.valueOf("/payments/payment".hashCode()),
                    "Do payment", 5);
        } else {
            logger.warn("cefData is null");
        }
        //Add Decrytion here
        logger.info("[PROTECT] Before Decryption CardNumber:"+masterCreditDto.getCardNumber());
        logger.info("[PROTECT] Before Decryption CvvNumber:"+masterCreditDto.getCvvNumber());
        //Add Decrytion here
        //Process CVV number before processing
        String tempCVV=String.valueOf(masterCreditDto.getCvvNumber());
        if (tempCVV.length()==1)
            tempCVV="00"+tempCVV;
        if (tempCVV.length()==2)
            tempCVV="0"+tempCVV;
        DecryptionHelper decryptionHelper = new DecryptionHelper();

        //decryptionHelper.DecryptExternalWithIntegrity(String.valueOf(masterCreditDto.getCardNumber()),String.valueOf(masterCreditDto.getCvvNumber()),Long.parseLong(masterCreditDto.getKeyId(), 16),Long.valueOf(masterCreditDto.getPhaseBit()),masterCreditDto.getIntegrityCheck());
        decryptionHelper.DecryptExternalWithIntegrity(String.valueOf(masterCreditDto.getCardNumber()),tempCVV,Long.parseLong(masterCreditDto.getKeyId()),Long.valueOf(masterCreditDto.getPhaseBit()),masterCreditDto.getIntegrityCheck());


        masterCreditDto.setCardNumber(Long.valueOf(decryptionHelper.getOutPlainPAN()));
        masterCreditDto.setCvvNumber(Integer.valueOf(decryptionHelper.getOutPlainCVV()));

        logger.info("[PROTECT] After Decryption CarNumber:"+masterCreditDto.getCardNumber());
        logger.info("[PROTECT] After Decryption CvvNumber:"+masterCreditDto.getCvvNumber());
        MasterCreditResponse masterCreditResponse = masterCreditService.doPayment(masterCreditDto);



        HttpStatus status;
        if (masterCreditResponse.getResponseCode().equalsIgnoreCase(ResponseEnum.APPROVED.getStringCode())) {
            status = HttpStatus.CREATED;
        } else {
            status = HttpStatus.CONFLICT;
        }
        ResponseEntity<MasterCreditResponse> result = new ResponseEntity<>(masterCreditResponse, status);

        if (logger.isDebugEnabled()) {
            logger.debug(result.toString());
        } else {
            logger.info("Status=" + status);
        }
        return result;
    }

//    /**
//     * Sends <i>Refund</i> {@code request} to <b>MasterCredit</b> server and receives its {@code response}.
//     * @see <a href="http://www.iana.org/assignments/http-status-codes">HTTP Status Code Registry</a>
//     * @see <a href="http://en.wikipedia.org/wiki/List_of_HTTP_status_codes">List of HTTP status codes - Wikipedia</a>
//     * @param paymentId {@code long}. <b>MasterCredit</b> unique payment identification.
//     * @param masterCreditDto <b>MasterCredit</b> <i>Refund</i> {@code request} data.
//     * @param request {@link HttpServletRequest}. Handled Internally.
//     * @param response {@link HttpServletResponse}. Handled Internally.
//     * @return {@link MasterCreditResponse} <b>MasterCredit</b> server {@code response} for <i>Refund</i> {@code request}
//     */
//    @RequestMapping(value = "/payments/{payment_id}/refund", method = RequestMethod.POST)
//    public ResponseEntity<MasterCreditResponse> doRefund(@RequestBody MasterCreditDto masterCreditDto,
//                                                         @PathVariable("payment_id") long paymentId,
//                                                         HttpServletRequest request,
//                                                         HttpServletResponse response) {
//
//        MasterCreditResponse masterCreditResponse = masterCreditService.doRefund(paymentId, masterCreditDto);
//
//        if (masterCreditResponse.getResponse().equalsIgnoreCase(ResponseEnum.APPROVED.getStringCode())) {
//            return new ResponseEntity<>(masterCreditResponse, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(masterCreditResponse, HttpStatus.CONFLICT);   //  Something went wrong
//        }
//
//    }

}
