package com.advantage.catalog.store.image;

import com.advantage.catalog.store.image.impl.XmlImageManagementFactory;

public abstract class ImageManagementFactory {

    public abstract ImageManagement getImageManagement(String repositoryDirectoryPath);

    public static ImageManagementFactory getImageManagementFactory() {

        String imageManagementFactoryClassName = System.getProperty("imageManagement.factory");

        if (imageManagementFactoryClassName == null) {

            imageManagementFactoryClassName = XmlImageManagementFactory.class.getName();
        }

        try {

            final Class<?> cls = Class.forName(imageManagementFactoryClassName);
            return (ImageManagementFactory) cls.newInstance();
        } catch (final Exception ex) {

            if (ex instanceof RuntimeException) {

                throw (RuntimeException) ex;
            }

            throw new RuntimeException(ex);
        }
    }
}