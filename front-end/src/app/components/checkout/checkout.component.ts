import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopformService } from 'src/app/services/shopform.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[]=[];
  creditCardMonths: number[]=[];

  countries: Country[]=[];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopformService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state: [''],
        country: [''],
        zipCode:['']
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state: [''],
        country: [''],
        zipCode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth:[''],
        expirationYear:['']
      })
    });
    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    //populate credit card years

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries

    this.shopFormService.getCountries().subscribe(
      data =>  {
        this.countries = data;
      }
    )
    this.reviewCartDetails();
  }
  reviewCartDetails() {
    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(totalPrice=>this.totalPrice=totalPrice);
    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(totalQuantity=>this.totalQuantity=totalQuantity);
  }
  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = []
    }
  }
  onSubmit() {
    console.log("handling the sub button");
    console.log(this.checkoutFormGroup.get('customer').value)
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    //create orderItems from cartItems
    let orderItems : OrderItem[] = [];
    for(let i=0; i< cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    //short :
    //let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    
    //setup purchase
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    //parse converts into an object 
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = shippingState.name;
    purchase.billingAddress.country = shippingCountry.name;
    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    //call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`)
          //reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to the product page
    this.router.navigateByUrl("/products");
  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    const currentYear: number = new Date().getFullYear();

    let startMonth: number;
    console.log(selectedYear + "   " + currentYear);
    if(currentYear==selectedYear) {
      startMonth = new Date().getMonth() +1;
    }else {
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress') {
          this.shippingAddressStates=data;
        }
        else {
          this.billingAddressStates=data;
        }
        //subscribe with first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
    
  }
}
