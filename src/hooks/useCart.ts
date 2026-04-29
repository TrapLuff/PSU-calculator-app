import { useEffect, useState } from "react";

export const useCart = () => {
    const [cart, setCart] = useState<any>(null);

    useEffect(() => {
        fetch("/api/powers/cart")
            .then(res => res.ok ? res.json() : null)
            .then(setCart)
            .catch(() => setCart(null));
    }, []);

    return cart;
};