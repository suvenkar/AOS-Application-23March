package com.advantage.order.store.config;

import com.advantage.common.Url_resources;
import org.apache.log4j.Logger;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.Filter;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletRegistration;

/**
 * @author Assaf Kubany on 11/10/2015.
 */
public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    private static final Logger logger = Logger.getLogger(AppInitializer.class);

    @Override
    protected Class<?>[] getRootConfigClasses() {
        logger.info(" ********************************* \n" +
                " ****** Order service start ****** \n" +
                " ********************************* ");
        return new Class[]{
                AppConfiguration.class,
                DataSourceConfiguration.class,
                AppSecurityConfig.class,
                JpaConfiguration.class,
                DataJpaConfiguration.class,
                JacksonObjectMapperConfiguration.class,
                Url_resources.class,
                AdvantageAspects.class
        };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{
                WebConfiguration.class, //
//            SwaggerConfig.class //
        };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter encodingFilter = new CharacterEncodingFilter();
        encodingFilter.setEncoding("UTF-8");
        encodingFilter.setForceEncoding(true);

        return new Filter[]{encodingFilter};
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        registration.setMultipartConfig(getMultipartConfigElement());
    }

    private MultipartConfigElement getMultipartConfigElement() {
        return new MultipartConfigElement(LOCATION, MAX_FILE_SIZE, MAX_REQUEST_SIZE, FILE_SIZE_THRESHOLD);
    }

    //private static final String LOCATION = "C:/temp/"; // Temporary location where files will be stored
    private static final String LOCATION = System.getProperty("java.io.tmpdir");
    private static final long MAX_FILE_SIZE = 5242880; // 5MB : Max file size.
    // Beyond that size spring will throw exception.
    private static final long MAX_REQUEST_SIZE = 20971520; // 20MB : Total request size containing Multi part.
    private static final int FILE_SIZE_THRESHOLD = 0; // Size threshold after which files will be written to disk

}
