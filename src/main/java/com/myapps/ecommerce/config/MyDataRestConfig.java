package com.myapps.ecommerce.config;

import com.myapps.ecommerce.entity.Country;
import com.myapps.ecommerce.entity.Product;
import com.myapps.ecommerce.entity.ProductCategory;
import com.myapps.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


//configuration for the rest repositories
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    //get value from application.properties
    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    private EntityManager entityManger;
    //injecting entity manager
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManger = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        //RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[]  theUnsupportedActions = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH};
        //disable above methods
        disableHttpMethods(Country.class,config, theUnsupportedActions);
        disableHttpMethods(State.class,config, theUnsupportedActions);
        disableHttpMethods(Product.class,config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
        //call internal helper method
        exposeIds( config);
        //config cors mapping and will remove @CrossOrigin("http://localhost:4200") from repositories
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity ids

        // get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManger.getMetamodel().getEntities();

        //create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types for the entities

        for(EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        //expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
