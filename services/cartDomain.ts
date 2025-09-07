
export type Product = { 
id: string;
name: string;
price: number;
stock: number;
}

export type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number
}

export type Totals = {
    subTotal: number;
    discount: number;
    tax: number;
    total: number
}

export type CartState = {
    items: CartItem[];
    coupon: string | null;
    totals: Totals;
}

export const initialCartState: CartState = {
    items: [],
    coupon: null,
    totals: {
        subTotal: 0,
        discount: 0,
        tax: 0,
        total: 0
    }
};

function clampQty(qty: number, stock: number) {
    return Math.max(0, Math.min(qty, stock));
}

export function computeTotals(items: CartItem[], coupon?: string | null): Totals {

    const subTotal = items.reduce((s, it) => s + it?.price * it?.qty, 0);
    const discount = coupon === "SAVE10" ? Math.round(subTotal * 0.10) : 0;
    const taxable = Math.max(0, subTotal - discount);
    const tax = Math.round(taxable * 0.18);
    const total = taxable + tax;

    return { subTotal, discount, tax, total }
}

function upsert(items: CartItem[], p: Product, deltaQty: number): CartItem[] {

    const i = items.findIndex(it => it.id === p.id);
    if (i === -1) {
        const qty = clampQty(deltaQty, p.stock);
        return qty <= 0 ? items: [...items, { id: p.id, name: p.name, price: p.price, qty }]
    }

    const next = [...items];
    const cur = next[i];
    const qty = clampQty(cur.qty + deltaQty, p.stock);
    if (qty <= 0) {
        next.splice(i, 1)
        return next;
    }

    next[i] = {...cur, qty};
    return next;

}

export type CartCommand =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "INC"; product: Product }
  | { type: "DEC"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "APPLY_COUPON"; code: string | null }
  | { type: "CLEAR" };

  export function reduceCart(prev: CartState, cmd: CartCommand): CartState {
    console.log("Cart command:", cmd.type);
    switch(cmd.type) {
        case "ADD": {
            const items = upsert(prev.items, cmd.product, cmd.qty ?? 1);
            return {...prev, items, totals: computeTotals(items, prev.coupon)}
        }
        case "INC": {
            const items = upsert(prev.items, cmd.product, +1);
            return { ...prev, items, totals: computeTotals(items, prev.coupon )}
        }
        case "DEC": {
            const items = upsert(prev.items, cmd.product, -1);
            return { ...prev, items, totals: computeTotals(items, prev.coupon) };
          }
          case "REMOVE": {
            const items = prev.items.filter(i => i.id !== cmd.id);
            return { ...prev, items, totals: computeTotals(items, prev.coupon) };
          }
          case "APPLY_COUPON": {
            const coupon = cmd.code && ["SAVE10"].includes(cmd.code) ? cmd.code : null;
            return { ...prev, coupon, totals: computeTotals(prev.items, coupon) };
          }
          case "CLEAR":
            return { ...initialCartState };

        default:
            return prev;
    }
  }