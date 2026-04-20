const cartItemsReducer = (cartItems, action) => {
  switch (action.type) {
    case 'cartItemsLoaded': {
      return action.payload;
    }
    case 'updateCartItem': {
      return cartItems.map((cartItem) => {
        if (cartItem.productId === action.payload.productId) {
          return action.payload;
        } else {
          return cartItem;
        }
      });
    }
    case 'addCartItem': {
      return cartItems.concat(action.payload);
    }
    case 'cartItemsCheckedOut': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default cartItemsReducer;
