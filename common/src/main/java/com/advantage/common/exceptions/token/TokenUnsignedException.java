package com.advantage.common.exceptions.token;

/**
 * Created by Evgeney Fiskin on 09-01-2016.
 */
public class TokenUnsignedException extends VerificationTokenException {
    public TokenUnsignedException(String s) {
        super(s);
    }
}
