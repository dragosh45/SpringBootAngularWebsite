package com.myapps.ecommerce.dao;

import com.myapps.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//json file is productCategory and the API path product-category
@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "productCategory", path ="products-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
