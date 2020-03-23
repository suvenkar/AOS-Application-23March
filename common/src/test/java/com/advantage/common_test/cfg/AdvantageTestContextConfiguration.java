package com.advantage.common_test.cfg;

import com.advantage.common.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;

@Configuration
//@ComponentScan({"com.advantage.order.store.services",
//        "com.advantage.order.store.dao",
//        "com.advantage.order.store.user.dao",
//        "com.advantage.order.store.user.model",
//        "com.advantage.order.store.init"})
@PropertySources(value = {/*@PropertySource("classpath:imageManagement.properties"),*/ @PropertySource(Constants.FILE_PROPERTIES_EXTERNAL), @PropertySource(Constants.FILE_PROPERTIES_INTERNAL), @PropertySource(Constants.FILE_PROPERTIES_GLOBAL)})

public class AdvantageTestContextConfiguration {

    @Autowired
    private Environment environment;
//
//    @Bean(name = "transactionManager")
//    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory,
//                                                         DriverManagerDataSource dataSource) {
//        JpaTransactionManager transactionManager = new JpaTransactionManager();
//        transactionManager.setEntityManagerFactory(entityManagerFactory);
//        transactionManager.setDataSource(dataSource);
//        return transactionManager;
//    }
//
//    @Bean(name = "datasource")
//    public DriverManagerDataSource dataSource() {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName(org.hsqldb.jdbcDriver.class.getName());
//        dataSource.setUrl("jdbc:hsqldb:mem:mydb");
//        dataSource.setUsername("sa");
//        dataSource.setPassword("jdbc:hsqldb:mem:mydb");
//        return dataSource;
//    }
//
//    @Bean(name = "entityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DriverManagerDataSource dataSource) {
//
//        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
//        entityManagerFactoryBean.setDataSource(dataSource);
//        entityManagerFactoryBean.setPackagesToScan(new String[]{"com.advantage.order.store.model", "com.advantage.order.store.user.model"});
//        entityManagerFactoryBean.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
//        entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
//
//        Map<String, Object> jpaProperties = new HashMap<String, Object>();
//        jpaProperties.put("hibernate.hbm2ddl.auto", "create");
//        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
//        jpaProperties.put("hibernate.show_sql", "true");
//        jpaProperties.put("hibernate.format_sql", "true");
//        jpaProperties.put("hibernate.use_sql_comments", "true");
//        entityManagerFactoryBean.setJpaPropertyMap(jpaProperties);
//
//        return entityManagerFactoryBean;
//    }

}