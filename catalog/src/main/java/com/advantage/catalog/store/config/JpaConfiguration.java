package com.advantage.catalog.store.config;

import com.advantage.common.Constants;
import com.advantage.common.Constants;
import com.advantage.common.SystemParameters;
import org.apache.log4j.Logger;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;


@Configuration
@EnableTransactionManagement
public class JpaConfiguration {

    private static final Logger log = Logger.getLogger(JpaConfiguration.class);

    private static final String ENV_HIBERNATE_DIALECT = "hibernate.dialect";
    private static final String ENV_HIBERNATE_SHOW_SQL = "hibernate.show_sql";
    private static final String ENV_HIBERNATE_FORMAT_SQL = "hibernate.format_sql";
    //@Inject
    @Autowired
    private Environment environment;

    //@Inject
    @Autowired
    private DataSource dataSource;

    @DependsOn("liquibase")//get liquibase to apply its updates BEFORE hibernate tries to validate the schema
    //DB<->JPA entities
    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setDataSource(dataSource);
        entityManagerFactory.setPackagesToScan("com.advantage.catalog.store");
        entityManagerFactory.setPersistenceProvider(new HibernatePersistenceProvider());
        entityManagerFactory.setJpaProperties(jpaProperties());
        return entityManagerFactory;
    }

    private Properties jpaProperties() {
        Properties jpaProperties = new Properties();
        jpaProperties.put(Constants.ENV_HIBERNATE_FORMAT_SQL_PARAMNAME, environment.getProperty(Constants.ENV_HIBERNATE_FORMAT_SQL_PARAMNAME));
        jpaProperties.put(Constants.ENV_HIBERNATE_SHOW_SQL_PARAMNAME, environment.getProperty(Constants.ENV_HIBERNATE_SHOW_SQL_PARAMNAME));
        String hbm2ddlMode = SystemParameters.getHibernateHbm2ddlAuto(environment.getProperty("catalog.hibernate.db.hbm2ddlAuto"));
        jpaProperties.put(Constants.ENV_HIBERNATE_HBM2DDL_AUTO_PARAMNAME, hbm2ddlMode);//jpaProperties.put(Constants.ENV_HIBERNATE_HBM2DDL_AUTO, ENV_HIBERNATE_HBM2DDL_AUTO_VALUE);
        log.trace("JPA properties put: " + Constants.ENV_HIBERNATE_HBM2DDL_AUTO_PARAMNAME + "=" + hbm2ddlMode);

        if (log.isDebugEnabled()) {
            log.debug(Constants.ENV_HIBERNATE_DIALECT_PARAMNAME + " @" + environment.getProperty(Constants.ENV_HIBERNATE_DIALECT_PARAMNAME));
        }
        if (environment.getProperty(Constants.ENV_HIBERNATE_DIALECT_PARAMNAME) != null) {
            jpaProperties.put(Constants.ENV_HIBERNATE_DIALECT_PARAMNAME, environment.getProperty(Constants.ENV_HIBERNATE_DIALECT_PARAMNAME));
        }
        return jpaProperties;
    }

    @Bean(name = "transactionManager")
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory().getObject());

        return jpaTransactionManager;
    }
}
