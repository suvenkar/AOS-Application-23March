package com.advantage.order_test.online.store.util;

import com.advantage.root.util.ValidationHelper;
import com.advantage.order_test.cfg.AdvantageTestContextConfiguration;
import com.advantage.order_test.online.store.dao.GenericRepositoryTests;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author Binyamin Regev on 22/11/2015.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class ValidationHelperTests extends GenericRepositoryTests {

    private static final Logger logger = Logger.getLogger(ValidationHelperTests.class);

    @Test
    public void testIsValidPhoneNumber() {
        logger.trace("@Test");
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("054 123 4567"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("(054) 1234567"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("(054) 123 4567"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+1 123 456 7890"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+972 54 123 4567"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+972 54 1234567"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+44 123 4567890"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+44 1234567890"));
        Assert.assertEquals(true, ValidationHelper.isValidPhoneNumber("+441234567890"));
        Assert.assertEquals(false, ValidationHelper.isValidPhoneNumber("441234567890"));
    }


    /**
     * Test validity of e-mail address
     */
    @Test
    public void testIsValidEmail() {
        logger.trace("@Test");
        Assert.assertEquals(true, ValidationHelper.isValidEmail("a@b.com"));
        Assert.assertEquals(true, ValidationHelper.isValidEmail("user2015@hpe.com"));
        Assert.assertEquals(true, ValidationHelper.isValidEmail("pmoi@gov.il"));
        Assert.assertEquals(true, ValidationHelper.isValidEmail("user_2015@java.org.il"));

        Assert.assertEquals(false, ValidationHelper.isValidEmail("pmoi#@gov.il"));
        Assert.assertEquals(false, ValidationHelper.isValidEmail("pmoi#gov.il"));
        Assert.assertEquals(false, ValidationHelper.isValidEmail("pmoi@.com"));
    }

    /**
     * Test validity of user login name
     */
    @Test
    public void testIsValidLogin() {
        logger.trace("@Test");
        Assert.assertEquals(true, ValidationHelper.isValidLogin("user2015"));
        Assert.assertEquals(true, ValidationHelper.isValidLogin("kingdavid"));
        Assert.assertEquals(true, ValidationHelper.isValidLogin("king.david"));
        Assert.assertEquals(true, ValidationHelper.isValidLogin("king.solomon"));

        // =================================================
        // Invalid login user-names
        // =================================================

        // Shorter than 3 characters
        Assert.assertEquals(false, ValidationHelper.isValidLogin("kd"));

        //  Invalid User-name: longer than 15 characters
        Assert.assertEquals(false, ValidationHelper.isValidLogin("inspector.gadget"));
    }

    /**
     * Test validity of user login password
     */
    @Test
    public void testIsValidPassword() {
        logger.trace("@Test");
        //Assert.assertEquals(true, ValidationHelper.);
        //  Valid Password. 5-10 characters long, containing digits, UPPER and lower case letters
        Assert.assertEquals(true, ValidationHelper.isValidPassword("davidK7"));
        Assert.assertEquals(true, ValidationHelper.isValidPassword("King7david"));

        // =================================================
        // Invalid passwords
        // =================================================

        //  Less than 5-chracters long
        Assert.assertEquals(false, ValidationHelper.isValidPassword("Kd5"));

        //  Password does not contain any digits or UPPER-case letter
        Assert.assertEquals(false, ValidationHelper.isValidPassword("kingdavid"));

        //  Password does not contain any digits
        Assert.assertEquals(false, ValidationHelper.isValidPassword("Kingdavid"));

        //  Password too long: contains more than 10 characters
        Assert.assertEquals(false, ValidationHelper.isValidPassword("KingSolomon123"));
    }

    /**
     * Test validity of Time value by 24-hours format (from 00:00:00 to 23:59:59)
     */
    @Test
    public void testIsValidTime24h() {
        logger.trace("@Test");
        Assert.assertEquals(true, ValidationHelper.isValidTime24h("00:00:00"));
        Assert.assertEquals(true, ValidationHelper.isValidTime24h("02:34:56"));
        Assert.assertEquals(true, ValidationHelper.isValidTime24h("12:34:56"));
        Assert.assertEquals(true, ValidationHelper.isValidTime24h("13:14:15"));
        Assert.assertEquals(true, ValidationHelper.isValidTime24h("23:59:59"));
        Assert.assertEquals(false, ValidationHelper.isValidTime24h("23:60:59"));
        Assert.assertEquals(false, ValidationHelper.isValidTime24h("23:59:60"));
        Assert.assertEquals(false, ValidationHelper.isValidTime24h("24:59:59"));
    }

    /**
     * Test validity Date value with all 3 Date-Formats: European, American and Scandinavian.
     */
    @Test
    public void testIsValidDate() {
        logger.trace("@Test");
        //  European Date Format
        Assert.assertEquals(true, ValidationHelper.isValidDate("29.02.2012"));
        Assert.assertEquals(false, ValidationHelper.isValidDate("29.02.2013"));

        //  American Date Format
        Assert.assertEquals(true, ValidationHelper.isValidDate("02/29/2012"));
        Assert.assertEquals(false, ValidationHelper.isValidDate("02/29/2013"));

        //  Scandinavian Date Format
        Assert.assertEquals(true, ValidationHelper.isValidDate("2012-02-29"));
        Assert.assertEquals(false, ValidationHelper.isValidDate("2013-02-29"));
    }

}
