import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //storage : Storage = sessionStorage;
  storage : Storage = localStorage;

  constructor() { 
    //parse reads the json string and converts it to object
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if(data!=null) {
      this.cartItems=data;
      //compute totals based on the the data that is read from storage
      this.computeCartTotals();
    }
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  addToCart(theCartItem: CartItem) {
    //check if item is already on cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined; 
    
    if(this.cartItems.length > 0){
      
      //refactored with find method
      /*
      //find the item in the cart based on the item id
      for(let temCartItem of this.cartItems) {
        if(temCartItem.id === theCartItem.id){
          existingCartItem = temCartItem;
          break;
        }
      }
      */ 
      //find the item in the cart based on the item id
      existingCartItem=this.cartItems.find(tempCartItem => tempCartItem.id==theCartItem.id);
    }
    //check it we found it
    alreadyExistsInCart = (existingCartItem != undefined);

    if(alreadyExistsInCart) {
      //increm quant
      existingCartItem.quantity++;
    }
    else {
      // add item to array
      this.cartItems.push(theCartItem);
    }
    //compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for(let currentCarItem of this.cartItems) {
      totalPriceValue += currentCarItem.quantity*currentCarItem.unitPrice;
      totalQuantityValue += currentCarItem.quantity;
    }
    //publish the new value .. all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue); 
    //persist cart data
    this.persistCartItems();
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);
    //if found, remove the item from the carray at the given index
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
