// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  var bundle_array = [];
  var bundle_product_array = [];
  var bundle_product_final_array = [];
  var bundle_product = false;
  var bundle_product_count = 0;
  var bundle2_array = [];
  var bundle2_final_array = [];
  var normal_product_array = [];
  var normal_product_count = 0;
  var normal_product = false;
  var products_14mg_array = [];
  var new_14_product_array = [];
  var product_14mg_final_array = [];
  var product_14 = false;
  var products_14mg_count = 0
  var bundle2_discount = 20;
  var discount_amt = 0;
  var newtargets = [];
  var leep_array = [];
  var leep_product = false;
  var leep_product_count = 0;
  var quantity = 0;
  var new_normal_product_array = [];
  var normal_product_final_array = [];
  var Tier1Start = 3;
  var Tier1End = 4;
  var Tier2Start = 5
  var Tier2End = 9
  var total_items = 0;
  var tier_1_discount = 5;
  var normal_discount_amt = 0;
  var tier_2_discount = 8;
  var Tier3Start = 10;
  var NanoCanTier3Discount = 10;
  var Tier3Discount = 12;
  var BundleDiscountNanoCan = 10;
  var BundleDiscount = 12;
  var product14_total_items = 0;
  const targets = input.cart.lines
    .filter(line => line.merchandise?.__typename === "ProductVariant")
    .map(line => {
      const productVariant = line.merchandise;
      var amount = line.cost.totalAmount.amount;
      if (productVariant && productVariant.__typename === "ProductVariant" && productVariant.id ) {
        const product = productVariant.product;
        quantity = line.quantity;
        var bundle = product.hasTags.some(tagObject => tagObject.tag === "bundle" && tagObject.hasTag);
        var bundle2 = product.hasTags.some(tagObject => tagObject.tag === "bundle2" && tagObject.hasTag);
        var multibuy = product.hasTags.some(tagObject => tagObject.tag === "multibuy" && tagObject.hasTag); 
        var leep = product.hasTags.some(tagObject => tagObject.tag === "leep" || tagObject.tag === "LEPP" && tagObject.hasTag);
        var variant_title = productVariant.title;
        var nano_can = product.hasTags.some(tagObject => tagObject.tag === "nano-can" && tagObject.hasTag);
        //bundle products
        if (bundle) {
          if(quantity % 10 == 0){
            var inner_bundle_array = {
              id: product.id,
              tag: nano_can,
              quantity: quantity,
              "productVariant": {
                id: productVariant.id,
              }
            }
            bundle_product = true;
            bundle_product_count = bundle_product_count + quantity;
            bundle_array.push(inner_bundle_array);
          }
        }
        //bundle2 products
        if (bundle2) {
          var inner_bundle2_array = {
            id: product.id,
            quantity: quantity,
            amount: amount,
            "productVariant": {
              id: productVariant.id,
            }
          }
          bundle2_array.push(inner_bundle2_array);
        }
        //multibuy products 14 mg
        if (multibuy && variant_title == "14") {
          var inner_multibuy_14_array = {
            id: product.id,
            quantity: quantity,
            tag: nano_can,
            "productVariant": {
              id: productVariant.id,
            }
          }
          products_14mg_array.push(inner_multibuy_14_array);
          product_14 = true;
          products_14mg_count = products_14mg_count + quantity;
        }
        // leep and LEPP products
        if (leep) {
          var inner_leep_array = {
            id: product.id,
          }
          leep_array.push(inner_leep_array);
          leep_product = true
          leep_product_count = leep_product_count + quantity;
        }
        //multibuy products 6 mg
        if (multibuy && variant_title == "6" || variant_title == "10") {
          var inner_multibuy_6_array = {
            id: product.id,
            quantity: quantity,
            tag: nano_can,
            "productVariant": {
              id: productVariant.id,
            }
          }
          normal_product_array.push(inner_multibuy_6_array);
          normal_product = true;
          normal_product_count = normal_product_count + quantity;
          
        }
      }
      return null;
    })
    .filter(Boolean);  
    //normal product logic start
    if(!product_14 && !leep_product && !bundle_product && normal_product){
      if(normal_product_array && normal_product_array.length > 0){
        normal_product_array.forEach(n_product => {
          if(normal_product_count > 2){
            new_normal_product_array.push(n_product);
          }
        });
        new_normal_product_array.forEach(value => {
          total_items = total_items + value.quantity;
       });
      }
    }
    // tier1 logic
    if(Tier1Start <= total_items && total_items <= Tier1End){
      new_normal_product_array.forEach(element => {
        normal_product_final_array.push(element);  
        newtargets.push({productVariant: { ...element.productVariant }})
      });  
      normal_product_final_array.forEach(final_array => {  
        normal_discount_amt = tier_1_discount * final_array.quantity;
        discount_amt += normal_discount_amt;
      });
       
    }
    //tier2 logic
    if(Tier2Start <= total_items && total_items <= Tier2End){
      new_normal_product_array.forEach(element => {
        normal_product_final_array.push(element);  
        newtargets.push({productVariant: { ...element.productVariant }})
      });  
      normal_product_final_array.forEach(final_array => {  
        normal_discount_amt = tier_2_discount * final_array.quantity;
        discount_amt += normal_discount_amt;
      });       
    }
    
    //tier3 logic
    if(Tier3Start == total_items){
      new_normal_product_array.forEach(normal_array => {
        normal_product_final_array.push(normal_array);  
        newtargets.push({productVariant: { ...normal_array.productVariant }})
      });     
      normal_product_final_array.forEach(element => {
       if(element.tag){
        normal_discount_amt = NanoCanTier3Discount * element.quantity;
       }else{
        normal_discount_amt = Tier3Discount * element.quantity;
       }
       discount_amt += normal_discount_amt;
      });
    }
    //normal product logic end

    //14mg product logic start  
    if(product_14 && !leep_product && !normal_product && !bundle_product){
      if(products_14mg_array.length > 0 && products_14mg_count > 2){
        products_14mg_array.forEach(product_14 => {
          new_14_product_array.push(product_14);
        });
        new_14_product_array.forEach(value => {
          product14_total_items = product14_total_items + value.quantity;
       });
      }
    }
    //14 tier1 logic
    if(Tier1Start <= product14_total_items && product14_total_items <= Tier1End){
      new_14_product_array.forEach(element => {
        product_14mg_final_array.push(element);
        newtargets.push({productVariant: { ...element.productVariant }})
      });
      product_14mg_final_array.forEach(element => {
        normal_discount_amt = tier_1_discount * element.quantity;
      });
      discount_amt += normal_discount_amt;
    }
    // 14 tier2 logic
    if(Tier2Start <= product14_total_items && product14_total_items <= Tier2End){
      new_14_product_array.forEach(element => {
        product_14mg_final_array.push(element);
        newtargets.push({productVariant: { ...element.productVariant }})
      });
      product_14mg_final_array.forEach(element => {
        normal_discount_amt = tier_2_discount * element.quantity;
      });
      discount_amt += normal_discount_amt;
    }
    //14 tier3 logic 
    if(Tier3Start <= product14_total_items){
      new_14_product_array.forEach(element => {
        product_14mg_final_array.push(element);
        newtargets.push({productVariant: { ...element.productVariant }})
      });
      product_14mg_final_array.forEach(element => {
        normal_discount_amt = Tier3Discount * element.quantity;
      });
      discount_amt += normal_discount_amt;
    }   
    //14 mg product logic end

    //bundle logic started
    if(bundle_array.length > 0){
      bundle_array.forEach(bundle => {
        if(bundle.quantity > 2){
          var moreProducts = bundle.quantity%2;
          if(moreProducts == 0){
            bundle_product_array.push(bundle);
          }
        }else{
          bundle_product_array.push(bundle);
        }
      });
      bundle_product_array.forEach(element => {
        bundle_product_final_array.push(element);  
        newtargets.push({productVariant: { ...element.productVariant }})
      });
      bundle_product_final_array.forEach(bundle_p_array => {
        if(normal_product){
          if(bundle_p_array.tag){
            normal_discount_amt = BundleDiscountNanoCan * bundle_p_array.quantity;
          }else{
            normal_discount_amt = BundleDiscount * bundle_p_array.quantity;
          }  
        }else if(product_14){
          if(bundle_p_array.tag){
            normal_discount_amt = BundleDiscountNanoCan * bundle_p_array.quantity;
          }else{
            normal_discount_amt = BundleDiscount * bundle_p_array.quantity;
          }
        }else{
          if(bundle_p_array.tag){
            normal_discount_amt = BundleDiscountNanoCan * bundle_p_array.quantity;
          }else{
            normal_discount_amt = BundleDiscount * bundle_p_array.quantity;
          }
        }
        discount_amt += normal_discount_amt;
      });
      
    }
    //bundle logic end

    // bundle2 logic started
    bundle2_array.forEach(bundle2 => {
      if (bundle2.quantity%2 == 0) {
        bundle2_final_array.push(bundle2);  
        newtargets.push({productVariant: { ...bundle2.productVariant }})
      }else{
       // If the quantity is odd, split the bundle into two parts
        const splitQuantity1 = Math.floor(bundle2.quantity / 2);
        const splitQuantity2 = bundle2.quantity - splitQuantity1;
        // Add the first split to the final array
        bundle2_final_array.push({
          ...bundle2,
          quantity: splitQuantity1,
        });
        newtargets.push({ productVariant: { ...bundle2.productVariant, quantity: splitQuantity1 } });

        // Add the second split to the final array without applying discount
        bundle2_final_array.push({
          ...bundle2,
          quantity: splitQuantity2,
        });
        const newElementt = {
          productVariant: {
            id: bundle2.productVariant.id,
            quantity: splitQuantity2,
          },
        };
        newtargets.push(newElementt);
      }
    });
    bundle2_final_array.forEach(bundle2_final => {
      discount_amt = bundle2_discount * bundle2_final.quantity;
    });
    //bundle2 logic end

    const DISCOUNTED_ITEMS = {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets: newtargets,
          value: {
            fixedAmount: {
              amount: discount_amt.toFixed(2),  // for amount always use decimal value
            },
          },
        },
      ],
    };
    // @ts-ignore
    return DISCOUNTED_ITEMS;
};