package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Binyamin Regev on 21/12/2015.
 */
public enum ResponseEnum {
    /* Response status to request */
    OK("Ok"),
    FAILURE("Failure"),

    /* Request approved */
    APPROVED("Approved"),

    /* Error found in request parameters */
    ERROR("Error"),

    /* request rejected */
    REJECTED("Rejected");

    private String stringCode;

    ResponseEnum(String stringCode) {
        this.stringCode = stringCode;
    }

    public String getStringCode() {
        return this.stringCode;
    }

    /**
     * Return {@link List} of {@link String} with all {@code enum} values.
     *
     * @return {@link List} of {@link String} with all {@code enum} values.
     */
    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>();

        for (ResponseEnum a : ResponseEnum.values()) {
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

        for (ResponseEnum a : ResponseEnum.values()) {
            if (a.name().equals(test)) {
                return true;
            }
        }

        return false;
    }

}
