import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
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
              private cartService: CartService ) {}

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
