//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.7 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2017.12.12 at 12:44:42 AM EST 
//


package accountservice.store.online.advantage.com;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="numberOfFailedLoginAttemptsBeforeBlocking" type="{http://www.w3.org/2001/XMLSchema}int" form="qualified"/>
 *         &lt;element name="loginBlockingIntervalInSeconds" type="{http://www.w3.org/2001/XMLSchema}long" form="qualified"/>
 *         &lt;element name="productInStockDefaultValue" type="{http://www.w3.org/2001/XMLSchema}int" form="qualified"/>
 *         &lt;element name="userSecondWsdl" type="{http://www.w3.org/2001/XMLSchema}boolean" form="qualified"/>
 *         &lt;element name="userLoginTimeout" type="{http://www.w3.org/2001/XMLSchema}int" form="qualified"/>
 *         &lt;element name="allowUserConfiguration" type="{http://www.w3.org/2001/XMLSchema}boolean" form="qualified"/>
 *         &lt;element name="maxConcurrentSessions" type="{http://www.w3.org/2001/XMLSchema}int" form="qualified"/>
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
    "numberOfFailedLoginAttemptsBeforeBlocking",
    "loginBlockingIntervalInSeconds",
    "productInStockDefaultValue",
    "userSecondWsdl",
    "userLoginTimeout",
    "allowUserConfiguration",
    "maxConcurrentSessions"
})
@XmlRootElement(name = "GetAccountConfigurationResponse")
public class GetAccountConfigurationResponse {

    protected int numberOfFailedLoginAttemptsBeforeBlocking;
    protected long loginBlockingIntervalInSeconds;
    protected int productInStockDefaultValue;
    protected boolean userSecondWsdl;
    protected int userLoginTimeout;
    protected boolean allowUserConfiguration;
    protected int maxConcurrentSessions;

    /**
     * Gets the value of the numberOfFailedLoginAttemptsBeforeBlocking property.
     * 
     */
    public int getNumberOfFailedLoginAttemptsBeforeBlocking() {
        return numberOfFailedLoginAttemptsBeforeBlocking;
    }

    /**
     * Sets the value of the numberOfFailedLoginAttemptsBeforeBlocking property.
     * 
     */
    public void setNumberOfFailedLoginAttemptsBeforeBlocking(int value) {
        this.numberOfFailedLoginAttemptsBeforeBlocking = value;
    }

    /**
     * Gets the value of the loginBlockingIntervalInSeconds property.
     * 
     */
    public long getLoginBlockingIntervalInSeconds() {
        return loginBlockingIntervalInSeconds;
    }

    /**
     * Sets the value of the loginBlockingIntervalInSeconds property.
     * 
     */
    public void setLoginBlockingIntervalInSeconds(long value) {
        this.loginBlockingIntervalInSeconds = value;
    }

    /**
     * Gets the value of the productInStockDefaultValue property.
     * 
     */
    public int getProductInStockDefaultValue() {
        return productInStockDefaultValue;
    }

    /**
     * Sets the value of the productInStockDefaultValue property.
     * 
     */
    public void setProductInStockDefaultValue(int value) {
        this.productInStockDefaultValue = value;
    }

    /**
     * Gets the value of the userSecondWsdl property.
     * 
     */
    public boolean isUserSecondWsdl() {
        return userSecondWsdl;
    }

    /**
     * Sets the value of the userSecondWsdl property.
     * 
     */
    public void setUserSecondWsdl(boolean value) {
        this.userSecondWsdl = value;
    }

    /**
     * Gets the value of the userLoginTimeout property.
     * 
     */
    public int getUserLoginTimeout() {
        return userLoginTimeout;
    }

    /**
     * Sets the value of the userLoginTimeout property.
     * 
     */
    public void setUserLoginTimeout(int value) {
        this.userLoginTimeout = value;
    }

    /**
     * Gets the value of the allowUserConfiguration property.
     * 
     */
    public boolean isAllowUserConfiguration() {
        return allowUserConfiguration;
    }

    /**
     * Sets the value of the allowUserConfiguration property.
     * 
     */
    public void setAllowUserConfiguration(boolean value) {
        this.allowUserConfiguration = value;
    }

    /**
     * Gets the value of the maxConcurrentSessions property.
     * 
     */
    public int getMaxConcurrentSessions() {
        return maxConcurrentSessions;
    }

    /**
     * Sets the value of the maxConcurrentSessions property.
     * 
     */
    public void setMaxConcurrentSessions(int value) {
        this.maxConcurrentSessions = value;
    }

}
