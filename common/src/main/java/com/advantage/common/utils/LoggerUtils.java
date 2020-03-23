package com.advantage.common.utils;

import org.springframework.core.env.Environment;

/**
 * Created by Evgeney Fiskin on Jun-2016.
 */
public class LoggerUtils {
    public static String getMinThrowableDescription(Object message,Throwable e){
        StringBuilder sb=new StringBuilder(message.toString());
        sb.append("\n");
        sb.append(e.getClass().getName()).append(": ");
        sb.append(e.getMessage());
        return sb.toString();
    }

    public static String logEnvParam(Environment environment, String s) {
        if (environment == null) {
            return "Environment is null\n";
        } else {
            return s + " = " + (environment.getProperty(s) == null ? "null" : environment.getProperty(s)) + System.lineSeparator();
        }
    }
}
