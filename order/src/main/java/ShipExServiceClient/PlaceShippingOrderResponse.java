
package ShipExServiceClient;

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
 *         &lt;element name="SETransactionType" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Code" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Reason" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TransactionReference" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TransactionDate" type="{http://www.w3.org/2001/XMLSchema}string"/>
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
    "seTransactionType",
    "code",
    "reason",
    "transactionReference",
    "transactionDate"
})
@XmlRootElement(name = "PlaceShippingOrderResponse")
public class PlaceShippingOrderResponse {

    @XmlElement(name = "SETransactionType", required = true)
    protected String seTransactionType;
    @XmlElement(name = "Code", required = true)
    protected String code;
    @XmlElement(name = "Reason", required = true)
    protected String reason;
    @XmlElement(name = "TransactionReference", required = true)
    protected String transactionReference;
    @XmlElement(name = "TransactionDate", required = true)
    protected String transactionDate;

    /**
     * Gets the value of the seTransactionType property.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getSETransactionType() {
        return seTransactionType;
    }

    /**
     * Sets the value of the seTransactionType property.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setSETransactionType(String value) {
        this.seTransactionType = value;
    }

    /**
     * Gets the value of the code property.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets the value of the code property.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setCode(String value) {
        this.code = value;
    }

    /**
     * Gets the value of the reason property.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getReason() {
        return reason;
    }

    /**
     * Sets the value of the reason property.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setReason(String value) {
        this.reason = value;
    }

    /**
     * Gets the value of the transactionReference property.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getTransactionReference() {
        return transactionReference;
    }

    /**
     * Sets the value of the transactionReference property.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setTransactionReference(String value) {
        this.transactionReference = value;
    }

    /**
     * Gets the value of the transactionDate property.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getTransactionDate() {
        return transactionDate;
    }

    /**
     * Sets the value of the transactionDate property.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setTransactionDate(String value) {
        this.transactionDate = value;
    }

    @Override
    public String toString() {
        return "PlaceShippingOrderResponse{" +
                "seTransactionType='" + seTransactionType + '\'' +
                ", code='" + code + '\'' +
                ", reason='" + reason + '\'' +
                ", transactionReference='" + transactionReference + '\'' +
                ", transactionDate='" + transactionDate + '\'' +
                '}';
    }
}
