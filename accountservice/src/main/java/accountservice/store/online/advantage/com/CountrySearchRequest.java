//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.7 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2017.12.12 at 12:44:42 AM EST 
//


package accountservice.store.online.advantage.com;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="internationalPhonePrefix" type="{http://www.w3.org/2001/XMLSchema}int" form="qualified"/>
 *         &lt;element name="startOfName" type="{http://www.w3.org/2001/XMLSchema}string" form="qualified"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "internationalPhonePrefix",
    "startOfName"
})
@XmlRootElement(name = "CountrySearchRequest")
public class CountrySearchRequest {

    protected int internationalPhonePrefix;
    @XmlElement(required = true)
    protected String startOfName;

    /**
     * Gets the value of the internationalPhonePrefix property.
     * 
     */
    public int getInternationalPhonePrefix() {
        return internationalPhonePrefix;
    }

    /**
     * Sets the value of the internationalPhonePrefix property.
     * 
     */
    public void setInternationalPhonePrefix(int value) {
        this.internationalPhonePrefix = value;
    }

    /**
     * Gets the value of the startOfName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStartOfName() {
        return startOfName;
    }

    /**
     * Sets the value of the startOfName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStartOfName(String value) {
        this.startOfName = value;
    }

}
