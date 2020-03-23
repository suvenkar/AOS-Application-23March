package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Author Moti Ostrovski on 03/02/2016.
 */
public enum ProductStatusEnum {
    //product block by moderator
    BLOCK("Block"),

    //product out of stock
    OUT_OF_STOCK("OutOfStock"),

    //product avalible with
    ACTIVE("Active");

    private String stringCode;
    ProductStatusEnum(String stringCode) {this.stringCode=stringCode; }

    public String getStringCode() {
        return this.stringCode;
    }
    /**
     *
     * @return list of enum
     */
    public static List<String> getAllNames() {
        List<String> values = new ArrayList<>();

        for (ProductStatusEnum a : ProductStatusEnum.values()) {
            values.add(a.name());
        }
        return values;
    }

    public static boolean contains(String test) {

        for (ProductStatusEnum a : ProductStatusEnum.values()) {
            if (a.getStringCode().equals(test)) {
                return true;
            }
        }

        return false;
    }

    public static ProductStatusEnum getValueByPropertyName(String propertyName){
        if(propertyName==null || propertyName.equals(""))
            return ACTIVE;
        switch (propertyName.toLowerCase()){
            case "active":
                return ACTIVE;
            case "block":
                return BLOCK;
            case "outofstock":
                return OUT_OF_STOCK;
            default:
                break;
        }
        return ACTIVE;
    }


}
