import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { TmplAstTextAttribute } from '@angular/compiler';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit  {

  public payPalConfig?: IPayPalConfig;

  allproducts:any=[]
  cartTotalprice:number=0
  proceedtopaymentbtnclickedstatus:boolean=false
  username:string=""
  flat:string=""
  street:string=""
  state:string=""
  offerclickedstatus:boolean=false
  discountClickStatus:boolean=false
  showSuccess:boolean=false
  showCancel:boolean=false
  showError:boolean=false
  showpaypal:boolean=false
  // address
  addressForm=this.fb.group({
    username:[''],
    flat:[''],
    street:[''],
    state:['']
  })

  constructor(private api:ApiService,private fb:FormBuilder){

  }
  ngOnInit(): void {
    this.api.getcart().subscribe((result:any)=>{
      console.log(result);
      this.allproducts=result
      this.getCartTotal()
       // paypal
    this.initConfig()
    },
    (result:any)=>{
      console.log(result.error);
      
    }
    )
   
  }

  // getcarttotal
  getCartTotal(){
    let total=0
    this.allproducts.forEach((item:any)=>{
      total+=item.grantTotal
      this.cartTotalprice=Math.ceil(total)
    })
  }

  // remove item
  removeItem(id:any){
    this.api.removecartitem(id).subscribe((result:any)=>{
      this.allproducts=result
      this.getCartTotal()
      this.api.cartcount()
    },
    (result:any)=>{
      alert(result.error);
      
    })
  }
  
  emptycart(){
    this.api.emptycart().subscribe((result:any)=>{
      this.allproducts=[]
      this.getCartTotal()
      this.api.cartcount()
    },
    (result:any)=>{
      alert(result.error)
    })
  }
  // increment
  increment(id:any){
    this.api.incCartItem(id).subscribe((result:any)=>{
      this.allproducts=result
      this.getCartTotal()
    },
    (result:any)=>{
      alert(result.error)
    })
  }

  // decrement
  decrement(id:any){
    this.api.decCartItem(id).subscribe((result:any)=>{
      this.allproducts=result
      this.getCartTotal()
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

  // pay to proceed
  submitBtnClicked(){
      // check address form is valid
    if(this.addressForm.valid){
       this.proceedtopaymentbtnclickedstatus=true
       this.username=this.addressForm.value.username ||""
       this.flat=this.addressForm.value.flat ||""
       this.street=this.addressForm.value.street ||""
       this.state=this.addressForm.value.state ||""
    }
    else{
      alert('please enter valid inputs')
    }
  }

  // offer clicked
  offerClicked(){
    this.offerclickedstatus=true
  }

  discount50(){
   let discount= Math.ceil(this.cartTotalprice*50/100)
   this.cartTotalprice-=discount
   this.discountClickStatus=true
   
  }

  discount10(){
    let discount= Math.ceil(this.cartTotalprice*10/100)
    this.cartTotalprice-=discount
    this.discountClickStatus=true
    
   }

  //  makepayment()
  makepayment(){
    this.showpaypal=true
  }



    // payment pay pal
   
   private initConfig(): void {
    let amount = this.cartTotalprice.toString()
    this.payPalConfig = {

    currency: 'USD',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: amount,
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
      // empty cart
      this.emptycart()
      // hide paypal div
      this.showpaypal=false

      // hide proceedtopaymentbtnclickedstatus
      this.proceedtopaymentbtnclickedstatus=false
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.showCancel=true
        // hide paypal div
        this.showpaypal=false

    },
    onError: err => {
      console.log('OnError', err);
      this.showError=true
        // hide paypal div
        this.showpaypal=false

    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  // modal close
  modalClose(){
    this.addressForm.reset()
    this.showCancel=false
    this.showError=false
    this.showSuccess=false
    this.proceedtopaymentbtnclickedstatus=false
    this.showpaypal=false
  }


}
