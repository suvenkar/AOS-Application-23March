package com.advantage.common.filter;

import com.advantage.common.cef.CefHttpModel;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

/**
 * Created by fiskine on 7/14/2016.
 */
public class CefFilter implements Filter {

    private static final Logger cefLogger = Logger.getLogger("CEF");
    private static final Logger logger = Logger.getLogger(CefFilter.class);

    protected String serviceName;
    private boolean formatStartEnd = false;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.trace("Start " + filterConfig.getFilterName() + "(Object id = " + this.toString() + ") Init");
        if (logger.isDebugEnabled()) {
            StringBuffer sb = new StringBuffer("\tFilter ").append(filterConfig.getFilterName()).append(" config init parameters:").append(System.lineSeparator());
            Enumeration<String> initParameterNames = filterConfig.getInitParameterNames();
            while (initParameterNames.hasMoreElements()) {
                String initParameterName = initParameterNames.nextElement();
                sb.append("\t\t").append(initParameterName).append(" = ").append(filterConfig.getInitParameter(initParameterName)).append(System.lineSeparator());
            }
            logger.debug(sb.toString());
        }
        serviceName = filterConfig.getInitParameter("cef.service.name");
        if (serviceName == null) {
            logger.fatal("serviceName (web.xml initParam 'cef.service.name') is null");
        }
        logger.debug("serviceName (web.xml initParam 'cef.service.name') = " + serviceName);

        String initParamStartendformat = filterConfig.getInitParameter("cef.filter.format_start_end_fields");
        logger.debug("initParamStartendformat (web.xml initParam 'cef.filter.format_start_end_fields') = " + initParamStartendformat);
        if (initParamStartendformat != null && initParamStartendformat.trim().toLowerCase().equals("true")) {
            formatStartEnd = true;
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (servletRequest == null) {
            logger.fatal(serviceName + ": ServletRequest is null");
        }
        if (servletResponse == null) {
            logger.fatal(serviceName + ": ServletResponse is null");
        }
        if (filterChain == null) {
            logger.fatal(serviceName + ": FilterChain is null");
        }

        if (cefLogger.isInfoEnabled()) {
            logger.trace("Start CEF filter for: " + serviceName);
            boolean isRequestIsHttpRequest = servletRequest instanceof HttpServletRequest;
            if (isRequestIsHttpRequest) {
                CefHttpModel cefData = new CefHttpModel(serviceName, getArtifactVersion());
                cefData.setNeedTimeFormat(formatStartEnd);
                HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
                cefData.setRequestData(httpServletRequest);
                servletRequest.setAttribute("cefData", cefData);
                switch (serviceName) {
                    case "root":
                        cefData.setEventRequiredParameters("123", "Read Web application file", 5);
                        break;
                }
                logger.trace("Before chain doFilter(" + serviceName + "): " + cefData.toString());
                filterChain.doFilter(httpServletRequest, servletResponse);
                logger.trace("After chain doFilter(" + serviceName + "): " + cefData.toString());

                HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
                cefData.setStatusCode(HttpStatus.valueOf(httpServletResponse.getStatus()));

                try {
                    cefLogger.info(cefData.cefFomatMessage());
                } catch (Exception e) {
                    logger.error(serviceName + " Incorrect cefData " + cefData.toString());
                }
            } else {
                logger.fatal("CEF filter for " + serviceName + " Its not a HTTPRequest");
                filterChain.doFilter(servletRequest, servletResponse);
            }
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    private String getArtifactVersion() {
        //TODO Change to get artifact version from current artifact
        return "1.0";
    }

    @Override
    public void destroy() {
        logger.trace("CefFilter " + serviceName + " destroy (Object id = " + this.toString() + ")");
    }
}
