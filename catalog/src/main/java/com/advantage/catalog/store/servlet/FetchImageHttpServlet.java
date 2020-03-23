package com.advantage.catalog.store.servlet;

import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ImageManagementAccess;
import com.advantage.catalog.store.image.ManagedImage;
import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.util.IOHelper;
import com.advantage.common.cef.CefHttpModel;
import com.advantage.root.util.xml.XmlHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;
import org.w3c.dom.Document;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

@SuppressWarnings("serial")
public class FetchImageHttpServlet extends HttpServlet {

    private static final String INIT_PARAM_REPOSITORY_DIRECTORY_PATH = "repository-directory-path";

    public static final String REQUEST_PARAM_IMAGE_ID = "image_id";

    private ImageManagement imageManagement;
    private static final Logger logger = Logger.getLogger(FetchImageHttpServlet.class);

    @Override
    public void init() throws ServletException {
        final String repositoryDirectoryPath;
        try {
            repositoryDirectoryPath = getPath();
            if (StringUtils.isBlank(repositoryDirectoryPath)) {
                final String errorMessageString =
                        "Init parameter [" + FetchImageHttpServlet.INIT_PARAM_REPOSITORY_DIRECTORY_PATH + "] must be set";
                throw new ServletException(errorMessageString);
            }

            imageManagement = ImageManagementAccess.getImageManagement(repositoryDirectoryPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(final HttpServletRequest req, final HttpServletResponse res)
            throws ServletException, IOException {
        Document doc = XmlHelper.getXmlDocument("DemoAppConfig.xml");
        doc.getElementsByTagName("Show_slow_pages").item(0).getTextContent();
        CefHttpModel cefData = (CefHttpModel) req.getAttribute("cefData");
        if (cefData != null) {
            logger.trace("cefDataId=" + cefData.toString());
            cefData.setEventRequiredParameters(String.valueOf("/catalog/fetchImage".hashCode()),
                    "Get image", 5);
        } else {
            logger.warn("cefData is null");
        }

        ArgumentValidationHelper.validateArgumentIsNotNull(req, "HTTP servlet request");
        ArgumentValidationHelper.validateArgumentIsNotNull(res, "HTTP servlet response");

        boolean isMobile = (req.getParameter("m") != null);
        final String imageId = req.getParameter(FetchImageHttpServlet.REQUEST_PARAM_IMAGE_ID);
        final ManagedImage managedImage = imageManagement.getManagedImage(imageId);
        final StringBuilder contentType = new StringBuilder("image/");
        final String imageType = managedImage.getType();
        contentType.append(imageType);
        final String contentTypeString = contentType.toString();
        res.setContentType(contentTypeString);
        final OutputStream out = res.getOutputStream();
        if( doc.getElementsByTagName("Show_slow_pages").item(0).getTextContent().equalsIgnoreCase("Yes")){
            res.addHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
        } else {
            res.addHeader("Cache-Control", "public");
        }
        final byte[] imageContent = isMobile ? managedImage.getMobileContent() : managedImage.getContent();
        IOHelper.outputInput(imageContent, out);
    }

    private String getPath() throws IOException {
        ClassPathResource filePath = new ClassPathResource("app.properties");
        File file = filePath.getFile();

        return file.getPath().split("WEB-INF")[0] +
                getInitParameter(FetchImageHttpServlet.INIT_PARAM_REPOSITORY_DIRECTORY_PATH);

    }
}