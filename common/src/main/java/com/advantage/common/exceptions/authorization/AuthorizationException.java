package com.advantage.common.exceptions.authorization;

import org.springframework.http.HttpStatus;

/**
 * Created by Evgeney Fiskin on 24-01-2016.
 */
public class AuthorizationException extends Exception {
    private HttpStatus httpStatus;

    public AuthorizationException(String s, HttpStatus httpStatus) {
        super(s);
        this.httpStatus = httpStatus;
    }

    public AuthorizationException(Exception e, HttpStatus httpStatus) {
        super(e);
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
