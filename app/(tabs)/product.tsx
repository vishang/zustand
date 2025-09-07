// app/(tabs)/product.tsx
import { useCart } from "@/hooks/useCart";
import React from "react";
import { Pressable, Text, View } from "react-native";
// If you need real data, fetch from store/API or via params.
// For now, a demo product:
const demo = { id: "p1", name: "Demo Product", price: 999, stock: 10 };

export default function ProductScreen() {
  const { add, inc, dec } = useCart();
  const product = demo;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{product.name}</Text>
      <Text>₹{product.price}</Text>

      <Pressable onPress={() => add(product)}>
        <Text>Add</Text>
      </Pressable>
      <Pressable onPress={() => inc(product)}>
        <Text>+</Text>
      </Pressable>
      <Pressable onPress={() => dec(product)}>
        <Text>-</Text>
      </Pressable>
    </View>
  );
}
