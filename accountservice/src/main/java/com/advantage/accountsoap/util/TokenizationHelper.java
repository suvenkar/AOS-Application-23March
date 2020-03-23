package com.advantage.accountsoap.util;

import com.advantage.common.Constants;
import com.advantage.common.Url_resources;
import com.advantage.root.util.JsonHelper;
import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.HostnameVerifier;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * Created by developer on 10/25/2017.
 */
public class TokenizationHelper {

    private static final String CONFIG_SECUREDATA_HOST = "modeloffice.org";
    private static final String CONFIG_PROTECT_URL = "vibesimple/rest/v1/protect";
    private static final String CONFIG_ACCESS_URL = "vibesimple/rest/v1/access";
    private static final String CONFIG_IDENTITY = "DevOpsTokens";
    private static final String CONFIG_AUTH_METHOD = "sharedSecret";
    private static final String CONFIG_AUTH_INFO = "voltage123";
    private static final String CONFIG_VERSION = "200";
    private static final String CONFIG_FORMAT = "CCOBVIOUSTOKEN";


    private static final Logger logger = Logger.getLogger(TokenizationHelper.class);
    public TokenizationHelper() {
    }

    public String tokenizeCC(String plainTextCC) {

        try {

            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, new TrustManager[] { new MyTrustManager() },
                    new SecureRandom());
            HttpsURLConnection
                    .setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection
                    .setDefaultHostnameVerifier(new MyHostnameVerifier());

            URL url = new URL(new URL("https://voltage."+CONFIG_SECUREDATA_HOST), CONFIG_PROTECT_URL);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setDoOutput(true);
            conn.setRequestMethod(HttpMethod.POST.name());
            conn.setRequestProperty(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
            conn.setRequestProperty(HttpHeaders.AUTHORIZATION, "VSAuth vsauth_method=\"sharedSecret\", vsauth_data=\"dm9sdGFnZTEyMw==\", vsauth_identity_ascii=\"DevOpsTokens\", vsauth_version=\"200\"");


            String input = "{" +
                    "\"format\": \"" + CONFIG_FORMAT + "\"," +
                    "\"data\": [\"" + plainTextCC + "\"]" +
                    "}";
            //  endregion

            OutputStream os = conn.getOutputStream();
            os.write(input.getBytes());
            os.flush();

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode() + Constants.SPACE + "SafePay JSON string sent: '" + input + "'");
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            StringBuffer sbLog = new StringBuffer("Output from Server ....").append(System.lineSeparator());
            while ((output = br.readLine()) != null) {
                sb.append(output);
                sbLog.append("\t").append(output).append(System.lineSeparator());
            }
            logger.debug(sbLog.toString());
            conn.disconnect();

            Map<String, Object> jsonMap = JsonHelper.jsonStringToMap(sb.toString());


            return ((List<String>)jsonMap.get("data")).get(0);


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;

    }

    public String detokenizeCC(String tokenizedCC) {

        try {

            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, new TrustManager[] { new MyTrustManager() },
                    new SecureRandom());
            HttpsURLConnection
                    .setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection
                    .setDefaultHostnameVerifier(new MyHostnameVerifier());


            URL url = new URL(new URL("https://voltage-pp-0000."+CONFIG_SECUREDATA_HOST), CONFIG_ACCESS_URL);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setDoOutput(true);
            conn.setRequestMethod(HttpMethod.POST.name());
            conn.setRequestProperty(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
            conn.setRequestProperty(HttpHeaders.AUTHORIZATION, "VSAuth vsauth_method=\"sharedSecret\", vsauth_data=\"dm9sdGFnZTEyMw==\", vsauth_identity_ascii=\"DevOpsTokens\", vsauth_version=\"200\"");


            String input = "{" +
                    "\"format\": \"" + CONFIG_FORMAT + "\"," +
                    "\"data\": [\"" + tokenizedCC + "\"]" +
                    "}";
            //  endregion

            OutputStream os = conn.getOutputStream();
            os.write(input.getBytes());
            os.flush();

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode() + Constants.SPACE + "SafePay JSON string sent: '" + input + "'");
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            StringBuffer sbLog = new StringBuffer("Output from Server ....").append(System.lineSeparator());
            while ((output = br.readLine()) != null) {
                sb.append(output);
                sbLog.append("\t").append(output).append(System.lineSeparator());
            }
            logger.debug(sbLog.toString());
            conn.disconnect();

            Map<String, Object> jsonMap = JsonHelper.jsonStringToMap(sb.toString());


            return ((List<String>)jsonMap.get("data")).get(0);


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;

    }

    private class MyHostnameVerifier implements HostnameVerifier {
        @Override
        public boolean verify(String hostname, SSLSession session) {
            // TODO Auto-generated method stub
            return true;
        }
    }
    private class MyTrustManager implements X509TrustManager {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            // TODO Auto-generated method stub
        }
        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            // TODO Auto-generated method stub
        }
        @Override
        public X509Certificate[] getAcceptedIssuers() {
            // TODO Auto-generated method stub
            return null;
        }
    }
}
