package com.advantage.catalog.store.config;

import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ImageManagementAccess;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;

import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

@Configuration
@PropertySources(value = {@PropertySource("classpath:imageManagement.properties")})
public class ImageManagementConfiguration {

    public static final String PROPERTY_IMAGE_MANAGEMENT_REPOSITORY = "advantage.imageManagement.repository";

    private static final Logger logger = Logger.getLogger(ImageManagementConfiguration.class);

    @Autowired
    private Environment environment;

    @Bean(name = "imageManagement")
    public ImageManagement getImageManagement() throws IOException {
        final String imageManagementRepository = environment.getProperty(ImageManagementConfiguration.PROPERTY_IMAGE_MANAGEMENT_REPOSITORY);
        return ImageManagementAccess.getImageManagement(getPath(imageManagementRepository));
    }

    public static String getPath(String pathArg) throws IOException {
        ClassPathResource filePath = new ClassPathResource("app.properties");
        File file = filePath.getFile();

        System.out.println(file.getPath());
        logger.debug("file.getPath() = \"" + file.getPath() + "\"");

        Properties properties = System.getProperties();
        properties.getProperty("java.vendor");

        return file.getPath().split("WEB-INF")[0] + pathArg;
    }
}