package com.advantage.order.store.config;

import org.springframework.context.annotation.Configuration;

/**
 * Created by kubany on 10/11/2015.
 */
@Configuration
public class DataSourceConfiguration extends com.advantage.common.config.DataSourceCommonConfiguration {
    public DataSourceConfiguration() {
        super("order.");
    }

}
