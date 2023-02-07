const OrderStatusEnum = Object.freeze({
  New: 0,
  Check: 1,
  Payment: 2,
  Prepare: 3,
  Sent: 4,
  Received: 5,
  Canceled: 6,
});

export default OrderStatusEnum;
