const productsReducer = (products, action) => {
  switch (action.type) {
    case 'productsLoaded': {
      return action.payload;
    }
    case 'updateProduct': {
      return products.map((product) => {
        if (product._id === action.payload._id) {
          return action.payload;
        } else {
          return product;
        }
      })
    }
    case 'addProduct': {
      return products.concat(action.payload);
    }
    case 'deleteProduct': {
      return products.filter((product) => product._id !== action.payload);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default productsReducer;
