package com.advantage.common.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Binyamin Regev on 17/11/2015.
 */
public enum YesNoReply {

    YES('Y'),
    NO('N');

    private char replyTypeChar;

    private String replyTypeString;

    YesNoReply(char replyTypeChar) {
        this.replyTypeChar = replyTypeChar;
    }

    public char getReplyTypeChar() {
        return replyTypeChar;
    }

    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>();

        for (YesNoReply a : YesNoReply.values()) {
            values.add(a.name());
        }
        return values;
    }

    public static boolean contains(String test) {

        for (YesNoReply a : YesNoReply.values()) {
            if (a.name().equals(test)) {
                return true;
            }
        }

        return false;
    }

}
