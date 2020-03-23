package com.advantage.catalog.store.image;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * Image management interface.
 * <br/>
 *
 * @author eli.dali@hpe.com
 */
public interface ImageManagement {

    /**
     * Add a managed image, for the given file. Optionally, the file can be copied to the
     * image management repository.
     *
     * @param imageFile        the image file to add to the image management system.
     * @param copyToRepository a flag for telling the method, if <b>true</b>, to copy the
     *                         content of the given file, to the image management repository.
     * @return the managed image, that has just been added to the image management.
     * @throws IOException              if an I/O error occurs, in an attempt to copy the content of the
     *                                  image file to the image management repository.
     * @throws IllegalArgumentException if the given image file argument references
     *                                  <b>null</b>.
     */
    ManagedImage addManagedImage(File imageFile, boolean copyToRepository) throws IOException;

    /**
     * Add a managed image, for the file the given path. Optionally, the file in the given
     * path can be copied to the image management repository.
     *
     * @param imageFilePath    the path of the image file to add to the image management system.
     * @param copyToRepository a flag for telling the method, if <b>true</b>, to copy the
     *                         content of the given file, to the image management repository.
     * @return the managed image, that has just been added to the image management.
     * @throws IOException              if an I/O error occurs, in an attempt to copy the content of the
     *                                  image file to the image management repository.
     * @throws IllegalArgumentException if the given image file path argument references
     *                                  <b>null</b>, or if it <b>is</b> a blank string.
     */
    ManagedImage addManagedImage(String imageFilePath, boolean copyToRepository)
            throws IOException;

    ManagedImage addManagedImage(final byte[] byteArray,
                                 String originalFileName, final boolean copyToRepository) throws IOException;

    /**
     * Remove the managed image with the given id, from the image management repository.
     * <br/>
     * <b>If there is no managed image with the given id, nothing happens<b>.
     *
     * @param managedImageId the id of the managed image to remove.
     * @throws IllegalArgumentException if the given managed image id references <b>null</b>,
     *                                  or if it <b>is</b> a blank string.
     */
    void removeManagedImage(String managedImageId);

    /**
     * Get the managed image with the given id.
     *
     * @param managedImageId the id of the managed image to getAllCategoryAttributeFilter.
     * @return the managed image with the given id, or <b>null<b>, if there is no such a
     * managed image in the repository.
     * @throws IllegalArgumentException if the given managed image id references <b>null</b>,
     *                                  or if it <b>is</b> a blank string.
     */
    ManagedImage getManagedImage(String managedImageId);

    /**
     * Get all of the managed images in the image management repository.
     *
     * @return all of the managed images in the image management repository. If the repository
     * is empty, an empty list is returned.
     */
    List<ManagedImage> getManagedImages();

    /**
     * Persist the image management repository.
     *
     * @throws IOException if an I/O error occurs.
     */
    void persist() throws IOException;
}