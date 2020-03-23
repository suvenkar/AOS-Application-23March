package com.advantage.common.security;

import com.advantage.common.enums.AccountType;
import com.advantage.common.exceptions.token.*;
import io.jsonwebtoken.*;
import org.apache.log4j.Logger;

import java.util.Map;

/**
 * Created by Evgeney Fiskin on 02-01-2016.
 */
public class TokenJWT extends Token {

    private static final Logger logger = Logger.getLogger(TokenJWT.class);

    private Claims tokenClaims;
    private Header tokenHeader;
    private JwtBuilder builder;
    private SignatureAlgorithm signatureAlgorithm;
    //private CompressionCodec compressionCodec;

    private JwtParser parser;
    private long userId;
    private String userName;
    private AccountType accountType;

    private TokenJWT() {
        super();
        //compressionCodec = SecurityTools.getCompressionCodec();
        convertSignatureAlgorithm();
    }

    public static TokenJWT createToken(long appUserId, String loginName, AccountType accountType) {
        TokenJWT result = new TokenJWT();

        result.userId = appUserId;
        result.userName = loginName;
        result.accountType = accountType;

        result.builder = Jwts.builder();
        result.tokenHeader = Jwts.header();
        result.tokenHeader.setType(Header.JWT_TYPE);
        result.tokenClaims = Jwts.claims();
        result.tokenClaims.setIssuer(result.issuer);
        //tokenClaims.setIssuedAt(new Date());
        result.tokenClaims.put(USER_ID_FIELD_NAME, appUserId);
        if (loginName != null && !loginName.isEmpty()) {
            result.tokenClaims.setSubject(loginName);
        }
        result.tokenClaims.put(ROLE_FIELD_NAME, accountType);
//        if (email != null && !email.isEmpty()) {
//            tokenClaims.put("email", email);
//        }
        result.builder.setHeader((Map<String, Object>) result.tokenHeader);
        result.builder.setClaims(result.tokenClaims);
        return result;
    }

    public static TokenJWT parseToken(String base64Token) throws VerificationTokenException, WrongTokenTypeException, ContentTokenException {
        TokenJWT result = new TokenJWT();
        try {
            result.parser = Jwts.parser();
            if (!result.parser.isSigned(base64Token)) {
                TokenUnsignedException e = new TokenUnsignedException("Token is unsigned");
                logger.error("Token is unsigned", e);
                throw e;
            }
            result.parser.setSigningKey(result.key);
            result.parser.requireIssuer(result.issuer);
            Jws<Claims> claimsJws = result.parser.parseClaimsJws(base64Token);
            result.tokenClaims = claimsJws.getBody();
            JwsHeader jwsHeader = claimsJws.getHeader();

            if (!jwsHeader.getType().equals(Header.JWT_TYPE)) {
                WrongTokenTypeException e = new WrongTokenTypeException("Wrong token type");
                logger.error("Wrong token type", e);
                throw e;
            }
            if (!jwsHeader.getAlgorithm().equals(result.signatureAlgorithm.name())) {
                String m = String.format("The token signed by %s algorithm, but must be signed with %s (%s)",
                        jwsHeader.getAlgorithm(), result.signatureAlgorithm.name(), result.signatureAlgorithmJdkName);
                SignatureAlgorithmException e = new SignatureAlgorithmException(m);
                logger.error(m, e);
                throw e;
            }
            result.extractUserId();
            result.extractLoginName();
            result.extractAccountType();
        } catch (ClaimJwtException | RequiredTypeException e) {
            throw new VerificationTokenException(e.getMessage());
        } catch (SignatureException e) {
            throw new SignatureAlgorithmException(e.getMessage());
        } catch (MalformedJwtException | CompressionException | UnsupportedJwtException e) {
            throw new ContentTokenException(e.getMessage());
        }
        return result;
    }

    private void extractAccountType() {
        String role = (String) tokenClaims.get(ROLE_FIELD_NAME);
        AccountType result = AccountType.valueOf(role);
        this.accountType = result;
    }


    private void extractUserId() throws ContentTokenException {
        long result = 0;
        Object o = "null";

        try {
            o = tokenClaims.get(USER_ID_FIELD_NAME);
            if (o == null) {
                throw new ContentTokenException("The token must contains " + USER_ID_FIELD_NAME + " field");
            }
            Number userId = (Number) o;
            result = userId.longValue();
        } catch (ClassCastException | NumberFormatException e) {
            throw new ContentTokenException("User id have wrong number: " + o.toString());
        }
        this.userId = result;
    }


//    @Override

    private void extractLoginName() {
        this.userName = (String) tokenClaims.getSubject();
    }


    @Override
    public String generateToken() {
        builder.signWith(signatureAlgorithm, key);
//        if (compressionCodec != null) {
//            builder.compressWith(compressionCodec);
//        }
        String result = builder.compact();
        return result;
    }

    @Override
    public Map<String, Object> getClaims() {
        return tokenClaims;
    }

    private void convertSignatureAlgorithm() {
        for (SignatureAlgorithm sa : SignatureAlgorithm.values()) {
            String saname = (sa.getJcaName() == null) ? "" : sa.getJcaName();
            if (saname.equalsIgnoreCase(signatureAlgorithmJdkName)) {
                if (!sa.isJdkStandard()) {
                    throw new SignatureException("io.jsonwebtoken: Unsupported signature algorithm:" + signatureAlgorithmJdkName);
                } else {
                    signatureAlgorithm = sa;
                    return;
                }
            }
        }
        throw new SignatureException("io.jsonwebtoken: Unknown signature algorithm:" + signatureAlgorithmJdkName);
    }

    //    }
//        return (String) tokenClaims.get("email");
//    public String getEmail() {
    @Override
    public AccountType getAccountType() {
        return accountType;
    }

    @Override
    public long getUserId() {
        return userId;
    }

    @Override
    public String getLoginName() {
        return userName;
    }

}
