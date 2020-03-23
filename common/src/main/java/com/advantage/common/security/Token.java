package com.advantage.common.security;

import com.advantage.common.enums.AccountType;
import com.advantage.common.exceptions.token.ContentTokenException;

import java.security.Key;
import java.util.Map;

/**
 * Created by Evgeney Fiskin on 06-01-2016.
 */
public abstract class Token {
    protected static final String ROLE_FIELD_NAME = "role";
    protected static final String USER_ID_FIELD_NAME = "userId";

    protected Key key;
    protected String issuer;
    protected String signatureAlgorithmJdkName;

    protected Token() {
        key = SecurityTools.getKey();
        issuer = SecurityTools.getIssuer();
        signatureAlgorithmJdkName = SecurityTools.getSignatureAlgorithmName();
    }

    public abstract AccountType getAccountType();

    public abstract long getUserId();

    //public abstract String getEmail();

    public abstract String getLoginName();

    public abstract String generateToken();

    public abstract Map<String, Object> getClaims();
    //    public boolean validateExpirationTime();

}
