package com.advantage.catalog.store.model.demoappconfigxml;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

/**
 * @author Binyamin Regev on on 08/08/2016.
 */
public class ConfigurationParameter {
    @XmlElement
    private String name;
    @XmlAttribute
    private String tools;
    @XmlAttribute
    private String locationInAdvantage;
    @XmlAttribute
    private String description;
    @XmlAttribute
    private String datatype;

    public ConfigurationParameter() {
    }

    public ConfigurationParameter(String name) {
        this.name = name;
    }

    @XmlElement
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
