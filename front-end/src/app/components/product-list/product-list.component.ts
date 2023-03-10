import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  //templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode :boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
    })
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theSearchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if(this.previousKeyword != theSearchKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theSearchKeyword;

    //search for products given the keyword
    
    /*
    this.productService.searchProducts(theSearchKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
    */
   
    //search products given the keyword including pagination
    this.productService.searchProductPaginate(this.thePageNumber - 1, this.thePageSize,theSearchKeyword).subscribe(this.processResult());
  }

  handleListProducts(){
        //check if 'id' parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        if(hasCategoryId) {
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        }
        else {
          // no cat available - default -> 1
          this.currentCategoryId = 1;
        }
        
        //check if we have a different category id than previous
        //then set thePageNumber back to 1
        if(this.previousCategoryId != this.currentCategoryId) {
          this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId= ${this.currentCategoryId},thePageNumber=${this.thePageNumber}`);


        // get the products for the given categ id, and pagination
        this.productService.getProductListPaginate(this.thePageNumber-1,
                                                   this.thePageSize,
                                                   this.currentCategoryId)
        .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize; // + is converting string to number
    this.thePageNumber = 1; // resseting the page to 1 after
    this.listProducts(); // refresh the page view with selected number of products per page
  }
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  addToCart(theProduct: Product) {
    //creates cart item based on product
    const theCartItem = new CartItem(theProduct);
    //use add to cart method from the service
    this.cartService.addToCart(theCartItem);
  }
}
