package com.advantage.order.store.config;

import com.advantage.order.store.log.AdvantageDaoCallsLoggingAspect;
import com.advantage.common.security.ApiSecurityMethodInvokeAspect;
import com.advantage.order.store.log.ApiCallsLoggingAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdvantageAspects {

    @Bean
    public AdvantageDaoCallsLoggingAspect getLoggingAspect() {

        return new AdvantageDaoCallsLoggingAspect();
    }

    @Bean
    public ApiSecurityMethodInvokeAspect getAppUserAuthorization() {
        return new ApiSecurityMethodInvokeAspect();
    }

    @Bean
    public ApiCallsLoggingAspect getApiLoggingAspect() {
        return new ApiCallsLoggingAspect();
    }
}
