package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

public enum AccountType {

    ADMIN(10),
    USER(20),
    GUEST(30);

    private Integer accountTypeCode;

    AccountType(Integer accountTypeCode) {
        this.accountTypeCode = accountTypeCode;
    }

    public Integer getAccountTypeCode() {
        return accountTypeCode;
    }

    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>(AccountType.values().length);
        for (AccountType a : AccountType.values()) {
            values.add(a.name());
        }
        return values;
    }

    public static boolean contains(String accountType) {
        for (AccountType at : AccountType.values()) {
            if (at.name().equals(accountType)) {
                return true;
            }
        }
        return false;
    }

    public static AccountType valueOfCode(int code) {
        for (AccountType accountType : values()) {
            if(accountType.getAccountTypeCode().equals(code)) {
                return accountType;
            }
            //return null;
        }
        return null;
    }

}
