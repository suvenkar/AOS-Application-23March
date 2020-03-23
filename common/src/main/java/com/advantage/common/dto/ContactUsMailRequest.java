package com.advantage.common.dto;

/**
 * This is a REQUEST for a MOCK service class. The response is ALWAYS "OK".
 * @author Binyamin Regev on 02/02/2016.
 */
public class ContactUsMailRequest {
    private String email;
    private Long categoryId;
    private Long productId;
    private String text;

    /**
     * Default constructor
     */
    public ContactUsMailRequest() {
    }

    /**
     * Constructor for <b>MANDATORY</b> fields.
     * @param email
     * @param text
     */
    public ContactUsMailRequest(String email, String text) {
        this.email = email;
        this.text = text;
    }

    /**
     * Constructor for all fields. {@code categiryId} and/or {@code productId} can be {@code null}.
     * @param email
     * @param categoryId
     * @param productId
     * @param text
     */
    public ContactUsMailRequest(String email, Long categoryId, Long productId, String text) {
        this.email = email;
        this.categoryId = categoryId;
        this.productId = productId;
        this.text = text;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

}
