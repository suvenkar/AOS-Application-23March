package com.advantage.catalog.store.image.impl;

import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ManagedImage;
import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.util.IOHelper;
import com.advantage.catalog.util.fs.FileSystemHelper;
import com.advantage.catalog.util.xml.XmlItem;
import org.w3c.dom.Element;

import java.io.File;
import java.io.IOException;

public class XmlManagedImage implements ManagedImage {

    static final String TAG_MANAGED_IMAGE = "ManagedImage";

    private static final String CHILD_TAG_ID = "Id";
    private static final String CHILD_TAG_TYPE = "Type";
    private static final String CHILD_TAG_MANAGED_FILE_NAME = "ManagedFileName";
    private static final String CHILD_TAG_MANAGED_MOBILE_FILE_NAME = "ManagedMobileFileName";
    private static final String CHILD_TAG_ORIGINAL_FILE_NAME = "OriginalFileName";

    private final XmlImageManagement xmlImageManagement;
    private final XmlItem managedImageXmlItem;
    public static boolean doResize = true;

    XmlManagedImage(final XmlImageManagement xmlImageManagement, final XmlItem xmlItem) {
        ArgumentValidationHelper.validateArgumentIsNotNull(xmlImageManagement, "xml image management");
        ArgumentValidationHelper.validateArgumentIsNotNull(xmlItem, "XML item");
        this.xmlImageManagement = xmlImageManagement;
        this.managedImageXmlItem = xmlItem;
    }

    XmlManagedImage(final XmlImageManagement xmlImageManagement, final Element element) {

        this(xmlImageManagement, new XmlItem(element));
    }


    XmlManagedImage(final XmlImageManagement xmlImageManagement, final String id,
                    final File imageFile, final boolean copyToRepository) throws IOException {

        this(xmlImageManagement, id, IOHelper.fileContentToByteArray(imageFile), imageFile.getName(), copyToRepository);
    }

    XmlManagedImage(final XmlImageManagement xmlImageManagement, final String id,
                    final byte[] imageFile, String originalFileName, final boolean copyToRepository) throws IOException {

        ArgumentValidationHelper.validateArgumentIsNotNull(xmlImageManagement, "xml image management");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(id, "id");
        ArgumentValidationHelper.validateArgumentIsNotNull(imageFile, "image file");

        final XmlItem imageManagementXmlItem = xmlImageManagement.getImageManagementXmlItem();
        managedImageXmlItem = imageManagementXmlItem.addChildXmlItem(XmlManagedImage.TAG_MANAGED_IMAGE, null);
        String idValue = copyToRepository ? id : originalFileName.split("\\.")[0];
        managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_ID, idValue);
        final String type = FileSystemHelper.extractFileExtension(originalFileName);
        managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_TYPE, type);
        managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_ORIGINAL_FILE_NAME, originalFileName);

        final String managedFileName = idValue + "." + type;
        final String managedFilePath = xmlImageManagement.figureManagedImageFilePath(managedFileName);

        if (copyToRepository) {
            IOHelper.outputInput(imageFile, managedFilePath);
            managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_MANAGED_FILE_NAME, managedFileName);
        } else {
            managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_MANAGED_FILE_NAME,
                    originalFileName);
        }

        final String compressedManagedFileName = idValue + "_m." + type;
        final String compressedManagedFilePath = xmlImageManagement.figureManagedImageFilePath(compressedManagedFileName);
        managedImageXmlItem.addChildXmlItem(XmlManagedImage.CHILD_TAG_MANAGED_MOBILE_FILE_NAME, compressedManagedFileName);
        if(doResize) {
            IOHelper.resizeImage(managedFilePath, compressedManagedFilePath);
        }


        this.xmlImageManagement = xmlImageManagement;
    }

    @Override
    public ImageManagement getImageManagement() {

        return xmlImageManagement;
    }

    @Override
    public String getId() {

        return managedImageXmlItem.getFirstChildTextContent(XmlManagedImage.CHILD_TAG_ID);
    }

    @Override
    public String getType() {

        return managedImageXmlItem.getFirstChildTextContent(XmlManagedImage.CHILD_TAG_TYPE);
    }

    @Override
    public String getManagedFileName() {

        return managedImageXmlItem.getFirstChildTextContent(XmlManagedImage.CHILD_TAG_MANAGED_FILE_NAME);
    }

    @Override
    public String getManagedMobileFileName() {

        return managedImageXmlItem.getFirstChildTextContent(XmlManagedImage.CHILD_TAG_MANAGED_MOBILE_FILE_NAME);
    }

    @Override
    public String getOriginalFileName() {

        return managedImageXmlItem.getFirstChildTextContent(XmlManagedImage.CHILD_TAG_ORIGINAL_FILE_NAME);
    }

    @Override
    public byte[] getContent() throws IOException {
        final String fileName = getManagedFileName();
        final String filePathString = xmlImageManagement.figureManagedImageFilePath(fileName);
        return IOHelper.fileContentToByteArray(filePathString);
    }

    @Override
    public byte[] getMobileContent() throws IOException {

        final String fileName = getManagedMobileFileName();
        final String filePathString = xmlImageManagement.figureManagedImageFilePath(fileName);
        return IOHelper.fileContentToByteArray(filePathString);
    }

    XmlItem getManagedImageXmlItem() {

        return managedImageXmlItem;
    }
}