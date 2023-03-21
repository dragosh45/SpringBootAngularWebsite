package com.myapps.ecommerce.dao;

import com.myapps.ecommerce.entity.Customer;
import com.myapps.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Customer findByEmail(@Param("email") String email);
}
