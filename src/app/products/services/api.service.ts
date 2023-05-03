import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // to build search term behaviour subject
  searchTerm=new BehaviorSubject('')
  cartitemsCount=new BehaviorSubject(0)

  BASE_URL= 'https://ecart-ghss.onrender.com'

  constructor(private http:HttpClient) { 
    this.cartcount()
  }

  // get all products
  getallproducts(){
    // api
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  // viewproduct
  viewproduct(id:any){
     // api
     return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)

  }

  // wishlist/add-product
  addtowishlist(id:any,title:any,price:any,image:any){
    const body={
      id,title,price,image
    }
    // api
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`,body)

  }

  getwishlist(){
    // api
    return this.http.get(`${this.BASE_URL}/wishlist/get-items`)

  }
  // remove wishlist item
removeWishlistitem(id:any){
  return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`)

}

// add to cart api
 addtocart(product:any){
  // get id,title,price,image,quantity from product
  const body={
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }
   // api
   return this.http.post(`${this.BASE_URL}/cart/add-product`,body)
 }
 getcart(){
   // api
   return this.http.get(`${this.BASE_URL}/cart/all-products`)

 }

//  cartcount 
cartcount(){
  this.getcart().subscribe((result:any)=>{
    this.cartitemsCount.next(result.length)
  })
}
// remove cart item
removecartitem(id:any){
  return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)

}
// empty cart
emptycart(){
  return this.http.delete(`${this.BASE_URL}/cart/remove-all-items`)

}
// increment
incCartItem(id:any){
  return this.http.get(`${this.BASE_URL}/cart/increment-quantity/${id}`)

}
// decrement
decCartItem(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decrement-quantity/${id}`)

}
}

