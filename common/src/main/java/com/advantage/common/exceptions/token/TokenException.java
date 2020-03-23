package com.advantage.common.exceptions.token;

import com.advantage.common.exceptions.authorization.AuthorizationException;
import org.springframework.http.HttpStatus;

/**
 * Created by Evgeney Fiskin on 09-01-2016.
 */
public class TokenException extends AuthorizationException {
    public TokenException(String s) {
        super(s, HttpStatus.FORBIDDEN);
    }

    public TokenException(Exception e) {
        super(e, HttpStatus.FORBIDDEN);
    }
}
