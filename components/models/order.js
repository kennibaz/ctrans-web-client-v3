export class Order {
    constructor(
        id,
        carrierId,
        shipperOrderId,
        orderInstructions
         ) {
      this.id = id;
      this.carrierId = carrierId;
      this.shipperOrderId = shipperOrderId;
    }
  }