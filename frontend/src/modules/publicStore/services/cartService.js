const CART_KEY = 'regalalocal_cart'

const emitCartUpdate = () => {
  window.dispatchEvent(new Event('cart-updated'))
}

const ensureTotals = (cart) => ({
  items: cart.items || [],
  subtotal: cart.subtotal || 0,
  total: cart.total || 0,
})

const cartService = {
  getCart: () => {
    const cart = localStorage.getItem(CART_KEY)
    if (!cart) {
      return { items: [], subtotal: 0, total: 0 }
    }

    try {
      return ensureTotals(JSON.parse(cart))
    } catch {
      return { items: [], subtotal: 0, total: 0 }
    }
  },

  addItem: (product) => {
    const cart = cartService.getCart()
    const existingItem = cart.items.find(
      (item) => item.type === 'product' && item.id === product.id
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({
        type: 'product',
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.image,
        slug: product.slug,
      })
    }

    cartService.saveCart(cart)
    return cartService.getCart()
  },

  addBundle: (bundle) => {
    const cart = cartService.getCart()
    const existingItem = cart.items.find(
      (item) => item.type === 'bundle' && item.id === bundle.id
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({
        type: 'bundle',
        id: bundle.id,
        name: bundle.name,
        price: Number(bundle.price),
        quantity: 1,
        image: bundle.image,
        slug: bundle.slug,
      })
    }

    cartService.saveCart(cart)
    return cartService.getCart()
  },

  removeItem: (index) => {
    const cart = cartService.getCart()
    cart.items.splice(index, 1)
    cartService.saveCart(cart)
    return cartService.getCart()
  },

  updateQuantity: (index, quantity) => {
    const cart = cartService.getCart()
    if (quantity > 0) {
      cart.items[index].quantity = quantity
    } else {
      cart.items.splice(index, 1)
    }
    cartService.saveCart(cart)
    return cartService.getCart()
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY)
    emitCartUpdate()
    return { items: [], subtotal: 0, total: 0 }
  },

  calculateTotals: (cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    return {
      ...cart,
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(subtotal.toFixed(2)),
    }
  },

  saveCart: (cart) => {
    const totals = cartService.calculateTotals(cart)
    localStorage.setItem(CART_KEY, JSON.stringify(totals))
    emitCartUpdate()
  },

  getItemCount: () => {
    const cart = cartService.getCart()
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  getCartForOrder: () => {
    const cart = cartService.getCart()
    return cart.items.map((item) => ({
      [item.type === 'product' ? 'product_id' : 'bundle_id']: item.id,
      quantity: item.quantity,
    }))
  },
}

export default cartService
