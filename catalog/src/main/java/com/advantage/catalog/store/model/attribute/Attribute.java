package com.advantage.catalog.store.model.attribute;

import com.advantage.catalog.store.model.product.ProductAttributes;
import org.apache.log4j.Logger;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ATTRIBUTE")
@NamedQueries({
        @NamedQuery(
                name = Attribute.QUERY_GET_ALL,
                query = "SELECT a FROM Attribute a"
        ),
        @NamedQuery(
                name = Attribute.QUERY_ATTRIBUTE_GET_BY_NAME,
                query = "SELECT a from Attribute a where UPPER(name) = :" + Attribute.PARAM_ATTRIBUTE_NAME
        )
})
public class Attribute {

    private static Logger logger = Logger.getLogger(Attribute.class);
    public static final String FIELD_ID = "attribute_id";
    public static final String PARAM_ID = "ATTRIBUTE_PARAM_ID";
    public static final String QUERY_GET_ALL = "attribute.GetAll";
    public static final String QUERY_ATTRIBUTE_GET_BY_NAME = "attribute.GetByName";

    public static final String PARAM_ATTRIBUTE_NAME = "PARAM_ATTRIBUTE_NAME";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = FIELD_ID)
    private Long id;

    @Column(name = "NAME", length = 150, nullable = false)
    private String name;

    @OneToMany(mappedBy = "primaryKey.attribute", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ProductAttributes> productAttributes = new HashSet<>();

    public Attribute() {
    }

    public Attribute(String name) {
        setName(name);
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name.toUpperCase();
    }


    public Set<ProductAttributes> getProductAttributes() {
        return productAttributes;
    }

    public void setProductAttributes(Set<ProductAttributes> products) {
        this.productAttributes = products;
    }
}