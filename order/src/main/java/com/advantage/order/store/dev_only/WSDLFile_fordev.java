package com.advantage.order.store.dev_only;

import com.predic8.wsdl.*;
import com.predic8.wstool.creator.RequestTemplateCreator;
import com.predic8.wstool.creator.SOARequestCreator;
import groovy.xml.MarkupBuilder;

import javax.xml.namespace.QName;
import java.io.StringWriter;
import java.net.URL;

/**
 * @author Binyamin Regev on 26/12/2015.
 */
public class WSDLFile_fordev {

    public static void main(String args[]) throws Exception {

        URL url = new URL("http://localhost:8080/ShipEx/shipex.wsdl");

        Definitions wsdl = new WSDLParser().parse(url.toString());
        StringWriter writer = new StringWriter();

        String stringWsdlFile = WSDLHelper.getWsdlFile(url);
        System.out.println("WSDL File=\'" + stringWsdlFile + "\'");

        QName serviceName = new QName("https://www.AdvantageOnlineBanking.com/ShipEx/", "ShipExPortService");
        QName portName = new QName("https://www.AdvantageOnlineBanking.com/ShipEx/", "ShipExPortSoap11");

        //Service service = Service.create(url, serviceName);
        //Dispatch<SOAPMessage> dispatch = service.createDispatch(portName, SOAPMessage.class, Service.Mode.MESSAGE);
        //SOAPMessage request = MessageFactory
        //                        .newInstance()
        //                        .createMessage(null, new FileOutputStream("MyShipExMessage.xml"));
        //SOAPMessage response = dispatch.invoke(request);
        //response.writeTo(System.out);

        SOARequestCreator creator = new SOARequestCreator(wsdl, new RequestTemplateCreator(), new MarkupBuilder(writer));

        for (Service service : wsdl.getServices()) {
            System.out.println("*************************************************");
            System.out.println("Service=\'" + service.getName() + "\'");
            System.out.println("*************************************************");
            for (Port port : service.getPorts()) {
                System.out.println("   Port=\'" + port.getName() + "\'");
                System.out.println("   =================================================");
                Binding binding = port.getBinding();
                PortType portType = binding.getPortType();
                for (Operation op : portType.getOperations()) {
                    System.out.println("");
                    System.out.println("      -------------------------------------------------");
                    System.out.println("      Operation=\'" + op.getName() + "\'");
                    System.out.println("      -------------------------------------------------");
                    //creator.createRequest(port.getName(), op.getName(), binding.getName());
                    //System.out.println(writer);

                    writer.getBuffer().setLength(0);
                }
            }
        }

        /** *************************************************
         *  Account Service WSDL file
         *  ************************************************* */
        url = new URL("http://localhost:8080/accountservice/accountservice.wsdl");

        wsdl = new WSDLParser().parse(url.toString());
        writer = new StringWriter();

        stringWsdlFile = WSDLHelper.getWsdlFile(url);
        System.out.println("WSDL File=\'" + stringWsdlFile + "\'");

        creator = new SOARequestCreator(wsdl, new RequestTemplateCreator(), new MarkupBuilder(writer));

        for (Service service : wsdl.getServices()) {
            System.out.println("*************************************************");
            System.out.println("Service=\'" + service.getName() + "\'");
            System.out.println("*************************************************");
            for (Port port : service.getPorts()) {
                System.out.println("   Port=\'" + port.getName() + "\'");
                System.out.println("   =================================================");
                Binding binding = port.getBinding();
                PortType portType = binding.getPortType();
                for (Operation op : portType.getOperations()) {
                    System.out.println("");
                    System.out.println("      -------------------------------------------------");
                    System.out.println("      Operation=\'" + op.getName() + "\'");
                    System.out.println("      -------------------------------------------------");
                    //creator.createRequest(port.getName(), op.getName(), binding.getName());
                    //System.out.println(writer);

                    writer.getBuffer().setLength(0);
                }
            }
        }

    }
}
