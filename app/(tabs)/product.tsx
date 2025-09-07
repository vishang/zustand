// app/(tabs)/product.tsx
import { useCart } from "@/hooks/useCart";
import React from "react";
import { Pressable, Text, View } from "react-native";

const demo = { id: "p1", name: "Demo Product", price: 999, stock: 10 };

export default function ProductScreen() {
  const { items, add, inc, dec } = useCart();
  const product = demo;
  const qty = items.find((it) => it.id === product.id)?.qty ?? 0;

  console.log("ProductScreen rendered - qty:", qty);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{product.name}</Text>
      <Text>Price: ₹{product.price}</Text>
      <Text>Stock: {product.stock}</Text>
      <Text>In Cart: {qty}</Text>

      <Pressable
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() => add(product)}
      >
        <Text style={{ color: "white" }}>Add to Cart</Text>
      </Pressable>

      <View style={{ flexDirection: "row", gap: 20 }}>
        <Pressable
          onPress={() => inc(product)}
          style={{ padding: 15, backgroundColor: "lightblue", borderRadius: 8 }}
        >
          <Text>+</Text>
        </Pressable>
        <Pressable
          onPress={() => dec(product)}
          style={{ padding: 15, backgroundColor: "lightblue", borderRadius: 8 }}
        >
          <Text>-</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => console.log("Current cart items:", items)}
        style={{ padding: 10, backgroundColor: "yellow" }}
      >
        <Text>Debug: Log Cart</Text>
      </Pressable>
    </View>
  );
}
