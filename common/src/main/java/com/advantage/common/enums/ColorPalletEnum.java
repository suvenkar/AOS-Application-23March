package com.advantage.common.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Color pallet as received from UI.
 * Only the colors in the pallet are allowed in <i>ADM Demo App</i>.
 * @author Binyamin Regev on 28/02/2016.
 */
public enum ColorPalletEnum {
    WHITE("FFFFFF", "White"),
    BLACK("414141", "Black"),
    GRAY("C3C3C3", "Gray"),
    BLUE("3683D1", "Blue"),
    PURPLE("545195", "Purple"),
    YELLOW("FCC23D", "Yellow"),
    RED("DD3A5B", "Red"),
    TURQUOISE("55CDD5", "Turquoise"),
    UNASSIGNED("ABCDEF", "Unassigned");

    private String colorCode;
    private String colorName;

    ColorPalletEnum(String colorCode, String colorName) {
        this.colorCode = colorCode;
        this.colorName = colorName;
    }

    public String getColorCode() {
        return this.colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }

    public String getColorName() {
        return colorName;
    }

    public void setColorName(String colorName) {
        this.colorName = colorName;
    }

    public static List<String> getAllColorCodes() {
        List<String> values = new ArrayList<>();

        for (ColorPalletEnum a : ColorPalletEnum.values()) {
            values.add(a.getColorCode());
        }
        return values;
    }

    public static List<String> getAllColorNames() {
        List<String> values = new ArrayList<>();

        for (ColorPalletEnum a : ColorPalletEnum.values()) {
            values.add(a.getColorName());
        }
        return values;
    }

    public static ColorPalletEnum getColorByCode(String hexColor) {
        for (ColorPalletEnum colorEnum : ColorPalletEnum.values()) {
            if (colorEnum.getColorCode().toUpperCase().equals(hexColor.toUpperCase())) {
                return colorEnum;
            }
        }

        return null;
    }

    public static ColorPalletEnum getColorByName(String colorName) {
        for (ColorPalletEnum colorEnum : ColorPalletEnum.values()) {
            if (colorEnum.getColorName().equals(colorName)) {
                return colorEnum;
            }
        }

        return null;
    }

    public static boolean containsColorCode(String hexColor) {
        return (getColorByCode(hexColor) != null);
    }

    public static boolean containsColorName(String colorName) {
        return (getColorByName(colorName) != null);
    }

}
