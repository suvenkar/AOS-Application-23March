package com.advantage.order.store.dev_only;

import java.net.URL;

import javax.xml.namespace.QName;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPBodyElement;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPHeader;
import javax.xml.soap.SOAPMessage;

/**
 * @author Binyamin Regev on 25/12/2015.
 */
public class SOAPRequest {
    public static void main(String[] args) {

        String stringURI = "http://localhost:8080/ShipEx/";

        System.out.println("Starting SOAPRequest...");
        try {
            System.out.println("SOAPConnectionFactory sfc = SOAPConnectionFactory.newInstance();");
            SOAPConnectionFactory sfc = SOAPConnectionFactory.newInstance();
            System.out.println("SOAPConnectionFactory sfc = " + sfc + "\n");

            System.out.println("SOAPConnection connection = sfc.createConnection();");
            SOAPConnection connection = sfc.createConnection();
            System.out.println("SOAPConnection connection = " + connection + "\n");

            System.out.println("MessageFactory mf = MessageFactory.newInstance();");
            MessageFactory mf = MessageFactory.newInstance();

            System.out.println("SOAPMessage sm = mf.createMessage();");
            SOAPMessage sm = mf.createMessage();
            System.out.println("SOAPMessage sm = " + sm + "\n");

            System.out.println("SOAPHeader sh = sm.getSOAPHeader();");
            SOAPHeader sh = sm.getSOAPHeader();
            System.out.println("SOAPHeader sh = " + sh + "\n");

            System.out.println("SOAPBody sb = sm.getSOAPBody();");
            SOAPBody sb = sm.getSOAPBody();
            System.out.println("SOAPBody sb = " + sb + "\n");

            System.out.println("sh.detachNode();");
            sh.detachNode();

            System.out.println("QName bodyName = new QName(" + stringURI + ", \"ShippingCostRequest\", \"d\");");
            QName bodyName = new QName(stringURI, "ShippingCostRequest", "d");
            System.out.println("QName bodyName = " + bodyName + "\n");

            System.out.println("SOAPBodyElement bodyElement = sb.addBodyElement(bodyName);");
            SOAPBodyElement bodyElement = sb.addBodyElement(bodyName);
            System.out.println("SOAPBodyElement bodyElement = " + bodyElement + "\n");

            System.out.println("QName qn = new QName(\"aName\");");
            QName qn = new QName("aName");
            System.out.println("QName qn = " + qn + "\n");

            System.out.println("SOAPElement quotation = bodyElement.addChildElement(qn);");
            SOAPElement quotation = bodyElement.addChildElement(qn);

            System.out.println("quotation.addTextNode(\"TextMode\");");
            quotation.addTextNode("TextMode");

            System.out.println("\n Soap Request:\n");

            sm.writeTo(System.out);

            System.out.println("URL endpoint = new URL(\"http://yourServer.com\");");
            URL endpoint = new URL("http://yourServer.com");

            System.out.println("SOAPMessage response = connection.call(sm, endpoint);");
            SOAPMessage response = connection.call(sm, endpoint);

            System.out.println("System.out.println(response.getContentDescription());");
            System.out.println(response.getContentDescription());

        } catch (Exception ex) {
            System.out.println("ex.printStackTrace();");
            ex.printStackTrace();
        }
    }
}