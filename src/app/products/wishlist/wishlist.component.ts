import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{

  allProducts:any=[]
  constructor(private api:ApiService){

  }
  ngOnInit(): void {
    this.api.getwishlist().subscribe((result:any)=>{
     console.log(result);
     this.allProducts=result
    },
    (result:any)=>{
      console.log(result.error);
      
    }
    )
  }
  // removeItem
  removeItem(id:any){
    this.api.removeWishlistitem(id).subscribe((result:any)=>{
      this.allProducts=result
    },
    (result:any)=>{
      alert(result.error);
      
    })
  }
  addtocart(product:any){

    // add (quantity:1) to product object
    Object.assign(product,{quantity:1})
    console.log(product);
    
    // api call
    this.api.addtocart(product).subscribe(
      // 200
      (result:any)=>{
        // call cart count
        this.api.cartcount()
        this.removeItem(product.id)
        alert(result)
      },
      // 400
      (result:any)=>{
        alert(result.error)
      }
  
    )
  
  }

}
