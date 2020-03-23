package com.advantage.catalog.util.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.advantage.catalog.util.ArgumentValidationHelper;

/**
 * A helper class for the interaction with a XML element.
 * <br/>
 *
 * @author eli.dali@hpe.com
 */
public class XmlItem {

    private Element element;

    /**
     * Create a new instance, based on the given element.
     *
     * @param element the element to base the new XML item instance on.
     * @throws IllegalArgumentException if the given element references <b>null</b>.
     */
    public XmlItem(final Element element) {

        ArgumentValidationHelper.validateArgumentIsNotNull(element, "element");
        this.element = element;
    }

    public void setAttribute(final String attributeName, final String attributeValue) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(attributeName,
                "attribute name");

        if (attributeValue == null) {

            element.removeAttribute(attributeName);
        }

        element.setAttribute(attributeName, attributeValue);
    }

    public String getAttribute(final String attributeName) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(attributeName,
                "attribute name");
        return element.getAttribute(attributeName);
    }

    public void setTextContent(final String textContent) {

        if (textContent == null) {

            element.setTextContent(StringUtils.EMPTY);
        } else {

            element.setTextContent(textContent);
        }
    }

    public String getTextContent() {

        return element.getTextContent();
    }

    public XmlItem addChildXmlItem(final String tagName, final String textContent) {

        ArgumentValidationHelper.validateArgumentIsNotNull(tagName, "tag name");
        final Document document = element.getOwnerDocument();
        final Element childElement = document.createElement(tagName);
        element.appendChild(childElement);
        final XmlItem childXmlItem = new XmlItem(childElement);

        if (textContent != null) {

            childXmlItem.setTextContent(textContent);
        }

        return childXmlItem;
    }

    public List<XmlItem> getChildrenByTagName(final String childElementTagName) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(childElementTagName,
                "child element tag name");
        final NodeList nodeList = element.getElementsByTagName(childElementTagName);
        final int elementsCount = nodeList.getLength();
        final List<XmlItem> children = new ArrayList<>(elementsCount);

        for (int i = 0; i < elementsCount; i++) {

            final Element element = (Element) nodeList.item(i);
            final XmlItem child = new XmlItem(element);
            children.add(child);
        }

        return children;
    }

    public XmlItem getFirstChildByTagName(final String childElementTagName) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(childElementTagName,
                "child element tag name");
        final NodeList nodeList = element.getElementsByTagName(childElementTagName);
        final int elementsCount = nodeList.getLength();
        final XmlItem child;

        if (elementsCount == 0) {

            child = null;
        } else {

            final Element element = (Element) nodeList.item(0);
            child = new XmlItem(element);
        }

        return child;
    }

    public String getFirstChildTextContent(final String childElementTagName) {

        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(childElementTagName,
                "child element tag name");
        final XmlItem xmlItem = getFirstChildByTagName(childElementTagName);
        final String content;

        if (xmlItem == null) {

            content = null;
        } else {

            content = xmlItem.getTextContent();
        }

        return content;
    }

    public Document getDocument() {

        return element.getOwnerDocument();
    }

    public void removeChild(final XmlItem childXmlItem) {

        ArgumentValidationHelper.validateArgumentIsNotNull(childXmlItem, "child XML item");
        element.removeChild(childXmlItem.element);
    }
}