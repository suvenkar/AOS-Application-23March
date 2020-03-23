package com.advantage.common.cef;

import com.advantage.common.exceptions.token.ContentTokenException;
import com.advantage.common.exceptions.token.TokenException;
import com.advantage.common.exceptions.token.VerificationTokenException;
import com.advantage.common.exceptions.token.WrongTokenTypeException;
import com.advantage.common.security.SecurityTools;
import com.advantage.common.security.Token;
import com.advantage.common.security.TokenJWT;
import com.advantage.common.utils.SoapApiHelper;
import eu.bitwalker.useragentutils.UserAgent;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.xml.soap.SOAPException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;

/**
 * Created by fiskine on 12/07/2016.
 * According to HPE Security ArcSight Common Event Format, v.23
 * https://www.protect724.hpe.com/docs/DOC-1072
 */
public class CefHttpModel {
    private static SimpleDateFormat dateFormatForStartAndEnd = new SimpleDateFormat("MMM dd yyyy HH:mm:ss");
    private boolean needTimeFormat;

    private static int version = 0;
    private static String deviceVendor = "Advantage";
    private String deviceProduct;//Current service (account, order, SafePay etc)
    private String deviceVersion;
    private String deviceEventClassId;
    private String name;

    private int severity;
    private String app = "HTTP";
    private String destinationServiceName; //Service than requested by current service (accountservice, catalog,order,ShipEx,SafePay etc)
    private Date end;
    private HttpStatus reason;
    private String request;
    private String requestContext;
    private String requestCookies;
    private String requestClientApplication;
    private String requestMethod;
    private Integer spt;
    private String src;
    private Date start;
    private Long suid;

    public CefHttpModel(String destinationServiceName, String deviceVersion) {
        start = new Date();
        this.destinationServiceName = destinationServiceName;
        this.deviceVersion = deviceVersion;
    }

    public void setEventRequiredParameters(String deviceEventClassId, String name, int severity) {
        this.deviceEventClassId = deviceEventClassId;
        this.name = name;
        this.severity = severity;
    }

    private static String parseUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return userAgent;
        } else if (userAgent.contains("Advantage")) {
            String[] splitedUserAgent = userAgent.split("/");
            return splitedUserAgent[splitedUserAgent.length - 1] + " service";
        } else {
            UserAgent _userAgent = UserAgent.parseUserAgentString(userAgent);
            return _userAgent.getOperatingSystem().getName() + "-" + _userAgent.getBrowser().getName() + " client";
        }
    }

    public void setRequestData(HttpServletRequest httpServletRequest) {
        request = httpServletRequest.getRequestURI();
//        requestContext = convertEnumerationToString(httpServletRequest.getHeaders(HttpHeaders.REFERER));
        requestContext = httpServletRequest.getHeader(HttpHeaders.REFERER);
        requestCookies = convertCookiesToString(httpServletRequest.getCookies());
        requestClientApplication = httpServletRequest.getHeader(HttpHeaders.USER_AGENT);

        deviceProduct = parseUserAgent(requestClientApplication);

        requestMethod = httpServletRequest.getMethod();
        spt = httpServletRequest.getRemotePort();
        src = httpServletRequest.getRemoteAddr();
        try {
            String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
            if (SecurityTools.isBasic(authorizationHeader)) {
                suid = SoapApiHelper.getUserByLogin(
                        SecurityTools
                                .getBasicTokenFromAuthorizationHeader(authorizationHeader)
                                .split(":")[0], authorizationHeader)
                        .getUserId();
        } else {
                Token token = SecurityTools.getTokenFromAuthorizationHeader(httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION));
                suid = (token != null) ? token.getUserId() : null;
        }
        } catch (TokenException | NullPointerException | SOAPException e) {
            suid = null;
        }
    }

    public void setUserId(String base64Token) throws VerificationTokenException, WrongTokenTypeException, ContentTokenException {
        Token token = TokenJWT.parseToken(base64Token);
        setUserId(token);
    }

    public void setUserId(Token token) {
        suid = token.getUserId();
    }

    public void setStatusCode(HttpStatus statusCode) {
        reason = statusCode;
    }

    private String convertCookiesToString(Cookie[] cookies) {
        String result = null;
        if (cookies != null && cookies.length > 0) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < cookies.length; i++) {
                sb.append(cookies[i].getName()).append('=').append(cookies[i].getValue());
                if (i < cookies.length - 1) {
                    sb.append(";");
                }
            }
            result = sb.toString();
        }
        return result;
    }

    private String convertEnumerationToString(Enumeration<String> strings) {
        String result = null;
        if (strings != null && strings.hasMoreElements()) {
            StringBuilder sb = new StringBuilder();
            while (strings.hasMoreElements()) {
                sb.append(strings.nextElement());
                if (strings.hasMoreElements()) {
                    sb.append(";");
                }
            }
            result = sb.toString();
        }
        return result;
    }

    public void setStopEventTime() {
        this.end = new Date();
    }

    public String cefFomatMessage() {
        if (end == null) {
            setStopEventTime();
        }
        String cefHeader = String.format("CEF:%d|%s|%s|%s|%s|%s|%d|",
                version,
                escapeHeaderValueSigns(deviceVendor),
                escapeHeaderValueSigns(deviceProduct),
                escapeHeaderValueSigns(deviceVersion),
                escapeHeaderValueSigns(deviceEventClassId),
                escapeHeaderValueSigns(name),
                severity);

        StringBuilder sb = new StringBuilder(cefHeader);
        sb.append("start").append('=').append(needTimeFormat ? dateFormatForStartAndEnd.format(start) : start.getTime()).append(' ');
        sb.append("end").append('=').append(needTimeFormat ? dateFormatForStartAndEnd.format(end) : end.getTime()).append(' ');
        sb.append(convertToExtensionPair("app", app));
        sb.append(convertToExtensionPair("destinationServiceName", destinationServiceName));
        sb.append("outcome").append('=').append(reason.is2xxSuccessful() ? "success" : "failure").append(' ');
        sb.append("reason").append('=').append(reason.value()).append(' ');
        sb.append(convertToExtensionPair("request", request));
        sb.append(convertToExtensionPair("requestContext", requestContext));
        sb.append(convertToExtensionPair("requestCookies", requestCookies));
        sb.append(convertToExtensionPair("requestClientApplication", requestClientApplication));
        sb.append(convertToExtensionPair("requestMethod", requestMethod));
        sb.append(convertToExtensionPair("spt", spt));
        sb.append(convertToExtensionPair("src", src));
        sb.append(convertToExtensionPair("suid", suid));
        return sb.toString();
    }

    private StringBuilder convertToExtensionPair(String cefExtensionKey, Number cefExtensionValue) {
        if (cefExtensionValue != null) {
            StringBuilder sb = new StringBuilder(cefExtensionKey).append('=');
            sb.append(cefExtensionValue).append(' ');
            return sb;
        } else {
            return new StringBuilder();
        }
    }

    private StringBuilder convertToExtensionPair(String cefExtensionKey, String cefExtensionValue) {
        if (cefExtensionValue != null && !cefExtensionValue.isEmpty()) {
            StringBuilder sb = new StringBuilder(cefExtensionKey).append('=');
            sb.append(escapeExtensionValueSigns(cefExtensionValue)).append(' ');
            return sb;
        } else {
            return new StringBuilder();
        }
    }

    private String escapeHeaderValueSigns(String value) {
        return value.replace("\\", "\\\\").replace("|", "\\|");
    }

    private String escapeExtensionValueSigns(String value) {
        return value.replace("\\", "\\\\").replace("=", "\\=");
    }

    @Override
    public String toString() {
        return "CefHttpModel{" +
                "start=" + start +
                ", end=" + end +
                ", needTimeFormat=" + needTimeFormat +
                ", deviceProduct='" + deviceProduct + '\'' +
                ", deviceVersion='" + deviceVersion + '\'' +
                ", deviceEventClassId='" + deviceEventClassId + '\'' +
                ", name='" + name + '\'' +
                ", severity=" + severity +
                ", app='" + app + '\'' +
                ", destinationServiceName='" + destinationServiceName + '\'' +
                ", reason=" + reason +
                ", request='" + request + '\'' +
                ", requestContext='" + requestContext + '\'' +
                ", requestCookies='" + requestCookies + '\'' +
                ", requestClientApplication='" + requestClientApplication + '\'' +
                ", requestMethod='" + requestMethod + '\'' +
                ", spt=" + spt +
                ", src='" + src + '\'' +
                ", suid=" + suid +
                '}';
    }

    public void setNeedTimeFormat(boolean needTimeFormat) {
        this.needTimeFormat = needTimeFormat;
    }
}
