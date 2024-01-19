const OrderStatusEnum = Object.freeze({
  New: 0,
  Check: 1,
  Payment: 2,
  Picking: 7,
  ReadyToShip: 3,
  Shipped: 4,
  Received: 5,
  Canceled: 6,
});

export default OrderStatusEnum;
