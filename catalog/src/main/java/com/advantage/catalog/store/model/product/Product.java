package com.advantage.catalog.store.model.product;

import javax.persistence.*;

import com.advantage.catalog.store.model.category.Category;
import com.advantage.common.enums.ProductStatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "PRODUCT")
@NamedQueries({
        @NamedQuery(
                name = Product.QUERY_GET_ALL,
                //query = "select p from Product p where UPPER(active) = 'Y' and UPPER(productstatus) <> 'BLOCK' order by p.productName"
                query = "select p from Product p where UPPER(active) = 'Y' order by p.productName"

        ),
        @NamedQuery(
                name = Product.PRODUCT_FILTER_BY_NAME,
                //query = "select p from Product p where UPPER(active) = 'Y' and UPPER(productstatus) <> 'BLOCK' and UPPER(p.productName) like :pname"
                query = "select p from Product p where UPPER(active) = 'Y' and UPPER(p.productName) like :pname"
        ),
        @NamedQuery(
                name = Product.PRODUCT_FILTER_BY_CATEGORY_ID,
                //query = "select p from Product p where UPPER(active) = 'Y' and UPPER(productstatus) <> 'BLOCK' and UPPER(p.productName) like :pname"
                query = "select p from Product p where UPPER(active) = 'Y' and p.category.categoryId = :" + Product.PARAM_CATEGORY_ID
        )
})
@NamedStoredProcedureQuery(
        name = "getfilteredproducts",
        procedureName = "getfilteredproducts",
        resultClasses = Product.class,
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.IN, type = Integer.class, name = "quantity"),
                @StoredProcedureParameter(mode = ParameterMode.IN, type = String.class, name = "name"),
                //@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, type = void.class),
        }
)
public class Product {
    public static final String QUERY_GET_ALL = "product.getAll";

    public static final String FIELD_ID = "product_id";
    public static final String FIELD_CATEGORY_ID = "category.categoryId";
    public static final String PARAM_ID = "PARAM_PRODUCT_ID";
    public static final String PARAM_CATEGORY_ID = "PARAM_PRODUCT_CATEGORY_ID";
    public static final String PRODUCT_FILTER_BY_NAME = "product.FilterByName";
    public static final String PRODUCT_FILTER_BY_CATEGORY_ID = "product.FilterByCategoryId";
    public static final String GETFILTEREDPRODUCTS = "getfilteredproducts";
    public static final String PROCEDURE_PROD = "procedure_prod";
    public static final String PRODUCT_STATUS = "product_status";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = FIELD_ID)
    private Long id;

    @Column(name = "product_name")
    private String productName;
    private double price;
    @Column(length = 2048)
    private String description;

    @Column(length = 10)
    private String productStatus;

    @Column(name = "managed_image_id")
    private String managedImageId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @OneToMany(mappedBy = "primaryKey.product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ProductAttributes> productAttributes = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<ColorAttribute> colors = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<ImageAttribute> images = new HashSet<>();

    @JsonIgnore
    private char active;

    public Product() {
    }



    public Product(String name, String description, double price, Category category) {
        this.productName = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.productStatus= ProductStatusEnum.ACTIVE.getStringCode();
        this.active = 'Y';
    }

    public Product(String name, String description, double price, Category category, String productStatus) {
        this.productName = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.productStatus= ProductStatusEnum.getValueByPropertyName(productStatus).getStringCode();
        this.active = 'Y';
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Product(String name) {
        this.productName = name;
    }

    public String getProductName() {
        return productName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getManagedImageId() {
        return managedImageId;
    }

    public void setManagedImageId(String managedImageId) {
        this.managedImageId = managedImageId;
    }

    public Set<ColorAttribute> getColors() {
        return colors;
    }

    public void setColors(Set<ColorAttribute> colors) {
        this.colors = colors;
    }

    public Set<ImageAttribute> getImages() {
        return images;
    }

    public void setImages(Set<ImageAttribute> images) {
        this.images = images;
    }

    @JsonIgnore
    public Set<ProductAttributes> getProductAttributes() {
        return productAttributes;
    }

    public void setProductAttributes(Set<ProductAttributes> attributes) {
        this.productAttributes = attributes;
    }

    public String getProductStatus() { return productStatus; }

    public void setProductStatus(String productStatus) { this.productStatus = productStatus; }

    public char getActive() {
        return active;
    }

    public void setActive(char active) {
        this.active = active;
    }

    /**
     * Don't compare {@link #getActive()} becaues it's just an indicator whether or not the
     * product is active or deleted.
     * @param o
     * @return
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Product product = (Product) o;

        if (Double.compare(product.getPrice(), getPrice()) != 0) return false;
        if (!getId().equals(product.getId())) return false;
        if (!getProductName().equals(product.getProductName())) return false;
        if (!getDescription().equals(product.getDescription())) return false;
        if (!getProductStatus().equals(product.getProductStatus())) return false;
        if (!getManagedImageId().equals(product.getManagedImageId())) return false;
        if (!getCategory().equals(product.getCategory())) return false;
        if (!getProductAttributes().equals(product.getProductAttributes())) return false;
        if (!getColors().equals(product.getColors())) return false;
        return getImages().equals(product.getImages());

    }

}
