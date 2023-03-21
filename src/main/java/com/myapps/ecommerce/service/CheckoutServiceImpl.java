package com.myapps.ecommerce.service;

import com.myapps.ecommerce.dao.CustomerRepository;
import com.myapps.ecommerce.dto.Purchase;
import com.myapps.ecommerce.dto.PurchaseResponse;
import com.myapps.ecommerce.entity.Customer;
import com.myapps.ecommerce.entity.Order;
import com.myapps.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the order info from dto
        Order order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
;       //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        //populate customer with order
        Customer customer = purchase.getCustomer();
        Customer customerAlreadyInDb = customerRepository.findByEmail(customer.getEmail());
        if(customerAlreadyInDb!=null) {
            //customer already exists
            customer = customerAlreadyInDb;
        }
        customer.add(order);
        //save to the database
        customerRepository.save(customer);
        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        //generate a random UUID number (UUID version-4)
        //uuid = hard to guess- >  random and unique : Universally Unique IIdentifier
        return UUID.randomUUID().toString();
    }
}
