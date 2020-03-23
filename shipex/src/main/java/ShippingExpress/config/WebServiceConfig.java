package ShippingExpress.config;

import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@EnableWs
@Configuration
@PropertySources(value = {
        @PropertySource("classpath:/shipex-mock-for-db.properties")})
public class WebServiceConfig extends WsConfigurerAdapter {
    public static final String NAMESPACE_URI = "https://www.AdvantageOnlineBanking.com/ShipEx/";

    @Bean
    public ServletRegistrationBean messageDispatcherServlet(ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean(servlet, "/*");
    }

    @Bean(name = "shipex")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema serviceSchema) {
        DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
        wsdl11Definition.setPortTypeName("ShipExPort");
        wsdl11Definition.setLocationUri("/");
        wsdl11Definition.setTargetNamespace(NAMESPACE_URI);
        wsdl11Definition.setSchema(serviceSchema);
        return wsdl11Definition;
    }

    @Bean
    public XsdSchema serviceSchema() {
        return new SimpleXsdSchema(new ClassPathResource("shipex.xsd"));
    }
}
