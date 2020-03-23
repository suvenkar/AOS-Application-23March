package com.advantage.catalog_test.online.store.dao;



import com.advantage.catalog.store.dao.attribute.AttributeRepository;
import com.advantage.catalog.store.dao.category.CategoryRepository;
import com.advantage.catalog.store.model.attribute.Attribute;
import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.model.category.CategoryAttributeFilter;
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

import java.io.IOException;
import java.util.List;

/**
 * Created by Moti Ostrovski on 02/02/2016.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AdvantageTestContextConfiguration.class})

public class CategoryAttributesTests extends GenericRepositoryTests{
    public static final int CATEGORIES_NUMBER = 6;
    public static final int CATEGORY_ATTRIBUTES_NUMBER = 65;


    @Qualifier("categoryRepository")
    @Autowired
    private CategoryRepository categoryRepository;

    @Qualifier("attributeRepository")
    @Autowired
    private AttributeRepository attributeRepository;



    @Test
    public void testCategoriesFilled() throws IOException {
        /*
        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        final TransactionStatus transactionForCreation = transactionManager.getTransaction(transactionDefinition);

        //create categories
        System.out.println("creating 5 categories...");
        Category category = null;
        category = categoryRepository.createCategory("HEADPHONES", "1234");
        category = categoryRepository.createCategory("LAPTOPS", "1235");
        category = categoryRepository.createCategory("TABLETS", "1236");
        category = categoryRepository.createCategory("SPEAKERS", "1237");
        category = categoryRepository.createCategory("MICE", "1238");

        System.out.println("COMMITing 5 categories.");
        transactionManager.commit(transactionForCreation);

        System.out.println("Going to retrieve categories from table...");
        List<Category> categories = categoryRepository.getAll();

        System.out.println("Retrieved " + categories.size() + " categories from table");

        //Assert.assertEquals("Error! Expecting " + CATEGORIES_NUMBER + " categories, but got " + categories.size(), CATEGORIES_NUMBER, categories.size());

        final TransactionStatus transactionStatusForDeletion = transactionManager.getTransaction(transactionDefinition);

        //delete categories
        for(Category selected : categories) {
            categoryRepository.delete(selected);
        }
        transactionManager.commit(transactionStatusForDeletion);
        */
        //categories = categoryRepository.getAll();
        //if (categories.size() > 0) {
        //    System.out.println("Retrieved " + categories.size() + " categories from table");
        //    Assert.assertEquals("Error! Expecting Categories table to be empty, but got " + categories.size() + " categories", 0, categories.size());
        //}
    }

    // <editor-fold desc="Description">
    /* not worked because productList is notEmpty
    @Test
    public void testAttributesFilled() throws IOException {
        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        final TransactionStatus transactionForCreation = transactionManager.getTransaction(transactionDefinition);
        //create attributes
        String[] newAttributes = new String[]{"GRAPHICS", "Customization", "Operating System", "Processor", "Memory", "Display", "CONNECTOR", "COMPATIBILITY", "WEIGHT", "Wireless technology", "Sensor resolution", "Type", "Manufacturer"};

        //Map<String, Attribute> defAttributes = new HashMap<>();

        System.out.println("adding 13 attributes to AttributeRepository");
        for (String attrib : newAttributes) {
            Attribute attribute = null;
            attribute =attributeRepository.create(attrib);
            //defAttributes.put(attrib.toUpperCase(), attribute);

        }

        System.out.println("commiting 13 attributes");
        transactionManager.commit(transactionForCreation);

        System.out.println("getting attributes from repository");
        List<Attribute> attributes= attributeRepository.getAll();


        System.out.println("Retrieved " + attributes.size() + " categories from table");
        Assert.assertEquals("Error! Expecting " + ATTRIBUTE_NUMBER + " attributes, but got " + attributes.size(), ATTRIBUTE_NUMBER, attributes.size());

        //final TransactionStatus transactionForDelete = transactionManager.getTransaction(transactionDefinition);
        //clear all attributes
        System.out.println("clear all attributes by ID");
//        for (Attribute attribute : attributes) {
//            attributeRepository.delete(attribute.getId());
//        }
        Attribute attribute = attributes.get(0);
        System.out.println("attributename "+attribute.getName()+ " ID "+ attribute.getId());

        //have a problem with delete by id and by object
        attributeRepository.delete(attribute);
        System.out.println("commit clear all attributes");
        //transactionManager.commit(transactionForDelete);

    }*/
// </editor-fold>


    @Test
    public void testCategoriesAttributesFilled() throws IOException {
        final TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        final TransactionStatus transactionForCreation = transactionManager.getTransaction(transactionDefinition);

        //init categories
        //System.out.println("creating 5 categories...");
        Category category = null;

        System.out.println("categoryRepository.createCategory(..)");
        category = categoryRepository.createCategory("HEADPHONES", "1234");
        category = categoryRepository.createCategory("LAPTOPS", "1235");
        category = categoryRepository.createCategory("TABLETS", "1236");
        category = categoryRepository.createCategory("SPEAKERS", "1237");
        category = categoryRepository.createCategory("MICE", "1238");

        System.out.println("transactionManager.commit(transactionForCreation)");
        transactionManager.commit(transactionForCreation);

        //System.out.println("categories from categoryRepository: "+categoryRepository.getAll().size());

        //init attributes
        //System.out.println("adding 13 attributes to AttributeRepository");
        System.out.println("String[] newAttributes = new String[]{...}");
        String[] newAttributes = new String[]{"GRAPHICS", "Customization", "Operating System", "Processor", "Memory", "Display", "CONNECTOR", "COMPATIBILITY", "WEIGHT", "Wireless technology", "Sensor resolution", "Type", "Manufacturer"};

        System.out.println("transactionForAttributes = transactionManager.getTransaction(..)");
        final TransactionStatus transactionForAttributes = transactionManager.getTransaction(transactionDefinition);

        Attribute attribute =null;

        System.out.println("LOOP: attributeRepository.create(attrib)");
        for (String attrib : newAttributes) {
            //System.out.println("attributeRepository.create(\'" + attrib + "\')");
            attribute = attributeRepository.create(attrib);
            //System.out.println(" finished attributeRepository.create(attrib)");
        }

        System.out.println("transactionManager.commit(transactionForAttributes)");
        transactionManager.commit(transactionForAttributes);

        //init categories-attributes show
        //for categories-attributes show filter
        //System.out.println("creating 65 categoryAttributeFilters");
        final TransactionStatus transactionForCaf = transactionManager.getTransaction(transactionDefinition);

        final List<Category> categories = categoryRepository.getAll();
        int i = 0;
        for (Category c: categories) {
            i++;
            System.out.println("Category #" + i + ": " + c.getCategoryName());
        }

        final List<Attribute> attributesToShow = attributeRepository.getAll();

        for (Category categorySelected : categories) {
            for (Attribute attributeSelecteted : attributesToShow ) {
                //CategoryAttributeFilter categoryAttributeFilter = new CategoryAttributeFilter(category.getCategoryId(), attribute.getId(), true);
                //session.persist(categoryAttributeFilter);
                CategoryAttributeFilter categoryAttributeFilter = null;
                categoryRepository.addCategoryAttributeFilter(new CategoryAttributeFilter(categorySelected.getCategoryId(), attributeSelecteted.getId(), true));
            }
        }
        System.out.println("transactionManager.commit(transactionForCaf)");
        transactionManager.commit(transactionForCaf);

        System.out.println("categoryRepository.getAllCategoryAttributeFilter()");
        final List<CategoryAttributeFilter> categoryAttributeFilter = categoryRepository.getAllCategoryAttributeFilter();

        Assert.assertEquals("Error! Expecting " + CATEGORY_ATTRIBUTES_NUMBER + " categoryAttributesFilter, but got " + categoryAttributeFilter.size(), CATEGORY_ATTRIBUTES_NUMBER, categoryAttributeFilter.size());

        System.out.println("testCategoriesAttributesFilled - Finished");
    }

}
