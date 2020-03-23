package com.advantage.mastercredit.payment.log;

import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Aspect
public class ApiCallsLoggingAspect {
    private Logger logger;

    @Before("execution(* com.advantage.mastercredit.payment.api.*.*(..))")
    public void logApiRequest(JoinPoint joinPoint) {
        logger = Logger.getLogger(joinPoint.getSignature().getDeclaringType());
        Object[] args = joinPoint.getArgs();
        HttpServletRequest request = null;
        for (Object arg : args) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
                break;
            }
        }

        if (request != null) logApiRequest(request);
    }

    @AfterReturning(value = "execution(* com.advantage.mastercredit.payment.api.*.*(..))", returning = "result")
    public void logApiResponse(JoinPoint joinPoint, Object result) {
        logger = Logger.getLogger(joinPoint.getSignature().getDeclaringType());
        String builder = joinPoint.getSignature().getName() +
                " - Response StatusCode: " + ((ResponseEntity) result).getStatusCode();

        logger.info(builder);
    }

    private void logApiRequest(HttpServletRequest request) {
        logger.info(getLoggingRequest(request));
    }

    private String getLoggingRequest(HttpServletRequest request) {
        StringBuilder builder = new StringBuilder(request.getServletPath());
        Map<String, String[]> params = request.getParameterMap();
        if (!params.isEmpty()) builder.append("?");
        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            builder.append(entry.getKey()).append("=");
            for (String s : entry.getValue()) {
                builder.append(s).append("&");
            }
        }
        if (!params.isEmpty()) builder.delete(builder.length() - 1, builder.length());

        return builder.toString();
    }
}
