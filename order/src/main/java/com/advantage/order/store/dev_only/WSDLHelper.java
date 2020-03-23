package com.advantage.order.store.dev_only;

import com.advantage.order.store.dto.ShipExResponse;
import com.advantage.root.util.StringHelper;
import com.predic8.schema.Attribute;
import com.predic8.schema.ComplexType;
import com.predic8.schema.Element;
import com.predic8.schema.Schema;
import com.predic8.wsdl.*;
import com.predic8.wstool.creator.RequestTemplateCreator;
import com.predic8.wstool.creator.SOARequestCreator;
import groovy.xml.MarkupBuilder;

import java.io.IOException;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Binyamin Regeb on 30/12/2015.
 */
public class WSDLHelper {

    public static String getWsdlFile(URL url) {

        String content = null;

        URLConnection urlConnection = null;

        try {
            urlConnection = url.openConnection();
            if(urlConnection.getContent() != null) {
                //System.out.println("\'" + urlWsdlFile + "\' is GOOD URL");

                String contentType = urlConnection.getContentType();

                content = StringHelper.getStringFromInputStream(urlConnection.getInputStream());

                //System.out.println("Content: \n" + content.toString());

            } else {
                System.out.println("BAD URL");
            }
        } catch (MalformedURLException ex) {
            System.out.println("bad URL");
        } catch (IOException ex) {
            System.out.println("Failed opening connection. Perhaps WS is not up?");
        }

        return content;

    }

    /**
     * Get content of WSDL file as a {@link String}.
     * @param urlWsdlFile
     * @return
     */
    public static String getWsdlFile(String urlWsdlFile) {

        String content = null;

        URL url = null;
        URLConnection urlConnection = null;

        try {
            url = new URL(urlWsdlFile);
            urlConnection = url.openConnection();
            if(urlConnection.getContent() != null) {
                //System.out.println("\'" + urlWsdlFile + "\' is GOOD URL");

                String contentType = urlConnection.getContentType();

                content = StringHelper.getStringFromInputStream(urlConnection.getInputStream());

                //System.out.println("Content: \n" + content.toString());

            } else {
                System.out.println("BAD URL");
            }
        } catch (MalformedURLException ex) {
            System.out.println("bad URL");
        } catch (IOException ex) {
            System.out.println("Failed opening connection. Perhaps WS is not up?");
        }

        return content;

    }

    /**
     * Get {@link List} of {@link Operation}s in WSDL file.
     * @param urlParam
     * @param wsdlFileName
     * @return
     */
    public static List<Operation> getListWSDLOperations(URL urlParam, String wsdlFileName) {
        List<Operation> operations = new ArrayList<>();

        WSDLParser parser = new WSDLParser();

        Definitions wsdl = parser.parse(urlParam.toString() + wsdlFileName);

        Schema schema = wsdl.getSchema(urlParam.toString());
        if (schema != null) {
            List<Element> elements = schema.getAllElements();
            for (Element element: elements) {

            }
        }
        for (PortType pt : wsdl.getPortTypes()) {
            System.out.println(pt.getName());
            for (Operation operation : pt.getOperations()) {
                operations.add(operation);
            }
        }

        List<String> listOperations = new ArrayList<>();

        System.out.println("-=# Operations List - Begin #=-");
        for (Operation op : operations) {
            listOperations.add(op.getName());
            System.out.println("* " + op.getName());
        }
        System.out.println("-=# Operations List - End   #=-");

        return operations;
    }

    /**
     * Get list of operations names in WSDL file.
     * @param urlParam
     * @param wsdlFileName
     * @return
     */
    public static List<String> getListWSDLOperationsNames(URL urlParam, String wsdlFileName) {
        List<Operation> operations = WSDLHelper.getListWSDLOperations(urlParam, wsdlFileName);

        List<String> listOperations = new ArrayList<>();

        for (Operation op : operations) {
            listOperations.add(op.getName());
        }

        return listOperations;
    }

    /**
     * Test accessing {@code ShipEx} application using SOAP
     * @return {@link String}
     */
    public String getShipExWsdlFile(URL urlParam) {

        String content = null;
        URL url;
        URLConnection urlConnection = null;

        try {
            url = new URL(urlParam, "/shipex.wsdl");
            urlConnection = url.openConnection();
            if (urlConnection.getContent() != null) {
                System.out.println("\'" + url.toString() + "\' is GOOD URL");

                String contentType = urlConnection.getContentType();

                content = StringHelper.getStringFromInputStream(urlConnection.getInputStream());

                System.out.println("Content: \n" + content);

                listWSDLOperations(url);
            } else {
                System.out.println("BAD URL");
            }
        } catch (MalformedURLException ex) {
            System.out.println("bad URL");
        } catch (IOException ex) {
            System.out.println("Failed opening connection. Perhaps WS is not up?");
        }

        return content;
    }

    public void listWSDLOperations(URL urlParam) throws MalformedURLException {

        URL url = new URL(urlParam, "/shipex.wsdl");

        List<Operation> operations = getListWSDLOperations(urlParam, "/shipex.wsdl");

        WSDLParser parser = new WSDLParser();

        Definitions wsdl = parser.parse(url.toString());

        List<Schema> schemas = wsdl.getSchemas();
        if ((schemas != null) && (schemas.size() > 0)) {
            for (Schema schema : schemas) {
                String schemaName = schema.getName();
                List<Attribute> attributes = schema.getAttributes();
                String requestTemplate = schema.getRequestTemplate();
                List<Element> elements = schema.getAllElements();
                if ((elements != null) && (elements.size() > 0)) {
                    Element e = elements.get(0);
                    String name = e.getName();
                    String asString = e.getAsString();
                    String prefix = e.getPrefix();
                    int i = 0;
                }
                List<ComplexType> types = schema.getComplexTypes();

                boolean isTrue = true;
            }
        }

        //String portTypeName = null;
        //for (PortType pt : wsdl.getPortTypes()) {
        //    System.out.println(pt.getName());
        //    portTypeName = pt.getName();
        //    for (Operation operation : pt.getOperations()) {
        //        operations.add(operation);
        //    }
        //}

        //System.out.println("-=# Operations List - Begin #=-");
        //for (Operation op : operations) {
        //    System.out.println("* " + op.getName());
        //}
        //System.out.println("-=# Operations List - End   #=-");

        StringWriter writer = new StringWriter();
        SOARequestCreator creator = new SOARequestCreator(wsdl, new RequestTemplateCreator(), new MarkupBuilder(writer));

        ////creator.createRequest(PortType name, Operation name, Binding name);
        //creator.createRequest(portTypeName, "ShippingCost", "ArticleServicePTBinding");
        //System.out.println(writer);

        for (Service service : wsdl.getServices()) {
            for (Port port : service.getPorts()) {
                Binding binding = port.getBinding();
                PortType portType = binding.getPortType();
                for (Operation op : portType.getOperations()) {
                    creator.createRequest(port.getName(), op.getName(), binding.getName());
                    System.out.println(writer);
                    writer.getBuffer().setLength(0);
                }
            }
        }

    }

    public void createTemplates(String url) {

        WSDLParser parser = new WSDLParser();
        Definitions wsdl = parser.parse(url);

        StringWriter writer = new StringWriter();
        SOARequestCreator creator = new SOARequestCreator(wsdl, new RequestTemplateCreator(), new MarkupBuilder(writer));

        //creator.createRequest(PortType name, Operation name, Binding name);
        creator.createRequest("ArticleServicePT", "create", "ArticleServicePTBinding");
        System.out.println(writer);

        for (Service service : wsdl.getServices()) {
            for (Port port : service.getPorts()) {
                Binding binding = port.getBinding();
                PortType portType = binding.getPortType();
                for (Operation op : portType.getOperations()) {
                    creator.createRequest(port.getName(), op.getName(), binding.getName());
                    System.out.println(writer);
                    writer.getBuffer().setLength(0);
                }
            }
        }
    }

    public ShipExResponse getShippingCostFromShipEx() {

            /*  ******* Init    ******* */
        //costRequest = new ShippingCostRequest();
        //orderRequest = new PlaceShippingOrderRequest();
        //address = new SEAddress();
        //endpoint = new ShipExEndpoint(service);
        //
        //address.setAddressLine1("address");
        //address.setCity("city");
        //address.setCountry("ua");
        //address.setPostalCode("123123");
        //address.setState("state");
        //
        //costRequest.setSETransactionType(ShipExEndpoint.TRANSACTION_TYPE_SHIPPING_COST);
        //costRequest.setSEAddress(address);
        //costRequest.setSENumberOfProducts(5);
        //costRequest.setSECustomerPhone("+1231234567");
        //costRequest.setSECustomerName("name");
        //
        //orderRequest.setSEAddress(address);
        //orderRequest.setSETransactionType(ShipExEndpoint.TRANSACTION_TYPE_PLACE_SHIPPING_ORDER);
        //orderRequest.setOrderNumber("1234567890");
        //orderRequest.setSECustomerPhone("+1231234567");
        //orderRequest.setSECustomerName("name");
        //
        //ShippingCostResponse response = endpoint.getShippingCost(costRequest);

        boolean isValid = false;

            /* Check response received values   */
        //boolean isValid = response.getCode().equalsIgnoreCase(Constants.SHIP_EX_RESPONSE_STATUS_OK);
        //
        //if (isValid) {
        //    isValid = (! response.getAmount().isEmpty());
        //}
        //
        //if (isValid) {
        //    isValid = ((response.getAmount() < 0) || (10000000000.00 < response.getAmount()));
        //}
        //
        //if (isValid) {
        //    isValid = (!response.getCurrency().isEmpty());
        //}
        //
        //if (isValid) {
        //    isValid = ValidationHelper.isValidCurrency(response.getCurrency());
        //}
        //
        //if (isValid) {
        //    isValid = (!response.getSETransactionType().isEmpty());
        //}
        //
        //if (isValid) {
        //    isValid = response.getSETransactionType().equalsIgnoreCase(costRequest.getSETransactionType());
        //}
        //
        String result = null;

        if (isValid) {
            result = "response is successful";
        }

        //return result;
        return new ShipExResponse();
    }
}
