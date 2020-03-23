package com.advantage.catalog.util;

import com.advantage.catalog.util.fs.FileSystemHelper;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Iterator;

/**
 * A helper class for input / output operations.
 */
public abstract class IOHelper {

    private IOHelper() {
        throw new UnsupportedOperationException();
    }

    /**
     * Get the content of the file in the given file path, as a byte array.
     *
     * @param filePath the path of the file to getAllCategoryAttributeFilter it's content as a byte array.
     * @return the content of the file in the given file path, as a byte array.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if the given file path argument references
     *                                  <b>null</b>, or if it <b>is</b> a blank string.
     */
    public static byte[] fileContentToByteArray(final String filePath) throws IOException {
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(filePath,
                "file path");
        final InputStream in = new FileInputStream(filePath);
        final ByteArrayOutputStream out = new ByteArrayOutputStream();
        IOHelper.outputInput(in, out);
        return out.toByteArray();
    }

    /**
     * Get the content of the given file, as a byte array.
     *
     * @param file the file to getAllCategoryAttributeFilter it's content as a byte array.
     * @return the content of the given file, as a byte array.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if the given file argument references ,<b>null</b>.
     */
    public static byte[] fileContentToByteArray(final File file) throws IOException {
        ArgumentValidationHelper.validateArgumentIsNotNull(file, "file");
        final String filePath = file.getAbsolutePath();
        return IOHelper.fileContentToByteArray(filePath);
    }

    /**
     * Read from the given input and write the content that was read to the given output
     * stream.
     *
     * @param in         the input stream to read from.
     * @param out        the output stream to write to.
     * @param bufferSize the size of the buffer to be used in each read operation.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if any one of the <b>object</b> arguments references
     *                                  <b>null</b>, or if the given buffer size argument is not positive.
     */
    public static void outputInput(final InputStream in, final OutputStream out,
                                   final int bufferSize) throws IOException {
        ArgumentValidationHelper.validateArgumentIsNotNull(in, "input stream");
        ArgumentValidationHelper.validateArgumentIsNotNull(out, "output stream");
        ArgumentValidationHelper.validateNumberArgumentIsPositive(bufferSize, "buffer size");
        final byte[] buffer = new byte[bufferSize];
        int numberOfBytesRead;

        while ((numberOfBytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, numberOfBytesRead);
        }
    }

    /**
     * Read from the given input and write the content that was read to the given output
     * stream.
     *
     * @param in  the input stream to read from.
     * @param out the output stream to write to.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if any one of the <b>object</b> arguments references
     *                                  <b>null</b>.
     */
    public static void outputInput(final InputStream in, final OutputStream out)
            throws IOException {
        ArgumentValidationHelper.validateArgumentIsNotNull(in, "input stream");
        ArgumentValidationHelper.validateArgumentIsNotNull(out, "output stream");
        IOHelper.outputInput(in, out, 512);
    }

    /**
     * Write the content of the given byte array, to the given output stream.
     *
     * @param content the content to write to the given output stream.
     * @param out     the output stream to write to.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if any one of the given arguments references
     *                                  <b>null</b>.
     */
    public static void outputInput(final byte[] content, final OutputStream out)
            throws IOException {
        ArgumentValidationHelper.validateArgumentIsNotNull(content, "content");
        ArgumentValidationHelper.validateArgumentIsNotNull(out, "output stream");
        final ByteArrayInputStream in = new ByteArrayInputStream(content);
        IOHelper.outputInput(in, out);
    }

    /**
     * Write the content of the given byte array, to the file in the given file path.
     *
     * @param content  the content to write to the file in the given path.
     * @param filePath the file of the file to write the given content, to.
     * @throws IOException              if an I/O error occurs.
     * @throws IllegalArgumentException if any one of the given arguments references
     *                                  <b>null</b>, or if the given file path argument <b>is</b> a blank string.
     */
    public static void outputInput(final byte[] content, final String filePath)
            throws IOException {
        ArgumentValidationHelper.validateArgumentIsNotNull(content, "content");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(filePath, "file path");
        OutputStream out = null;

        try {
            out = new FileOutputStream(filePath);
            IOHelper.outputInput(content, out);
        } finally {
            IOHelper.closeOutputStreamIfNotNull(out);
        }
    }

    public static void resizeImage(String filePath, String compressedFilePath) throws IOException{
        File imageFile = new File(filePath);
        BufferedImage originalImage = ImageIO.read(imageFile);
        int type = originalImage.getType() == 0? BufferedImage.TYPE_INT_ARGB : originalImage.getType();

        BufferedImage resizeImageJpg = resizeImage(originalImage, type);
        ImageIO.write(resizeImageJpg, FileSystemHelper.extractFileExtension(filePath),
                new File(compressedFilePath));
    }

    private static BufferedImage resizeImage(BufferedImage originalImage, int type){
        int IMG_WIDTH = originalImage.getWidth()/2;
        int IMG_HEIGHT = originalImage.getHeight()/2;
        BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, type);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
        g.dispose();

        return resizedImage;
    }

    public static void compressImageFile(String filePath, String compressedFilePath) throws IOException  {
        File imageFile = new File(filePath);
        File compressedImageFile = new File(compressedFilePath);

        InputStream is = new FileInputStream(imageFile);
        OutputStream os = new FileOutputStream(compressedImageFile);

        float quality = 0.2f;

        // create a BufferedImage as the result of decoding the supplied InputStream
        BufferedImage image = ImageIO.read(is);

        // getAllCategoryAttributeFilter all image writers for JPG format
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName(FileSystemHelper.extractFileExtension(filePath));

        if (!writers.hasNext())
            throw new IllegalStateException("No writers found");

        ImageWriter writer = writers.next();
        ImageOutputStream ios = ImageIO.createImageOutputStream(os);
        writer.setOutput(ios);

        ImageWriteParam param = writer.getDefaultWriteParam();

        if (param.canWriteCompressed()) {
            // NOTE: Any method named [set|getAllCategoryAttributeFilter]Compression.* throws UnsupportedOperationException if false
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(quality);
        }

        // compress to a given quality
        while (writers.hasNext()) {
            ImageWriter candidate = writers.next();

            if (candidate.getClass().getSimpleName().equals("CLibPNGImageWriter")) {
                writer = candidate;
                break;
            }
            else if (writer == null) {
                writer = candidate;
            }
        }

        // appends a complete image stream containing a single image and
        //associated stream and image metadata and thumbnails to the output
        writer.write(null, new IIOImage(image, null, null), param);

        // close all streams
        is.close();
        os.close();
        ios.close();
        writer.dispose();
    }

    /**
     * Close the given input stream, if it does not reference <b>null</b>.
     *
     * @param in the input stream to close, if it does not reference <b>null</b>.
     * @throws IOException if an I/O error occurs.
     */
    public static void closeInputStreamIfNotNull(final InputStream in) throws IOException {

        if (in != null) {
            in.close();
        }
    }

    /**
     * Close the given output stream, if it does not reference <b>null</b>.
     *
     * @param out the output stream to close, if it does not reference <b>null</b>.
     * @throws IOException if an I/O error occurs.
     */
    public static void closeOutputStreamIfNotNull(final OutputStream out)
            throws IOException {

        if (out != null) {
            out.close();
        }
    }
}