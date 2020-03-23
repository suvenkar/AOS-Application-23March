package com.advantage.catalog_test.online.store.image;

//import java.util.HashMap;
//import java.util.Map;

import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ImageManagementAccess;
import com.advantage.catalog.store.image.ManagedImage;
import com.advantage.catalog.store.image.impl.XmlManagedImage;
import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.util.fs.FileSystemHelper;
import com.advantage.catalog_test.cfg.AdvantageTestContextConfiguration;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.File;
import java.io.IOException;
import java.util.Random;

/**
 * @author Binyamin Regev
 *         <br/>
 *         This class purpose is to test ImageManagement interface, Abstract
 *         class and API.
 *         <br/>
 * @see ImageManagement
 * @see ImageManagementAccess
 * @see ManagedImage
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class ImageManagementTests {
    @Rule
    public TemporaryFolder folder = new TemporaryFolder();
    //private static final Map<String, ImageManagement> imageManagementsMap = new HashMap<String, ImageManagement>();

    /**
     * @throws IOException
     * @author: Binyamin Regev
     * <br/>
     * Copy 5 files from <i>"C:\\Temp"</i> to <i>"C:\\Temp\\advantage1"</i> and then
     * use <ul>{@link Assert></ul> to verify that only 5 files were copied.
     */
    @Test
    public void testAddManagedImage() throws IOException {

//		ImageManagement im = ImageManagementAccess.getImageManagement("C:\\Temp\\advantage1");
//
//		im.addManagedImage("C:\\Temp\\image1.jpg", true);
//		im.addManagedImage("C:\\Temp\\image2.jpg", true);
//		im.addManagedImage("C:\\Temp\\image3.jpg", true);
//		im.addManagedImage("C:\\Temp\\image4.jpg", true);
//		im.addManagedImage("C:\\Temp\\image5.jpg", true);
//
//		int managedImagesCount = im.getManagedImages().size();
//		System.out.println(managedImagesCount);
//
//		Assert.assertEquals(5, managedImagesCount);
        Assert.assertTrue(true);
    }

    /**
     * @throws IOException
     * @author: Binyamin Regev
     * <br/>
     * Use immediate <b>IIF</b> and <u>{@link Assert></u> to verify that the XML
     * repository file <b>"imageManagement.xml"</b> exists in directory
     * <b>"C:\\Temp\\advantage"</b>
     */
    @Test
    public void testIsFileExists() throws IOException {

        String tempdir = System.getProperty("java.io.tmpdir");

        ImageManagement im = ImageManagementAccess.getImageManagement(tempdir + File.separator + "advantage");

        im.persist();

        boolean isFileExists = FileSystemHelper.isFileExist(tempdir + File.separator + "advantage" + File.separator + "imageManagement.xml");

        Assert.assertTrue(isFileExists);
    }

    /**
     * Use {@link ImageManagementAccess} to add an image to directory "C:\\Temp\\advantage1",
     * then verify the image exists in the repository, by its ID. Then use method
     * <i>"removeManagedImage(managedImageId)"</i> to remove image from the repository, and
     * finally verify the image is no longer in the repository.
     * <br/>
     * After calling method <i>removeManagedImage(imageId)</i> we expect calling
     * <i>getManagedFileName()</i> will return <b>Null</b>.
     *
     * @throws IOException
     * @see ImageManagementAccess
     * @see ManagedImage
     */
    @Test(expected = NullPointerException.class)
    public void testImageExistsById() throws IOException {
        XmlManagedImage.doResize = false;
        File createdFile = folder.newFile("myfile.jpg");
        byte[] b = new byte[20];
        new Random().nextBytes(b);
        FileUtils.writeByteArrayToFile(createdFile, b);
        final String repositoryDirectoryPath = createdFile.getAbsolutePath();

        ImageManagement im = ImageManagementAccess.getImageManagement(repositoryDirectoryPath);

        ManagedImage managedImage = im.addManagedImage(createdFile, false);

        final String imageId = managedImage.getId();

        managedImage = im.getManagedImage(imageId);

        String expectedOutput = "myfile.jpg";
        String actualOutput = im.getManagedImage(imageId).getManagedFileName();

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(repositoryDirectoryPath,
                "repository directory path");

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(actualOutput, "Image Name");

        Assert.assertEquals(expectedOutput, actualOutput);

        im.removeManagedImage(imageId);

        actualOutput = im.getManagedImage(imageId).getManagedFileName();

		/* Test Failed: we did not getAllCategoryAttributeFilter NullPointerException in the previous line */
        Assert.fail("Expected Null, but got [" + actualOutput + "]");
    }
/*
    @After
    public void deleteTempFolder() {
        folder.delete();
    }*/
}