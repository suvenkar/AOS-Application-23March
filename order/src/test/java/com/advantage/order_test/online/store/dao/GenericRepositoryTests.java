package com.advantage.order_test.online.store.dao;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionDefinition;

public abstract class GenericRepositoryTests {

    @Autowired
    protected PlatformTransactionManager transactionManager;

    protected TransactionDefinition transactionDefinition;

    private static final Logger logger = Logger.getLogger(GenericRepositoryTests.class);

    public GenericRepositoryTests() {
        logger.trace("Abstract Constructor start");
        transactionDefinition = new DefaultTransactionDefinition();
        logger.trace("Abstract Constructor end");
    }
}