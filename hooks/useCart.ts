import { Product } from "@/services/cartDomain";
import {
    selectCount,
    selectItems,
    selectTotals,
    useCartStore,
} from "@/store/cart";
import { useMemo } from "react";

export function useCart() {
  const dispatch = useCartStore((s) => s.dispatch);
  const items = useCartStore(selectItems);
  const totals = useCartStore(selectTotals);
  const count = useCartStore(selectCount);

  const actions = useMemo(
    () => ({
      add: (p: Product, qty = 1) => dispatch({ type: "ADD", product: p, qty }),
      inc: (p: Product) => dispatch({ type: "INC", product: p }),
      dec: (p: Product) => dispatch({ type: "DEC", product: p }),
      remove: (id: string) => dispatch({ type: "REMOVE", id }),
      applyCoupon: (code: string | null) =>
        dispatch({ type: "APPLY_COUPON", code }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [dispatch]
  );

  return { items, totals, count, ...actions };
}
