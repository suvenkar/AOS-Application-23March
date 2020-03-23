package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * To keep transaction type <b>only</b> within valid values
 *
 * @author Binyamin Regev on 20/12/2015.
 */
public enum TransactionTypeEnum {
    //  When calling "setTransactionType" use "toUpperCase()" as well
    PAYMENT("Payment"), REFUND("Refund");

    private String stringCode;

    TransactionTypeEnum(String stringCode) {
        this.stringCode = stringCode;
    }

    public String getStringCode() {
        return this.stringCode;
    }

    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>();

        for (TransactionTypeEnum a : TransactionTypeEnum.values()) {
            values.add(a.name());
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

        for (TransactionTypeEnum a : TransactionTypeEnum.values()) {
            if (a.name().equals(test)) {
                return true;
            }
        }

        return false;
    }

}
