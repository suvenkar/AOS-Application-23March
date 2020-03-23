package com.advantage.catalog.store.image.impl;

import java.io.IOException;

import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ImageManagementFactory;

public class XmlImageManagementFactory extends ImageManagementFactory {

    @Override
    public ImageManagement getImageManagement(final String repositoryDirectoryPath) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(repositoryDirectoryPath,
                "repository directory path");

        try {

            return new XmlImageManagement(repositoryDirectoryPath);
        } catch (final IOException ex) {

            throw new RuntimeException(ex);
        }
    }
}