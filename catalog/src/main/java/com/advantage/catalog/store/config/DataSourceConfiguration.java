package com.advantage.catalog.store.config;

import com.advantage.catalog.store.init.DataSourceInitByJson;
import com.advantage.common.SystemParameters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by kubany on 10/11/2015.
 */
@Configuration
public class DataSourceConfiguration extends com.advantage.common.config.DataSourceCommonConfiguration {

    public DataSourceConfiguration() {
        super("catalog.");
    }

    //public static boolean hardReset = true;

    @Bean(initMethod = "init")
    public DataSourceInitByJson initData() {
        return new DataSourceInitByJson();
    }

}
