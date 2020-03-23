package com.advantage.catalog.store.config;

import com.advantage.common.Constants;
import org.springframework.context.annotation.*;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;

@Configuration
@EnableAspectJAutoProxy
@ComponentScan(
        // basePackageClasses = {Constants.class},
        basePackages = {"com.advantage.catalog"},
        excludeFilters = {
                @Filter(
                        type = FilterType.ANNOTATION,
                        value = {
                                RestController.class,
                                ControllerAdvice.class,
                                Configuration.class
                        }
                )
        }
)
@PropertySources(value = {
        @PropertySource(Constants.FILE_PROPERTIES_APP),
        //@PropertySource("classpath:/database.properties"),
        @PropertySource(Constants.FILE_PROPERTIES_GLOBAL),
        @PropertySource(Constants.FILE_PROPERTIES_EXTERNAL),
        @PropertySource(Constants.FILE_PROPERTIES_INTERNAL),
        //@PropertySource(Constants.FILE_PROPERTIES_DEMO_APP),
        @PropertySource(Constants.FILE_PROPERTIES_VER_TXT)
})
public class AppConfiguration {

}