import React, { createContext, useContext, useReducer, useEffect } from 'react';


const CartContext = createContext();


const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;

    case 'ADD_TO_CART': {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      let updatedItems;
      if (existingItem) {

        updatedItems = state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {

        updatedItems = [...state.items, { ...product, quantity: 1 }];
      }
      
      return { ...state, items: updatedItems };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0); // Remove se a quantidade for 0

      return { ...state, items: updatedItems };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const updatedItems = state.items.filter(item => item.id !== productId);
      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      throw new Error(`Ação desconhecida: ${action.type}`);
  }
}


export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('nutrition_cart');
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (e) {
        console.error("Falha ao carregar o carrinho do localStorage", e);
        localStorage.removeItem('nutrition_cart');
      }
    }
  }, []);


  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem('nutrition_cart', JSON.stringify(state));
    }
  }, [state]);


  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };


  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.preco * item.quantity), 0);

  const value = {
    cartState: state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}