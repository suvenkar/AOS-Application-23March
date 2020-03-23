package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Unified Payment Method names "MasterCredit" and "SafePay"
 * @author Binyamin Regev on 28/12/2015.
 */
public enum PaymentMethodEnum {
    MASTER_CREDIT(20, "MasterCredit"),
    SAFE_PAY(10, "SafePay");

    private int code;
    private String name;

    PaymentMethodEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public int getCode() {
        return this.code;
    }

    public String getName() {
        return this.name;
    }

    /**
     * Return {@link List} of {@link String} with all {@code enum} <i>names</i> values.
     *
     * @return {@link List} of {@link String} with all {@code enum} <i>names</i> values.
     */
    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>();

        for (PaymentMethodEnum a : PaymentMethodEnum.values()) {
            //values.add(a.name());
            values.add(a.getName());
        }
        return values;
    }

    /**
     * Check if {@code Enum} contains a specific value.
     *
     * @param test {@code Enum} value to check.
     * @return {@code boolean} <b>true</b> when {@code Enum} contains the value,
     * <b>false</b> otherwise.
     */
    public static boolean contains(String test) {

        for (PaymentMethodEnum a : PaymentMethodEnum.values()) {
            if (a.getName().equals(test)) {
                return true;
            }
        }

        return false;
    }

}
