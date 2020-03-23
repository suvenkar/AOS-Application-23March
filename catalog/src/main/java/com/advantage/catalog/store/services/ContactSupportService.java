package com.advantage.catalog.store.services;

import com.advantage.common.dto.ContactUsMailRequest;
import com.advantage.common.dto.ContactUsResponse;
import com.advantage.root.util.ArgumentValidationHelper;
import com.advantage.root.util.ValidationHelper;
import org.springframework.stereotype.Service;

/**
 * This is a MOCK service, it's always successful, always returns "OK".
 * @author Binyamin Regev on 02/02/2016.
 */
@Service
public class ContactSupportService {
    private static int SUCCESS = 1;
    private static int FAILURE = -1;

    private static String MESSAGE_SUCCESS = "Thank you for contacting Advantage support.";
    private static String MESSAGE_INVALID_EMAIL_ADDRESS = "Invalid e-mail address.";


    public ContactUsResponse sendMail(ContactUsMailRequest contactUs) {
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(contactUs.getEmail(), "user e-mail address");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(contactUs.getText(), "e-mail text");

        ContactUsResponse response;

        if (ValidationHelper.isValidEmail(contactUs.getEmail())) {
            response = new ContactUsResponse(true, MESSAGE_SUCCESS, SUCCESS);
        }
        else {
            response = new ContactUsResponse(false, MESSAGE_INVALID_EMAIL_ADDRESS, FAILURE);
        }

        return response;
    }
}
