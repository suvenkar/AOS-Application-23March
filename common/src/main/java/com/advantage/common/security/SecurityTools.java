package com.advantage.common.security;

import com.advantage.common.dto.AppUserDto;
import com.advantage.common.enums.AccountType;
import com.advantage.common.exceptions.authorization.AuthorizationException;
import com.advantage.common.exceptions.token.ContentTokenException;
import com.advantage.common.exceptions.token.VerificationTokenException;
import com.advantage.common.exceptions.token.WrongTokenTypeException;
import com.advantage.common.utils.SoapApiHelper;
import com.google.common.base.Throwables;
import org.springframework.http.HttpStatus;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.soap.SOAPException;
import java.nio.charset.Charset;
import java.security.Key;
import java.util.Base64;

import static org.springframework.http.HttpStatus.*;

/**
 * Created by Evgeney Fiskin on 02-01-2016.
 */
public class SecurityTools {
    private static final String ISSUER = "www.advantageonlineshopping.com";
    private static final String BASE64_CRYPTO_KEY = "0KHQvtGA0L7QuiDRgtGL0YHRj9GHINC+0LHQtdC30YzRj9C9INCyINC20L7Qv9GDINGB0YPQvdGD0LvQuCDQsdCw0L3QsNC9IMKpINChLiDQm9GD0LrRjNGP0L3QtdC90LrQvi4=";

    private static final String signatureAlgorithmName = "HmacSHA256";
    //    private static final String signatureAlgorithmName = "HmacSHA512";
    //    private static final CompressionCodec compressionCodec = null;
    //public static final CompressionCodec compressionCodec = new GzipCompressionCodec();
    private static final Key key = decodeBase64Key(BASE64_CRYPTO_KEY);
    //    public static final String SWAGGER_NOTE = "For authorization as USER with ID = 1 (\"avinu.avraham\", password \"Avraham1\", email \"a@b.com\") use token  \"<span style=\"font-family:Courier New;font-size:0.75em\">Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuYWR3YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxLCJzdWIiOiJhdmludS5hdnJhaGFtIiwicm9sZSI6IlVTRVIifQ.sadgAYdH5xlqqNFlA_eVoV-ttyL5hgHLdmF5ScMoWEw</span>\".<br/>For authorization as ADMIN with ID = 13 (\"admin\", password \"adm1n\", email \"admin@admin.ad\") use token  \"<span style=\"font-family:Courier New;font-size:0.75em\">Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuYWR3YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxMywic3ViIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4ifQ.XssBjww5LFdYt6ONUYCcJDvdIJinQN1TI_ehyhcdylA</span>\"<br/>Or just generate your ouwn in page <a href=\"http://jwt.io/\">jwt.io</a> with base64 secret key \"<span style=\"font-family:Courier New;font-size:0.75em\">" + BASE64_CRYPTO_KEY + "</span>\"";
    public static final String SWAGGER_NOTE = "Create your own JSON Web Token with <a href=\"http://jwt.io/\" target=\"_blank\">jwt.io site</a> with your Base64 secret key with this template: <br/>{" +
            "<ul style=\"list-style-type:none;margin: 0 0 0 0;\">" +
            "  <li>\"typ\": \"JWT\",</li>" +
            "  <li>\"alg\": \"HS256\"</li>" +
            "</ul>}" +
            "<br/>{" +
            "<ul style=\"list-style-type:none;margin: 0 0 0 0;\">" +
            "<li>\"iss\": \"www.advantageonlineshopping.com\",</li>" +
            "<li>  \"userId\": [user id],</li>" +
            "<li>  \"sub\": \"[user name]\",</li>" +
            "<li>  \"role\": \"USER\" / \"ADMIN\"</li>" +
            "</ul>}";
    private static final String AUTHORIZATION_HEADER_PREFIX_BEARER = "Bearer";
    private static final String AUTHORIZATION_HEADER_PREFIX_BASIC = "Basic";


    static String getSignatureAlgorithmName() {
        return signatureAlgorithmName;
    }

//    private static String encodeBase64Key(Key key) {
//        byte[] keyEncoded = key.getEncoded();
//        return Base64.getEncoder().encodeToString(keyEncoded);
//    }

    private static Key decodeBase64Key(String base64Key) {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        return new SecretKeySpec(decodedKey, signatureAlgorithmName);
    }

    public static String decodeBase64(String base64) {
        byte[] decodedKey = Base64.getDecoder().decode(base64);
        return new String(decodedKey, Charset.forName("UTF-8"));
    }

    public static String encodeBase64(String source){
        return Base64.getEncoder().encodeToString(source.getBytes());
    }

    public static Key getKey() {
        return key;
    }

//    public static CompressionCodec getCompressionCodec() {
//        return compressionCodec;
//    }

    static String getIssuer() {
        return ISSUER;
    }

    static boolean isAuthorized(String authorizationHeader, AccountType... expectedAccountTypes) throws AuthorizationException {
        boolean isBasic = isBasic(authorizationHeader);
        if (authorizationHeader == null || authorizationHeader.trim().isEmpty()) {
            throw new AuthorizationException("Authorization header is missing", UNAUTHORIZED);
        } else {
            if (!authorizationHeader.contains(AUTHORIZATION_HEADER_PREFIX_BEARER) && !isBasic) {
                throw new AuthorizationException("Authorization header is wrong", UNAUTHORIZED);
            } else {
                if (isBasic) {
                    return isAuthorizedByBasic(authorizationHeader, expectedAccountTypes);
                } else {
                    return isAuthorizedByBearer(authorizationHeader, expectedAccountTypes);
                }
            }
        }
    }

    static boolean isAuthorized(String authorizationHeader, long expectedUserId, AccountType... expectedAccountTypes) throws Exception {
        boolean isBasic = isBasic(authorizationHeader);
        if (authorizationHeader == null || authorizationHeader.trim().isEmpty()) {
            throw new AuthorizationException("Authorization header is missing", UNAUTHORIZED);
        } else {
            if (!authorizationHeader.contains(AUTHORIZATION_HEADER_PREFIX_BEARER) && !isBasic) {
                throw new AuthorizationException("Authorization header is wrong", UNAUTHORIZED);
            } else {
                if (isBasic) {
                    return isAuthorizedByBasic(authorizationHeader, expectedUserId, expectedAccountTypes);
                } else {
                    return isAuthorizedByBearer(authorizationHeader, expectedUserId, expectedAccountTypes);
                }
            }
        }
    }

    public static boolean isBasic(String authorizationHeader) {
        return authorizationHeader.contains(AUTHORIZATION_HEADER_PREFIX_BASIC);
    }

    private static boolean isAuthorizedByBasic(String authorizationHeader, long expectedUserId, AccountType[] expectedAccountTypes) throws VerificationTokenException {
        AppUserDto actualUser;
        actualUser = getAppUserDto(authorizationHeader);
        long actualUserId = actualUser.getUserId();
        if (actualUserId != expectedUserId) {
            throw new VerificationTokenException("You authenticated with user Id (" + actualUserId + "), but request is for user (" + expectedUserId + ")");
        }
        if (verifyAccountType(expectedAccountTypes, actualUser)) {
            return true;
        }
        throw new VerificationTokenException("Wrong account type (" + actualUser.getAccountType() + ")");
    }

    private static boolean isAuthorizedByBasic(String authorizationHeader, AccountType[] expectedAccountTypes) throws VerificationTokenException {
        AppUserDto actualUser;
        actualUser = getAppUserDto(authorizationHeader);
        if (verifyAccountType(expectedAccountTypes, actualUser)) {
            return true;
        }
        throw new VerificationTokenException("Wrong account type (" + actualUser.getAccountType() + ")");
        //throw new VerificationTokenException("Wrong account type (" + actualUser.getAccountType() + ") " + Throwables.getStackTraceAsString(e));
    }

    private static boolean verifyAccountType(AccountType[] expectedAccountTypes, AppUserDto actualUser) {
        for (AccountType at : expectedAccountTypes) {
            int expectedAccountType = at.getAccountTypeCode();
            if (expectedAccountType == actualUser.getAccountType()) {
                return true;
            }
        }
        return false;
    }

    private static AppUserDto getAppUserDto(String authorizationHeader) throws VerificationTokenException {
        AppUserDto actualUser;
        try {
            String basicToken = getBasicTokenFromAuthorizationHeader(authorizationHeader);
            String[] loginPassword = basicToken.split(":");
            actualUser = SoapApiHelper.getUserByLogin(loginPassword[0], authorizationHeader);
            if (!(loginPassword[0].equals(actualUser.getLoginUser())
                    && SoapApiHelper.encodePassword(loginPassword[0], loginPassword[1], actualUser.getUserId(), "Basic "+encodeBase64(basicToken))
                    .equals(actualUser.getLoginPassword()))) {
                throw new VerificationTokenException("Wrong authorization token");
                //throw new VerificationTokenException("Wrong authorization token" + Throwables.getStackTraceAsString(e));
            }
        } catch (SOAPException e) {
            //throw new VerificationTokenException("Wrong authorization token");
            throw new VerificationTokenException("Some authentication error. " + Throwables.getStackTraceAsString(e));
        }
        return actualUser;
    }

    private static boolean isAuthorizedByBearer(String authorizationHeader, long expectedUserId, AccountType[] expectedAccountTypes) throws VerificationTokenException, WrongTokenTypeException, ContentTokenException {
        Token token = getTokenFromAuthorizationHeader(authorizationHeader);
        AccountType actualAccountType = token.getAccountType();
        long actualUserId = token.getUserId();
        if (actualUserId != expectedUserId) {
            throw new VerificationTokenException("You authenticated with user Id (" + actualUserId + "), but request is for user (" + expectedUserId + ")");
            //throw new VerificationTokenException("You authenticated with user Id (" + actualUserId + "), but request is for user (" + expectedUserId + ") " + Throwables.getStackTraceAsString(e));
        }
        for (AccountType at : expectedAccountTypes) {
            if (at.equals(actualAccountType)) {
                return true;
            }
        }
        throw new VerificationTokenException("Wrong account type (" + actualAccountType.toString() + ")");
    }


    private static boolean isAuthorizedByBearer(String authorizationHeader, AccountType[] expectedAccountTypes) throws VerificationTokenException, WrongTokenTypeException, ContentTokenException {
        Token token = getTokenFromAuthorizationHeader(authorizationHeader);
        AccountType actualAccountType = token.getAccountType();
        for (AccountType at : expectedAccountTypes) {
            if (at.equals(actualAccountType)) {
                return true;
            }
        }
        throw new VerificationTokenException("Wrong account type (" + actualAccountType.toString() + ")");
    }

//    public static boolean isAuthorized(String authorizationHeader, String expectedUserName, AccountType... expectedAccountTypes) throws AuthorizationException {
//        if (authorizationHeader == null || authorizationHeader.trim().isEmpty()) {
//            throw new AuthorizationException("Authorization header is missing", HttpStatus.UNAUTHORIZED);
//        } else {
//            // remove schema from token
//            if (!authorizationHeader.contains(AUTHORIZATION_HEADER_PREFIX_BEARER)
//                    && !authorizationHeader.contains(AUTHORIZATION_HEADER_PREFIX_BASIC)) {
//                throw new AuthorizationException("Authorization header is wrong", HttpStatus.UNAUTHORIZED);
//            } else {
//                Token token = getTokenFromAuthorizationHeader(authorizationHeader);
//                AccountType actualAccountType = token.getAccountType();
//                String actualUserName = token.getLoginName();
//                if (!actualUserName.equals(expectedUserName)) {
//                    throw new VerificationTokenException("Wrong user name (" + actualUserName + "), but the request is for user (" + expectedUserName + ")");
//                }
//                for (AccountType expectedAccountType : expectedAccountTypes) {
//                    if (expectedAccountType.equals(actualAccountType) && actualUserName.equals(expectedUserName)) {
//                        return true;
//                    }
//                }
//                throw new VerificationTokenException("Wrong account type (" + actualAccountType.toString() + ")");
//            }
//        }
//    }

    public static Token getTokenFromAuthorizationHeader(String authorizationHeader) throws VerificationTokenException, WrongTokenTypeException, ContentTokenException {
        if (authorizationHeader == null || authorizationHeader.isEmpty()) {
            return null;
        }
        String stringToken = authorizationHeader.substring(AUTHORIZATION_HEADER_PREFIX_BEARER.length()).trim();
        return TokenJWT.parseToken(stringToken);
    }

    public static String getBasicTokenFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isEmpty()) {
            return null;
        }
        String stringToken = authorizationHeader.substring(AUTHORIZATION_HEADER_PREFIX_BASIC.length()).trim();
        return decodeBase64(stringToken);
    }


}
