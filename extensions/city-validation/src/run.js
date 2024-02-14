// @ts-check

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
*/

// The configured entrypoint for the 'purchase.validation.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  var deliveryGroups = input.cart.deliveryGroups;
  var group = JSON.stringify(deliveryGroups);
  // @ts-ignore
  
  var input_city = input.cart.deliveryGroups[0].deliveryAddress.city;
  var city_array = [
    "Lahore",
    "Alipur",
  ]; 
  // The error
  const cityError = {
    localizedMessage: "Please enter correct city",
    target: "city"
  };
  const errors = [];

  // Orders with subtotals greater than $1,000 are available only to established customers.
  if (input_city !== null && input_city !== undefined && typeof input_city === 'string') {
    const isCityInArray = city_array.includes(input_city);
    if(!isCityInArray){
      errors.push(cityError);
    }
  } else {
    errors.push(cityError);
  }
  return { errors };
};

