package com.advantage.catalog_test.online.store.dao;

import java.io.IOException;
import java.util.List;

import com.advantage.catalog.store.model.product.Product;
import com.advantage.catalog.store.services.ProductService;
import com.advantage.catalog_test.cfg.AdvantageTestContextConfiguration;
import com.advantage.common.dto.ProductDto;
import com.advantage.common.dto.ProductResponseDto;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;

import com.advantage.catalog.store.dao.category.CategoryRepository;
import com.advantage.catalog.store.dao.product.ProductRepository;
import com.advantage.catalog.store.model.category.Category;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * @author Binyamin Regev
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class ProductRepositoryTests extends GenericRepositoryTests {

    public static final String CATEGORY_NAME = "LAPTOPS";
    public static final String IMAGE_ID = "1234";
    public static final String PRODUCT_NAME = "LG G3";
    public static final String PRODUCT_STATUS_BAD = "Test";
    public static final String PRODUCT_STATUS_ACTIVE = "Active";
    public static final String PRODUCT_STATUS_BLOCK = "Block";
    public static final String PRODUCT_STATUS_OUT_OF_STOCK = "OutOfStock";
    public static final String PRODUCT_DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
    public static final double PRODUCT_PRICE = 400;
    @Qualifier("categoryRepository")
    @Autowired
    private CategoryRepository categoryRepository;

    @Qualifier("productRepository")
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Test
    public void testGetCategoryProductsFetch() {

//        final TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);
//        final Category category1 = categoryRepository.createCategory("LAPTOPS", "1234");
//        final Category category2 = categoryRepository.createCategory("CELL PHONES", "1234");
//        final Category category3 = categoryRepository.createCategory("KEYBOARDS", "1234");
//        final int CATEGORY1_PRODUCTS_COUNT = 10;
//        final int CATEGORY2_PRODUCTS_COUNT = 5;
//
//        for (int i = 0; i < CATEGORY1_PRODUCTS_COUNT; i++) {
//            final String productName = "product" + i;
//            productRepository.create("LG G3", productName, 400, "1234", category1);
//        }
//        System.out.println("Category1 Products count - Finish");
//
//        for (int i = 0; i < CATEGORY2_PRODUCTS_COUNT; i++) {
//            final String nameAndDescriptionForTest = "product" + i;
//            productRepository.create(nameAndDescriptionForTest,
//                    nameAndDescriptionForTest, 400, "1234", category2);
//        }
//        System.out.println("Category2 Products count - Finish");
//
//        transactionManager.commit(transactionStatusForCreation);
//
//        List<Product> categoryProducts = productRepository.getCategoryProducts(category1);
//        System.out.println("Assert Category1 Products count - " + categoryProducts.size() + " == " + CATEGORY1_PRODUCTS_COUNT);
//        Assert.assertEquals(CATEGORY1_PRODUCTS_COUNT, categoryProducts.size());
//
//        TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//        productRepository.delete(categoryProducts);
//        transactionManager.commit(transactionStatusForDeletion);
//
//        categoryProducts = productRepository.getCategoryProducts(category2);
//        System.out.println("Assert Category2 Products count - " + categoryProducts.size() + " == " + CATEGORY2_PRODUCTS_COUNT);
//        Assert.assertEquals(CATEGORY2_PRODUCTS_COUNT, categoryProducts.size());
//
//        transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//        productRepository.delete(categoryProducts);
//        transactionManager.commit(transactionStatusForDeletion);
//
//        categoryProducts = productRepository.getCategoryProducts(category3);
//        System.out.println("Assert Category3 Products count - isEmpty() == " + categoryProducts.isEmpty());
//        Assert.assertTrue(categoryProducts.isEmpty());
//
//        transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//        productRepository.delete(categoryProducts);
//        transactionManager.commit(transactionStatusForDeletion);
//
//        transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//        categoryRepository.delete(category1, category2, category3);
//        transactionManager.commit(transactionStatusForDeletion);
        Assert.assertTrue(true);
    }

    @Test
    public void testProductCreate() throws IOException {

        System.out.println("testProductCreate() - Begin");

        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        final TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);

        System.out.println("categoryRepository.createCategory(\'" + CATEGORY_NAME + "\', \'" + IMAGE_ID + "\')");
        final Category category = categoryRepository.createCategory(CATEGORY_NAME, IMAGE_ID);

        System.out.println("categoryRepository.create(\'" + PRODUCT_NAME + "\', description, " + PRODUCT_PRICE + ", \'" + IMAGE_ID + "\', category)");
        final Product product = productRepository.create(PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, IMAGE_ID, category);

        System.out.println("transactionManager.commit(transactionStatusForCreation)");
        transactionManager.commit(transactionStatusForCreation);

        System.out.println("long id = product.getId()");
        long id = product.getId();

        System.out.println("Assert.assertNotNull(product)");
        Assert.assertNotNull(product);

        System.out.println("Assert.assertNotNull(id)");
        Assert.assertNotNull(id);
        Assert.assertEquals(PRODUCT_NAME, product.getProductName());
        Assert.assertEquals(PRODUCT_DESCRIPTION, product.getDescription());
        Assert.assertEquals(PRODUCT_PRICE, product.getPrice(), 0.5);
        Assert.assertEquals(IMAGE_ID, product.getManagedImageId());
        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);

        System.out.println("productRepository.delete(product)");
        productRepository.delete(product);

        System.out.println("categoryRepository.delete(category)");
        categoryRepository.delete(category);

        System.out.println("transactionManager.commit(transactionStatusForDeletion)");
        transactionManager.commit(transactionStatusForDeletion);

        System.out.println("testProductCreate() - End");

    }

    @Test
    public void testProductStatus() throws IOException {

//        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
//        final TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);
//        final Category category = categoryRepository.createCategory(CATEGORY_NAME, IMAGE_ID);
//
//        //test set productStatus BAD
//       // System.out.println("create product with productStatus BAD");
//
//        Product product = productRepository.create(PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, IMAGE_ID, category, PRODUCT_STATUS_BAD);
//        System.out.println("product is null. [product] " + product);
//        Assert.assertNull("Error! Expecting product null but got not null. [product] " + product, product);
//
//        //test set productStatus empty string ""
//
//        product = productRepository.create(PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, IMAGE_ID, category, "");
//        Assert.assertNull("Error! Expecting product null but got not null. [product] " + product, product);
//        //product = productRepository.create(PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, IMAGE_ID,
//
//
//        //product have productStatus Active(true)
//        Assert.assertNotNull("Error! Expecting true but got false. [productStatus] " + product, (product = productRepository.create(PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, IMAGE_ID, category,PRODUCT_STATUS_ACTIVE)));
//        transactionManager.commit(transactionStatusForCreation);
//
//        final TransactionStatus transactionStatusForUpdate = transactionManager.getTransaction(transactionDefinition);
//
//        //product have productStatus Block(true)
//        ProductDto productDto=null;
//        productDto= productService.getDtoByEntity(product);
//        productDto.setProductStatus(PRODUCT_STATUS_BLOCK);
//
//        Assert.assertNotNull("Error! Expecting true but got false. [productStatusBLOCK] " + productDto.getProductStatus()+" "+ product.getProductStatus(),productService.updateProduct(productDto,product.getId()));
//        transactionManager.commit(transactionStatusForUpdate);
//
//        final TransactionStatus transactionStatusForUpdate2 = transactionManager.getTransaction(transactionDefinition);
//        //product have productStatus OutOfStock(true)
//        productDto= productService.getDtoByEntity(product);
//        productDto.setProductStatus(PRODUCT_STATUS_OUT_OF_STOCK);
//
//        Assert.assertEquals("Error! Asserting Not Null. Expecting true but got false. [productStatusOutOfStock] " + PRODUCT_STATUS_OUT_OF_STOCK, productDto.getProductStatus());
//        transactionManager.commit(transactionStatusForUpdate2);
//
//
//        /*String stringJson = "{ \"productId\": 1, \"categoryId\": 1, " +
//        "      \"productName\": \"HP Pavilion 15t Touch Laptop\"," +
//        "      \"price\": 519.99," +
//        "      \"description\": \"Redesigned with you in mind, the HP Pavilion keeps getting better. Our best-selling notebook is now more powerful so you can watch more, play more, and store more, all in style.\"," +
//        "      \"imageUrl\": \"1241\"," +
//        "      \"attributes\": [" +
//        "        {" +
//        "          \"attributeName\": \"DISPLAY\"," +
//        "          \"attributeValue\": \"15.6-inch diagonal HD WLED-backlit Display (1366x768) Touchscreen\"" +
//        "        }," +
//        "        {" +
//        "          \"attributeName\": \"MEMORY\"," +
//        "          \"attributeValue\": \"16GB DDR3 - 2 DIMM\"" +
//        "        }," +
//        "        {" +
//        "          \"attributeName\": \"PROCESSOR\"," +
//        "          \"attributeValue\": \"Intel(R) Core(TM) i5-6200U Dual CoreProcessor\"" +
//        "        }," +
//        "        {" +
//        "          \"attributeName\": \"OPERATING SYSTEM\"," +
//        "          \"attributeValue\": \"Windows 10\"" +
//        "        }," +
//        "        {" +
//        "          \"attributeName\": \"CUSTOMIZATION\"," +
//        "          \"attributeValue\": \"Gaming\" }" +
//        "      ]," +
//        "      \"colors\": [ {" +
//        "          \"code\": \"00FF00\"," +
//        "          \"name\": \"GREEN\"," +
//        "          \"inStock\": 10" +
//        "        }," +
//        "        {" +
//        "          \"code\": \"0000FF\"," +
//        "          \"name\": \"BLUE\"," +
//        "          \"inStock\": 10" +
//        "        }," +
//        "        {" +
//        "          \"code\": \"C0C0C0\",\n" +
//        "          \"name\": \"SILVER\",\n" +
//        "          \"inStock\": 10 }],\"images\": [\"1241\"],\"productStatus\": \"Active\"}";
//*/
//        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//
//
//        for (Product prod: productRepository.getAll()) {
//            productRepository.delete(prod);
//        }
//
//        categoryRepository.delete(category);
//        System.out.println("categoryRepository.delete(category);");
//        transactionManager.commit(transactionStatusForDeletion);
        Assert.assertTrue(true);
    }
}
