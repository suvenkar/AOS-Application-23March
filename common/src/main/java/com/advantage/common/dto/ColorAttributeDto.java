package com.advantage.common.dto;

public class ColorAttributeDto {
    private String code;
    private String name;
    private int inStock;

    public ColorAttributeDto() {
    }

    public ColorAttributeDto(String code, String name, int inStock) {
        this.code = code;
        this.name = name;
        this.inStock = inStock;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getInStock() {
        return inStock;
    }

    public void setInStock(int inStock) {
        this.inStock = inStock;
    }
}
