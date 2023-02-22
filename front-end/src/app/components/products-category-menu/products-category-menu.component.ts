import { Component } from '@angular/core';
import { ProductCategory } from 'src/app/common/products-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-category-menu',
  templateUrl: './products-category-menu.component.html',
  styleUrls: ['./products-category-menu.component.css']
})
export class ProductCategoryMenuComponent {
  //use model ProductCategory
  productCategories: ProductCategory[] = [];
  //inject service
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product categories=' + JSON.stringify(data)); //logs will be viewd in the console web 
        this.productCategories = data;
      }
    )
  }
}
