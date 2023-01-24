package com.myapps.ecommerce.config;

import com.myapps.ecommerce.entity.Product;
import com.myapps.ecommerce.entity.ProductCategory;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

public class MyDataRestConfig implements RepositoryRestConfigurer {

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
    }
}
