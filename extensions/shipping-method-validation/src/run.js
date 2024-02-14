// @ts-check

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Operation} Operation
*/

// The configured entrypoint for the 'purchase.delivery-customization.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  // The message to be added to the delivery option
  const message = "May be delayed due to weather conditions";
  var CITIES_AND_ZONES = [
    {
      cities_code: ["Lahore", "Karachi","Islamabad"],
      zones: ["Express Delivery 3-5 Hours Delivery Timing","Standard"]
    }
  ]
  var city = input.cart.deliveryGroups[0].deliveryAddress?.city;
  var ZonesArray = new Array;
  var target = new Array;
  let toRename = input.cart.deliveryGroups
    .filter(group => group.deliveryAddress?.city)
    .flatMap(group => group.deliveryOptions)
    .map(option => {
      var methodTitle =  option.title;
      const Zones = CITIES_AND_ZONES.map(function(zone){
        // @ts-ignore
        if(zone.cities_code.includes(city)){
          console.log(zone.zones);
          ZonesArray.push(zone.zones);
          // @ts-ignore
          if(!zone.zones.includes(methodTitle)){
            var updateMethod = {
              hide: {
                deliveryOptionHandle: option.handle
              }
            }
            target.push(updateMethod);
          }
        }
      });

    })
  return {
    operations: target
  };
};