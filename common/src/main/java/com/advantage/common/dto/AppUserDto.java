package com.advantage.common.dto;

/**
 * @author Binyamin Regev on 19/11/2015.
 */
public class AppUserDto {

    private long userId;
    private String loginUser;
    private String loginPassword;
    private String email;
    private int accountType;


    public AppUserDto(String loginUser, String loginPassword, long userId, int accountType){
        this.loginUser=loginUser;
        this.loginPassword=loginPassword;
        this.userId = userId;
        this.accountType = accountType;
    }

    public String getLoginUser() {
        return loginUser;
    }

    public void setLoginUser(String loginUser) {
        this.loginUser = loginUser;
    }

    public String getLoginPassword() {
        return loginPassword;
    }

    public void setLoginPassword(String loginPassword) {
        this.loginPassword = loginPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public int getAccountType() {
        return accountType;
    }

    public void setAccountType(int accountType) {
        this.accountType = accountType;
    }
}
