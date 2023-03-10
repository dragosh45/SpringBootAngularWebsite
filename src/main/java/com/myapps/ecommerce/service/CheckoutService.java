package com.myapps.ecommerce.service;

import com.myapps.ecommerce.dto.Purchase;
import com.myapps.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
