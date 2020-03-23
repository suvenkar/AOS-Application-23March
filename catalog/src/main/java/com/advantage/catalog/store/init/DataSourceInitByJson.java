package com.advantage.catalog.store.init;

import com.advantage.catalog.store.dao.attribute.AttributeRepository;
import com.advantage.catalog.store.dao.category.CategoryRepository;
import com.advantage.catalog.store.model.attribute.Attribute;
import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.model.category.CategoryAttributeFilter;
import com.advantage.catalog.store.model.deal.Deal;
import com.advantage.catalog.store.model.product.LastUpdate;
import com.advantage.catalog.store.model.product.Product;
import com.advantage.catalog.store.model.product.ProductAttributes;
import com.advantage.catalog.store.services.ProductService;
import com.advantage.common.SystemParameters;
import com.advantage.common.dto.AttributeItem;
import com.advantage.common.dto.CategoryDto;
import com.advantage.common.dto.ProductDto;
import com.advantage.common.dto.PromotedProductDto;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.persistence.EntityManagerFactory;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSourceInitByJson {

    private Logger logger = Logger.getLogger(DataSourceInitByJson.class);

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private Environment env;

    public void init() throws Exception {
        logger.info("catalog.hibernate.db.hbm2ddlAuto=" + env.getProperty("catalog.hibernate.db.hbm2ddlAuto"));

        if (!SystemParameters.getHibernateHbm2ddlAuto(env.getProperty("catalog.hibernate.db.hbm2ddlAuto")).equals("validate")) {
            logger.info("Start init procedure");
            SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);

            Session session = sessionFactory.openSession();
            logger.trace("Open session");
            Transaction transaction = session.beginTransaction();
            logger.trace("session.beginTransaction()");

            final Category category1 = new Category("LAPTOPS", "1235");
            session.persist(category1);
            logger.trace("Category 1 persist success");

            final Category category2 = new Category("HEADPHONES", "1234");
            session.persist(category2);
            logger.trace("Category 2 persist success");

            final Category category3 = new Category("TABLETS", "1236");
            session.persist(category3);
            logger.trace("Category 3 persist success");

            final Category category4 = new Category("SPEAKERS", "1237");
            session.persist(category4);
            logger.trace("Category 4 persist success");

            final Category category5 = new Category("MICE", "1238");
            session.persist(category5);
            logger.trace("Category 5 persist success");

//        final Category category6 = new Category("BAGS & CASES", "1239");
//        session.persist(category6);

        /*Attributes INIT*/

            String[] newAttributes = new String[]{"GRAPHICS", "Customization", "Operating System", "Processor", "Memory", "Display", "CONNECTOR", "COMPATIBILITY", "WEIGHT", "Wireless technology", "Sensor resolution", "Type", "Manufacturer", "Scroller Type", "Display Size", "Display Resolution", "Touchscreen"};

            Map<String, Attribute> defAttributes = new HashMap<>();

        for (String attrib : newAttributes) {
            Attribute attribute = new Attribute();
            attribute.setName(attrib);
            session.persist(attribute);
            logger.trace("Attribute " + attrib + " persist success");
            defAttributes.put(attrib.toUpperCase(), attribute);
        }
        transaction.commit();

        for (Map.Entry<String, Attribute> entry : defAttributes.entrySet()) {
            session.save(entry.getValue());
            logger.trace("Session save success");
        }

            //for categories-attributes show filter
            final List<Category> categories = categoryRepository.getAll();

            //  Initialize "category_attributes_filter"
            ClassPathResource filePath = new ClassPathResource("categoryAttributes_4.json");
            File json = filePath.getFile();

            ObjectMapper objectMapper = new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true);
            CategoryAttributeFilter[] categoryAttributeFilters = objectMapper.readValue(json, CategoryAttributeFilter[].class);

            transaction = session.beginTransaction();
            logger.trace("session.beginTransaction()");

            for (CategoryAttributeFilter categoryAttributeFilter : categoryAttributeFilters) {
                session.persist(categoryAttributeFilter);
            }

            transaction.commit();
            logger.debug("Transaction commit successful");

            //  Initializr Category Products
            filePath = new ClassPathResource("categoryProducts_4.json");
            json = filePath.getFile();

            objectMapper = new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            //objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            //Changed by Evgeney
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true);
            CategoryDto[] categoryDtos = objectMapper.readValue(json, CategoryDto[].class);
            transaction = session.beginTransaction();
            logger.trace("session.beginTransaction()");
            Map<Long, Product> productMap = new HashMap<>();
            for (CategoryDto categoryDto : categoryDtos) {
                Category category = categoryRepository.get(categoryDto.getCategoryId());

                /*PRODUCT*/
                for (ProductDto productDto : categoryDto.getProducts()) {
                    Product product = new Product(productDto.getProductName(), productDto.getDescription(), productDto.getPrice(), category, productDto.getProductStatus());
                    product.setManagedImageId(productDto.getImageUrl());
                    session.persist(product);
                    logger.trace("Product persist success");
                    //load attributes
                    for (AttributeItem attributeItem : productDto.getAttributes()) {
                        ProductAttributes attributes = new ProductAttributes();
                        attributes.setProduct(product);

                        attributes.setAttribute(defAttributes.get(attributeItem.getAttributeName().toUpperCase()));
                        attributes.setAttributeValue(attributeItem.getAttributeValue());

                        session.save(attributes);
                        logger.trace("Session save success");
                    }

                    if (productDto.getImages().size() == 0) {
                        productDto.getImages().add(product.getManagedImageId());
                    }

                    //TODO-EVG move to the productService ?
                    product.setColors(productService.getColorAttributes(productDto.getColors(), product));
                    product.setImages(productService.getImageAttribute(productDto.getImages(), product));

                    productMap.put(product.getId(), product);
                }

                //  Initialize Promoted products
                PromotedProductDto promotedProductDto = categoryDto.getPromotedProduct();
                Long prodId = promotedProductDto.getId();
                Product product = productMap.get(prodId);
                Assert.notNull(product, "\nPromotedProduct null, promoted product id=" + prodId + ", category number=" + categoryDto.getCategoryId());
                Deal deal = new Deal(10, product.getDescription(), promotedProductDto.getPromotionHeader(), promotedProductDto.getPromotionSubHeader(), promotedProductDto.getStaringPrice(),
                        promotedProductDto.getPromotionImageId(), 0, "", "", product);

                session.persist(deal);
                logger.debug("Deal persist success");

            }
            transaction.commit();
            logger.debug("Transaction commit successful");
            //  Added by Binyamin Regev for Android and iOs mobile devices
            transaction = session.beginTransaction();
            session.persist(new LastUpdate("Data", new Date().getTime()));
            transaction.commit();
            logger.debug("Transaction commit successful");
        }
    }

    //TODO-EVG Delete?
    private String getPath() throws IOException {
        String path = this.getClass().getClassLoader().getResource("").getPath();
        String fullPath = URLDecoder.decode(path, "UTF-8");
        String pathArr[] = fullPath.split("/target/");
        fullPath = pathArr[0];

        return fullPath.substring(1);


        /*File catalinaBase = new File(System.getProperty("catalina.base")).getAbsoluteFile();
        File propertyFile = new File(catalinaBase, "webapps/root/app");

        return propertyFile.getAbsolutePath();*/

        // return new java.io.File( ".").getCanonicalPath().split("bin")[0];
    }

    /*private Set<ImageAttribute> getImageAttribute(Collection<String> images, Product product) {
        Set<ImageAttribute> imageAttributes = new HashSet<>();
        for (String s : images) {
            ImageAttribute image = new ImageAttribute(s);
            image.setProduct(product);
            imageAttributes.add(image);
        }

        return imageAttributes;
    }*/

   /* private  Set<ColorAttribute> getColorAttributes(Collection<ColorAttribute> colors, Product product) {
        Set<ColorAttribute> colorAttributes = new HashSet<>();
        for (ColorAttribute s : colors) {
            ColorAttribute color = new ColorAttribute(s.getName());
            color.setProduct(product);
            color.setInStock(s.getInStock());
            colorAttributes.add(color);
        }
        return colorAttributes;
    }*/
}
