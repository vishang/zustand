import { CartCommand, CartState, initialCartState, reduceCart } from "@/services/cartDomain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type CartActions = {
    dispatch: (cmd: CartCommand ) => void;
}

export const useCartStore = create<CartState & CartActions>()(

    devtools(
        persist(
            (set, get) => ({
                ...initialCartState,

                dispatch: (cmd: CartCommand) => {
                    const next = reduceCart(get(), cmd);
                    set(next); 
                }
            }),
            {
                name: 'cart-v2',
                storage: createJSONStorage(() => AsyncStorage),
                partialize: (s) => ({ items: s.items, coupon: s.coupon }),
                onRehydrateStorage: () => (state) => {
                    console.log("Storage rehydrated:", state);
                  },
                version: 1
            }
        )
    )
);

export const selectItems = (s: CartState) => s.items;
export const selectTotals = (s: CartState) => s.totals;
export const selectCount = (s: CartState) => s.items.reduce((n, it) => n + it.qty, 0);