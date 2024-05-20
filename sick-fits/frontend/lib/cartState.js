import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
    // This is our own custom provider! We will store data (state) and functionality (updaters) in here and anyone can access it via the consumer!

    const [ cartOpen, setCartOpen] = useState(true)

    function toggleCart() {
        setCartOpen(!cartOpen)
    }

    function closeCart() {
        setCartOpen(false)
    }

    return <LocalStateProvider value={{ cartOpen, toggleCart, closeCart }}>{children}</LocalStateProvider>
}

function useCart() {
    const all = useContext(LocalStateContext)
    return all
}

export { CartStateProvider, useCart }