package com.advantage.root.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Helpful {@link String} methods.
 * @author Binyamin Regev on 21/12/2015.
 */
public abstract class StringHelper {

    public StringHelper() {
        throw new UnsupportedOperationException();
    }

    /**
     * Receives {@link String} containing words and capitalize the first
     * letter of each word, while making all other lettes lower case.
     *
     * @param source {@link String} to make first letter upper case and
     *               all other letters are lower case.
     * @return {@link String} in which the first is UPPER case and all
     * other letters are lower case.
     */
    public static String capitalizeFirstLetterOfEachWord(final String source, final String seperator) {
        StringBuffer res = new StringBuffer();

        //  Split by SPACE (" ")
        String[] strArr = source.split(seperator);

        //  For Each String in the array of strings
        for (String str : strArr) {

            char[] stringArray = str.trim().toCharArray();
            stringArray[0] = Character.toUpperCase(stringArray[0]);
            str = new String(stringArray);

            res.append(StringHelper.toInitCap(str)).append(" ");
        }

        return res.toString().trim();

    }

    /**
     * Receives {@link String} containing words seperated by a single
     * character or {@link String} and capitalize the firstletter of
     * each word, while making all other lettes lower case.
     * By default the seperator is {@code SPACE}.
     *
     * @param source {@link String} to make first letter upper case and
     *               all other letters are lower case.
     * @return {@link String} in which the first is UPPER case and all
     * other letters are lower case.
     */
    public static String capitalizeFirstLetterOfEachWord(final String source) {
        return capitalizeFirstLetterOfEachWord(source, "\\s");
    }

    /**
     * Receives {@link String} and capitalize its first letter.
     *
     * @param source {@link String} to make first letter upper case and
     *               all other letters are lower case.
     * @return {@link String} in which the first is UPPER case and all
     * other letters are lower case.
     */
    public static String toInitCap(final String source) {
        char[] stringArray = source.trim().toLowerCase().toCharArray();
        stringArray[0] = Character.toUpperCase(stringArray[0]);

        //System.out.print("Result: " + new String(stringArray));
        return new String(stringArray);
    }

    public static String getStringFromInputStream(InputStream inputStream) {
        StringBuilder content = new StringBuilder();

        try {
            // wrap the URLConnection in a BufferedReader
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

            String line;

            // read from the urlconnection via the bufferedreader
            while ((line = bufferedReader.readLine()) != null) {
                content.append(line + "\n");
            }
            bufferedReader.close();
            System.out.println("Content: \n" + content.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }

        return content.toString();
    }

    /**
     * Find if a {@link List} of {@link String}s contains a specific {@link String}.
     * @param stringToFind
     * @param arrayToSearch
     * @return
     */
    public static boolean isContains(final String stringToFind, List<String> arrayToSearch) {
        for (String test : arrayToSearch) {
            if (test.equals(stringToFind)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Converting {@link String} to {@link java.util.Date} according to given {@link SimpleDateFormat}.
     * For Example: <br/>
     * &quat;January 2, 2010&quat; {@link SimpleDateFormat} is &quat;mmm d, yyyy&quat;
     * @param stringDate Date as {@link String}.
     * @param dateFormat {@link SimpleDateFormat} of {@code stringDate}.
     * @return Date as java {@link java.util.Date}.
     * @throws ParseException
     */
    public static Date toDate(final String stringDate, final String dateFormat) throws ParseException {
        return new SimpleDateFormat(dateFormat).parse(stringDate);
    }

    /**
     * Convert a {@code date} given as {@link String} in {@code dateFormat} to {@link Date}.
     *
     * @param stringDate {@link String} containing valid date, e.g. "26.03.2011", "1969-06-02", "12/22/1983", etc.
     * @param dateFormat Valid {@link SimpleDateFormat}, e.g. "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", etc.
     * @return received date as {@code Java} {@link Date}.
     */
    public static Date convertStringToDate(final String stringDate, final String dateFormat) {
        Date date = null;

        try {
            date = new SimpleDateFormat(dateFormat).parse(stringDate);
        } catch (ParseException e) {
            //e.printStackTrace();
            date = null;
        }

        return date;
    }

    /**
     *
     * @param date date to return as string-date with by date-format.
     * @param dateFormat Date-format by which to format the data argument. <br/>
     *                   For example: &quot;yyyy.MM.dd.hh.mm.ss&quot;
     * @return {@link String} containing {@link Date} formatted by {@link SimpleDateFormat}.
     */
    public static String convertDateToString(final Date date, final String dateFormat) {
        return new SimpleDateFormat(dateFormat).format(date);
    }

    public static String convertDateToStringHexadecimal(final Date date) {
        String stringDate = StringHelper.convertDateToString(date, "yyyy.MM.dd.HH.mm.ss");

        StringBuilder hexDate = new StringBuilder(Integer.toHexString((Integer.valueOf(stringDate.substring(0,4))).intValue()).toUpperCase())
                .append(Integer.toHexString((Integer.valueOf(stringDate.substring(5,7))).intValue()).toUpperCase())
                .append(Integer.toHexString((Integer.valueOf(stringDate.substring(8,10))).intValue()).toUpperCase())
                .append(Integer.toHexString((Integer.valueOf(stringDate.substring(11,13))).intValue()).toUpperCase())
                .append(Integer.toHexString((Integer.valueOf(stringDate.substring(14,16))).intValue()).toUpperCase())
                .append(Integer.toHexString((Integer.valueOf(stringDate.substring(17,19))).intValue()).toUpperCase());

        return hexDate.toString();
    }

    public static boolean isNullOrEmpty(final String string) {
        return ((string == null) || (string.isEmpty()));
    }
    public static boolean isInt(final String string) {
        try {
            int intValue = Integer.parseInt(string);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static boolean isLong(final String string) {
        try {
            long longValue = Long.parseLong(string);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static boolean isBoolean(final String string) {
        try {
            boolean booleanValue = Boolean.parseBoolean(string);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static boolean isDouble(final String string) {
        try {
            double doubleValue = Double.parseDouble(string);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
