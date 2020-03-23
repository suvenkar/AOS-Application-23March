package com.advantage.common_test.online.store.util;

import com.advantage.common.security.Token;
import com.advantage.common.security.TokenJWT;
import com.advantage.common.enums.AccountType;
import com.advantage.common.exceptions.token.SignatureAlgorithmException;
import org.junit.Assert;
import org.junit.Test;

//import org.springframework.beans.factory.annotation.Autowired;

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class TokenTests {
    private static final long USER_ID = 1234;
    private static final String LOGIN_NAME = "loginName";
    private static final AccountType ROLE = AccountType.ADMIN;
    private static final String token512 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ3d3cuYWR2YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxMjM0LCJzdWIiOiJsb2dpbk5hbWUiLCJyb2xlIjoiQURNSU4ifQ.roj7eKViPVAD4Avo8hBDxsX3uZRb7cY_K3Nkn-DiabMVQg8N-koW3gTUo39FtzNRymN1v8yOe3Vf3DHHK8ITfg";
    //    private static final String token256 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuYWR3YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxMjM0LCJzdWIiOiJsb2dpbk5hbWUiLCJyb2xlIjoiQURNSU4ifQ.L2gyM84JrZZOrXESX-5Ig4--2dT9TPWm61pwGRffS8A";
    private static final String token256 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuYWR2YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxMjM0LCJzdWIiOiJsb2dpbk5hbWUiLCJyb2xlIjoiQURNSU4ifQ.Z00EaPxPU0ek6JT6-6B2ypkhIssQa9I-L6-i1IrWQPc";

//    @Autowired
//    private Environment environment;

    @Test
    public void testBuildToken() throws Exception {
        Token token = TokenJWT.createToken(USER_ID, LOGIN_NAME, ROLE);
        //Assert.assertEquals(token512, token.generateToken());
        String dsds = token.generateToken();
        Assert.assertEquals(token256, token.generateToken());
        System.out.println("Test testBuildToken complete successful");
    }


    @Test
    public void testParserToken() throws Exception {
        //Token token = new TokenJWT(token512);
        Token token = TokenJWT.parseToken(token256);
        Assert.assertEquals(USER_ID, token.getUserId());
        Assert.assertEquals(LOGIN_NAME, token.getLoginName());
        Assert.assertEquals(ROLE, token.getAccountType());
        System.out.println("Test testParserToken complete successful");
    }


    @Test(expected = SignatureAlgorithmException.class)
    public void testNegative256ParserToken() throws Exception {
        Token token = TokenJWT.parseToken(token512);
        //Token token = new TokenJWT(token256);
    }
}
