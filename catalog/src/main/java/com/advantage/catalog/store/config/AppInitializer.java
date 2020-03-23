package com.advantage.catalog.store.config;

import org.apache.log4j.Logger;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.Filter;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletRegistration;
import java.util.Properties;

/**
 * Created by kubany on 10/11/2015.
 */
public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        Logger logger = Logger.getLogger(this.getClass());
        logger.info(" *********************************** \n" +
                " ****** Catalog service start ****** \n" +
                " *********************************** ");
        if (logger.isDebugEnabled()) {
            Properties properties = System.getProperties();
            StringBuffer sb = new StringBuffer("Catalog service System properties").append(System.lineSeparator());
            properties.stringPropertyNames().stream().sorted().forEach(tempPropertyName -> sb.append("\t" + tempPropertyName).append(" = '").append(properties.getProperty(tempPropertyName)).append("'").append(System.lineSeparator()));
            logger.debug(sb.toString());
        }
        return new Class[]{
                AppConfiguration.class,
                DataSourceConfiguration.class,
                AppSecurityConfig.class,
                JpaConfiguration.class,
                DataJpaConfiguration.class,
                JacksonObjectMapperConfiguration.class,
                ImageManagementConfiguration.class,
                AdvantageAspects.class
                //,SwaggerConfiguration.class //Because in this class added @Inject Environment
        };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{
                WebConfiguration.class, //
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
