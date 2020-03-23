package com.advantage.catalog.store.log;

import com.advantage.catalog.util.ArgumentValidationHelper;
import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

/**
 * An aspect class for logging data access object methods calls.
 */
@Aspect
public class AdvantageDaoCallsLoggingAspect {

    @Before("execution(* com.advantage.catalog.store.dao.*.*(..))")
    public void logBeforeDaoCall(final JoinPoint joinPoint) {
        ArgumentValidationHelper.validateArgumentIsNotNull(joinPoint, "join point");
        logDaoCall(joinPoint, true);
    }

    @After("execution(* com.advantage.catalog.store.dao.*.*(..))")
    public void logAfterDaoCall(final JoinPoint joinPoint) {
        ArgumentValidationHelper.validateArgumentIsNotNull(joinPoint, "join point");
        logDaoCall(joinPoint, false);
    }

    private void logDaoCall(final JoinPoint joinPoint, final boolean before) {
        assert joinPoint != null;

        final Signature signature = joinPoint.getSignature();
        final Logger logger = Logger.getLogger(signature.getDeclaringType());
        final String daoMethodName = signature.getName();
        final StringBuilder info;

        if (before) {
            info = new StringBuilder("Before");
        } else {
            info = new StringBuilder("After");
        }

        info.append(daoMethodName);
        final String infoString = info.toString();
        logger.trace("AOP LOG:" + infoString);
    }
}