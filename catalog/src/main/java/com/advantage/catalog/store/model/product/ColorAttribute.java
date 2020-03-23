package com.advantage.catalog.store.model.product;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import static com.advantage.catalog.store.model.product.ColorAttribute.PARAM_COLOR_CODE;

@Entity
@NamedQueries({
        @NamedQuery(
                name = ColorAttribute.QUERY_GET_ALL,
                //query = "select p from Product p where UPPER(active) = 'Y' and UPPER(productstatus) <> 'BLOCK' order by p.productName"
                query = "select ca from ColorAttribute ca order by ca.product, ca.code"
        ),
        @NamedQuery(
                name = ColorAttribute.QUERY_GET_BY_PRODUCT_AND_COLOR_CODE,
                query = "select ca from ColorAttribute ca where ca.product = :" + ColorAttribute.PARAM_PRODUCT_ID +
                        " and UPPER(code) = :" + ColorAttribute.PARAM_COLOR_CODE
//        ),
//        @NamedQuery(
//                name = ColorAttribute.QUERY_GET_BY_PRODUCTS,
//                query = "select ca from ColorAttribute ca where product in :" + ColorAttribute.PARAM_PRODUCTS_IDS + ColorAttribute.PARAM_COLOR_CODE
        )
})
public class ColorAttribute {

    public static final String QUERY_GET_ALL = "colorAttribute.getAll";
    public static final String QUERY_GET_BY_PRODUCTS = "colorAttribute.getByProductId";
    public static final String QUERY_GET_BY_PRODUCT_AND_COLOR_CODE = "colorAttribute.getByProductIdAndColorCode";

    public static final String PARAM_ID = "PARAM_COLOR_ATTRIBUTE_ID";
    public static final String PARAM_PRODUCT_ID = "PARAM_PRODUCT_ID";
    public static final String PARAM_PRODUCTS_IDS = "PARAM_PRODUCTS_IDS";
    public static final String PARAM_COLOR_CODE = "PARAM_COLOR_CODE";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = Product.FIELD_ID)
    @JsonIgnore
    private Product product;

    @Column(name = "inStock")
    private int inStock;

    public ColorAttribute() {
    }

    public ColorAttribute(String name) {
        this.name = name;
    }

    public ColorAttribute(String name, int inStock) {
        this.name = name;
        this.inStock = inStock;
    }

    public ColorAttribute(String name, String code, int inStock) {
        this.name = name;
        this.code = code;
        this.inStock = inStock;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Product getProduct() {
        return product;
    }

    public int getInStock() {
        return inStock;
    }

    public void setInStock(int inStock) {
        this.inStock = inStock;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ColorAttribute that = (ColorAttribute) o;

        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        return !(product != null ? !product.equals(that.product) : that.product != null);

    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (product != null ? product.hashCode() : 0);
        return result;
    }
}
