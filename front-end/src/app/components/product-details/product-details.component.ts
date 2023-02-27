import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product!: Product;
  cartItem: CartItem;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    // get the id param string and convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    //use id to call the service and get the product details
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
  addToCart(theProduct: Product) {
    this.cartItem = new CartItem(theProduct);
    this.cartService.addToCart(this.cartItem);
  }
}
