package com.advantage.catalog.store.image.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.advantage.catalog.store.image.ManagedImage;
import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.util.xml.XmlHelper;
import com.advantage.catalog.util.xml.XmlItem;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.util.fs.FileSystemHelper;

class XmlImageManagement implements ImageManagement {

    private static final String FILE_NAME_IMAGE_MANAGEMENT_XML = "imageManagement.xml";
    private static final String TAG_IMAGE_MANAGEMENT = "ImageManagement";

    private static final String ATT_REPOSITORY_PATH = "repository-path";
    private static final String ATT_REPOSITORY_XML = "repository-xml";

    private final String repositoryDirectoryPath;
    private final String repositoryXmlPath;
    private final Map<String, XmlManagedImage> managedImagesMap;
    private XmlItem imageManagementXmlItem;

    XmlImageManagement(final String repositoryDirectoryPath) throws IOException {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(repositoryDirectoryPath,
                "repository directory path");
        this.repositoryDirectoryPath = repositoryDirectoryPath;
        repositoryXmlPath = figureRepositoryXmlPath(repositoryDirectoryPath);
        managedImagesMap = new HashMap<>();
        FileSystemHelper.makeDirectory(repositoryDirectoryPath);

        if (FileSystemHelper.isFileExist(repositoryXmlPath)) {

            initByExistingRepositoryXml();
        } else {

            initWithoutRepositoryXml(repositoryDirectoryPath);
        }
    }

    @Override
    public ManagedImage addManagedImage(final File imageFile,
                                        final boolean copyToRepository) throws IOException {

        ArgumentValidationHelper.validateArgumentIsNotNull(imageFile, "image file");
        final UUID uid = UUID.randomUUID();
        final String uidString = uid.toString();
        final XmlManagedImage managedImage = new XmlManagedImage(this, uidString, imageFile,
                copyToRepository);
        final String managedImageId = managedImage.getId();
        managedImagesMap.put(managedImageId, managedImage);
        return managedImage;
    }

    @Override
    public ManagedImage addManagedImage(final String imageFilePath,
                                        final boolean copyToRepository) throws IOException {
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(imageFilePath, "image file path");
        final File imageFile = new File(imageFilePath);
        return addManagedImage(imageFile, copyToRepository);
    }

    @Override
    public ManagedImage addManagedImage(final byte[] byteArray, String originalFileName,
                                        final boolean copyToRepository) throws IOException {
        final UUID uid = UUID.randomUUID();
        final String uidString = uid.toString();
        final XmlManagedImage managedImage = new XmlManagedImage(this, uidString, byteArray, originalFileName,
                copyToRepository);
        final String managedImageId = managedImage.getId();
        managedImagesMap.put(managedImageId, managedImage);
        return managedImage;
    }

    @Override
    public void removeManagedImage(final String managedImageId) {
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(managedImageId, "managed image id");
        final XmlManagedImage xmlManagedImage = managedImagesMap.get(managedImageId);

        if (xmlManagedImage != null) {

            final XmlItem managedImageXmlItem = xmlManagedImage.getManagedImageXmlItem();
            imageManagementXmlItem.removeChild(managedImageXmlItem);
            managedImagesMap.remove(managedImageId);
        }
    }

    @Override
    public ManagedImage getManagedImage(final String managedImageId) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(managedImageId, "managed image id");
        return managedImagesMap.get(managedImageId);
    }

    @Override
    public List<ManagedImage> getManagedImages() {

        final Collection<XmlManagedImage> xmlManagedImages = managedImagesMap.values();
        final int managedImagesCount = xmlManagedImages.size();
        final List<ManagedImage> managedImages = new ArrayList<>(managedImagesCount);
        managedImages.addAll(xmlManagedImages);
        return managedImages;
    }

    @Override
    public void persist() throws IOException {

        final Document document = imageManagementXmlItem.getDocument();
        XmlHelper.persistDocument(document, repositoryXmlPath);
    }

    public XmlItem getImageManagementXmlItem() {

        return imageManagementXmlItem;
    }

    String figureManagedImageFilePath(final String fileName) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(fileName,
                "file name");
        final StringBuilder filePath = new StringBuilder(repositoryDirectoryPath);
        final String fileSeparator = FileSystemHelper.getFileSeparator();
        filePath.append(fileSeparator);
        filePath.append(fileName);
        return filePath.toString();
    }

    private String figureRepositoryXmlPath(final String repositoryDirectoryPath) {

        assert StringUtils.isNotBlank(repositoryDirectoryPath);

        final StringBuilder repositoryXmlPathStringBuilder = new StringBuilder(repositoryDirectoryPath);
        final String fileSeparator = FileSystemHelper.getFileSeparator();
        repositoryXmlPathStringBuilder.append(fileSeparator);
        repositoryXmlPathStringBuilder.append(XmlImageManagement.FILE_NAME_IMAGE_MANAGEMENT_XML);
        return repositoryXmlPathStringBuilder.toString();
    }

    private void initByExistingRepositoryXml() throws IOException {

        final Document document = XmlHelper.getDocument(repositoryXmlPath);
        final Element documentElement = document.getDocumentElement();
        imageManagementXmlItem = new XmlItem(documentElement);
        final String repositoryDirectoryPathFromXml = imageManagementXmlItem.getAttribute(XmlImageManagement.ATT_REPOSITORY_PATH);

        if (StringUtils.isBlank(repositoryDirectoryPathFromXml)) {

            imageManagementXmlItem.setAttribute(XmlImageManagement.ATT_REPOSITORY_PATH,
                    repositoryDirectoryPath);
            persist();
        } else if (!FileSystemHelper.matchingFileSystemPaths(repositoryDirectoryPath, repositoryDirectoryPathFromXml)) {

            throw new RuntimeException("Wrong image management repository directory path: " + repositoryDirectoryPathFromXml);
        }

        final List<XmlItem> managedImagesXmlItems = imageManagementXmlItem.getChildrenByTagName(XmlManagedImage.TAG_MANAGED_IMAGE);

        for (final XmlItem managedImageXmlItem : managedImagesXmlItems) {

            final XmlManagedImage managedImage = new XmlManagedImage(this, managedImageXmlItem);
            final String managedImageId = managedImage.getId();
            managedImagesMap.put(managedImageId, managedImage);
        }
    }

    private void initWithoutRepositoryXml(final String repositoryDirectoryPath)
            throws IOException {

        assert StringUtils.isNotBlank(repositoryDirectoryPath);

        final Document document = XmlHelper.newDocument();
        final Element element = document.createElement(XmlImageManagement.TAG_IMAGE_MANAGEMENT);
        imageManagementXmlItem = new XmlItem(element);
        element.setAttribute(XmlImageManagement.ATT_REPOSITORY_PATH, repositoryDirectoryPath);
        element.setAttribute(XmlImageManagement.ATT_REPOSITORY_XML, repositoryXmlPath);
        document.appendChild(element);
        final File[] files = FileSystemHelper.getDirectoryFiles(repositoryDirectoryPath, "png", "jpg", "gif");

        if (files != null) {
            for (final File file : files) {
                addManagedImage(file, false);
            }

            persist();
        }
    }
}