package com.advantage.common_test.online.store.util;

import com.advantage.common.enums.ColorPalletEnum;
import com.advantage.common_test.cfg.AdvantageTestContextConfiguration;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * @author Binyamin Regev on 28/02/2016.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class ColorPalletEnumTests {
    private final int NUMBER_OF_COLORS_IN_PALLET = 9;

    @Test
    public void testGetAllColorsByCodes() {
        List<String> colors = ColorPalletEnum.getAllColorCodes();
        Assert.assertEquals("Expecting " + NUMBER_OF_COLORS_IN_PALLET + " color codes, but got [" + colors.size() + "]", NUMBER_OF_COLORS_IN_PALLET, colors.size());

        for (String hexColor : colors) {
            ColorPalletEnum color = ColorPalletEnum.getColorByCode(hexColor);
            Assert.assertNotNull("Color [" + hexColor + "] not exists", color);
        }
    }

    @Test
    public void testGetAllColorsByNames() {
        List<String> colors = ColorPalletEnum.getAllColorNames();
        Assert.assertEquals("Expecting " + NUMBER_OF_COLORS_IN_PALLET + " color names, but got [" + colors.size() + "]", NUMBER_OF_COLORS_IN_PALLET, colors.size());

        for (String colorName : colors) {
            ColorPalletEnum color = ColorPalletEnum.getColorByName(colorName);
            Assert.assertNotNull("Color [" + colorName + "] not exists", color);
        }
    }

    @Test
    public void testAllColorsExistsByCodes() {
        List<String> colors = ColorPalletEnum.getAllColorCodes();
        Assert.assertEquals("Expecting " + NUMBER_OF_COLORS_IN_PALLET + " color codes, but got [" + colors.size() + "]", NUMBER_OF_COLORS_IN_PALLET, colors.size());

        for (String hexColor : colors) {

            Assert.assertNotNull("Color [" + hexColor + "] not exists", ColorPalletEnum.containsColorCode(hexColor));
        }
    }

    @Test
    public void testAllColorsExistsByNames() {
        List<String> colors = ColorPalletEnum.getAllColorNames();
        Assert.assertEquals("Expecting " + NUMBER_OF_COLORS_IN_PALLET + " color names, but got [" + colors.size() + "]", NUMBER_OF_COLORS_IN_PALLET, colors.size());

        for (String colorName : colors) {
            Assert.assertNotNull("Color [" + colorName + "] not exists", ColorPalletEnum.containsColorName(colorName));
        }
    }

    @Test
    public void testColorPalletEnumValues() {
        Assert.assertNotNull("Except color [Black], but got [null]", ColorPalletEnum.BLACK);
        Assert.assertNotNull("Except color [Blue], but got [null]", ColorPalletEnum.BLUE);
        Assert.assertNotNull("Except color [Gray], but got [null]", ColorPalletEnum.GRAY);
        Assert.assertNotNull("Except color [Purple], but got [null]", ColorPalletEnum.PURPLE);
        Assert.assertNotNull("Except color [Red], but got [null]", ColorPalletEnum.RED);
        Assert.assertNotNull("Except color [Turquoise], but got [null]", ColorPalletEnum.TURQUOISE);
        Assert.assertNotNull("Except color [White], but got [null]", ColorPalletEnum.WHITE);
        Assert.assertNotNull("Except color [Yello], but got [null]", ColorPalletEnum.YELLOW);

    }
}