package com.advantage.catalog_test.online.store.dao;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.advantage.catalog.store.dao.category.CategoryRepository;
import com.advantage.catalog.store.model.product.Product;
import com.advantage.catalog_test.cfg.AdvantageTestContextConfiguration;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;


import com.advantage.catalog.store.dao.deal.DealRepository;
import com.advantage.catalog.store.dao.product.ProductRepository;
import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.model.deal.Deal;
import com.advantage.catalog.store.model.deal.DealType;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})
public class DealRepositoryTests extends GenericRepositoryTests {

    public static final int DEALS_COUNT = 10;
    public static final int CATEGORY_NUMBER = 5;

    @Qualifier("categoryRepository")
    @Autowired
    private CategoryRepository categoryRepository;

    @Qualifier("productRepository")
    @Autowired
    private ProductRepository productRepository;

    @Qualifier("dealRepository")
    @Autowired
    private DealRepository dealRepository;

    @Test
    public void testGetAllDeals() {
        TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);
        final Category category = categoryRepository.createCategory("LAPTOPS", "1234");
        final Product product = productRepository.create("LG G3",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 400, "1234", category);

        List<Deal> deals = new ArrayList<>();
        for (int i = 1; i <= DEALS_COUNT; i++) {
            final String description = "test deal" + i;
            dealRepository.create(DealType.WEEKLY, description, "header", "header", "200", "1234", 30, "2015-11-15 00:00:00", "2015-11-30 23:59:59", product);

            deals = dealRepository.getAll();
            Assert.assertNotNull(deals);
        }

        transactionManager.commit(transactionStatusForCreation);
        Assert.assertEquals(DEALS_COUNT, deals.size());

        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);

        deals.forEach(dealRepository::delete);

        productRepository.delete(product);
        categoryRepository.delete(category);
        transactionManager.commit(transactionStatusForDeletion);
    }

    @Test
    public void testDealCreation() throws IOException {

        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        final TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);
        final Category category = categoryRepository.createCategory("LAPTOPS", "1234");
        final Product product = productRepository.create("LG G3",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit", 400, "1234", category);
        final Deal deal = dealRepository.create(DealType.WEEKLY, "description", "header", "header", "200", "1234",
                30, "2015-11-15 00:00:00", "2015-11-30 23:59:59",
                product);
        transactionManager.commit(transactionStatusForCreation);
        Assert.assertNotNull(deal);
        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
        dealRepository.delete(deal);
        productRepository.delete(product);
        categoryRepository.delete(category);
        transactionManager.commit(transactionStatusForDeletion);
    }

//    @Test
//    public void testCategoriesFilled() throws IOException {
//        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
//        final TransactionStatus transactionStatusForCreation = transactionManager.getTransaction(transactionDefinition);
//
//        //create categories
//        System.out.println("creating 5 categories...");
//        Category category = null;
//        category = categoryRepository.createCategory("LAPTOPS", "1235");
//        category = categoryRepository.createCategory("HEADPHONES", "1234");
//        category = categoryRepository.createCategory("TABLETS", "1236");
//        category = categoryRepository.createCategory("SPEAKERS", "1237");
//        category = categoryRepository.createCategory("MICE", "1238");
//
//        System.out.println("COMMITing 5 categories.");
//        transactionManager.commit(transactionStatusForCreation);
//
//        System.out.println("Going to retrieve categories from table...");
//        final List<Category> categories = categoryRepository.getAll();
//        System.out.println("Retrieved " + categories.size() + " categories from table");
//
//        Assert.assertEquals("Error! Expecting " + CATEGORIES_NUMBER + " categories, but got " + categories.size(), CATEGORIES_NUMBER, categories.size());
//
//        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);
//
//        //delete categories
//        for(Category selected : categories) {
//            //categoryRepository.delete(selected.getCategoryId());
//            categoryRepository.delete(selected);
//        }
//
//        transactionManager.commit(transactionStatusForDeletion);
//    }
}