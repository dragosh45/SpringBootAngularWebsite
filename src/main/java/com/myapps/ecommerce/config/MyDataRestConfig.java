package com.myapps.ecommerce.config;

import com.myapps.ecommerce.entity.Product;
import com.myapps.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
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

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private EntityManager entityManger;
    //injecting entity manager
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManger = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        //RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[]  theUnsupportedActions = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PUT};
        //disable above methods
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions));
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods)->httpMethods.disable(theUnsupportedActions));
        //call internal helper method
        exposeIds( config);
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
