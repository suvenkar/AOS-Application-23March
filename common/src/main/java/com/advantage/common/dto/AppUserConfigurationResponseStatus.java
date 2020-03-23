package com.advantage.common.dto;

/**
 * @author Binyamin Regev on 01/12/2015.
 */
public class AppUserConfigurationResponseStatus {
    private int numberOfFailedLoginAttemptsBeforeBlocking;
    private long loginBlockingIntervalInMilliSeconds;
    private boolean emailAddressInLogin;
    private int productInStockDefaultValue;

    public AppUserConfigurationResponseStatus() {
    }

    public AppUserConfigurationResponseStatus(int numberOfFailedLoginAttemptsBeforeBlocking,
                                              long loginBlockingIntervalInMilliSeconds,
                                              boolean emailAddressInLogin,
                                              int productInStockDefaultValue) {
        this.numberOfFailedLoginAttemptsBeforeBlocking = numberOfFailedLoginAttemptsBeforeBlocking;
        this.loginBlockingIntervalInMilliSeconds = loginBlockingIntervalInMilliSeconds;
        this.emailAddressInLogin = emailAddressInLogin;
        this.productInStockDefaultValue = productInStockDefaultValue;
    }

    public int getNumberOfFailedLoginAttemptsBeforeBlocking() {
        return numberOfFailedLoginAttemptsBeforeBlocking;
    }

    public void setNumberOfFailedLoginAttemptsBeforeBlocking(int numberOfFailedLoginAttemptsBeforeBlocking) {
        this.numberOfFailedLoginAttemptsBeforeBlocking = numberOfFailedLoginAttemptsBeforeBlocking;
    }

    public long getLoginBlockingIntervalInMilliSeconds() {
        return loginBlockingIntervalInMilliSeconds;
    }

    public void setLoginBlockingIntervalInMilliSeconds(long loginBlockingIntervalInMilliSeconds) {
        this.loginBlockingIntervalInMilliSeconds = loginBlockingIntervalInMilliSeconds;
    }

    public boolean isEmailAddressInLogin() {
        return emailAddressInLogin;
    }

    public void setEmailAddressInLogin(boolean emailAddressInLogin) {
        this.emailAddressInLogin = emailAddressInLogin;
    }

    public int getProductInStockDefaultValue() {
        return this.productInStockDefaultValue;
    }

    public void setProductInStockDefaultValue(int productInStockDefaultValue) {
        this.productInStockDefaultValue = productInStockDefaultValue;
    }
}
