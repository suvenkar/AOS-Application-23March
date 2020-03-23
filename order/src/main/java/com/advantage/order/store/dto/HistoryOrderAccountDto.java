package com.advantage.order.store.dto;

/**
 * Author ostrovsm on 24/05/2016.
 */
public class HistoryOrderAccountDto {

    private long userId;
    private String loginName;
    private String firstName;
    private String lastName;
    private String phone;

    public HistoryOrderAccountDto(){}

    public HistoryOrderAccountDto(long userId, String loginName, String phone) {
        this.userId = userId;
        this.loginName = loginName;
        this.phone = phone;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
