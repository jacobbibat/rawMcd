"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import BottomNav from "../../components/BottomNav";
import { ThemeProvider } from "@mui/material/styles";
import { mcdTheme } from "@/theme/mcdonaldsTheme";

export default function ViewCartPage() {
    const [cart, setCart] = useState(null);
    const [message, setMessage] = useState("");

    const [promoInput, setPromoInput] = useState("");
    const [total, setTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        loadCart();
    }, []);

    // -----------------------------------------
    // LOAD CART
    // -----------------------------------------
    async function loadCart() {
        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        let data;
        try {
            data = await res.json();
        } catch {
            setMessage("Error loading cart.");
            return;
        }

        if (!data.success || !data.cart?.items?.length) {
            setCart(null);
            setMessage("Your cart is empty.");
            return;
        }

        setCart(data.cart);
        setTotal(data.total);
        setDiscountAmount(data.discountAmount);
        setFinalTotal(data.finalTotal);
        setPromotion(data.promotion);
    }

    // -----------------------------------------
    // REMOVE ITEM
    // -----------------------------------------
    async function removeItem(productId) {
        const res = await fetch("/api/removeFromCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
        });

        const data = await res.json();
        alert(data.message);
        loadCart();
    }

    // -----------------------------------------
    // UPDATE QUANTITY
    // -----------------------------------------
    async function updateQty(productId, newQty) {
        if (newQty < 1) return;

        await fetch("/api/updateCartItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, qty: newQty })
        });

        loadCart();
    }

    // -----------------------------------------
    // APPLY PROMO
    // -----------------------------------------
    async function applyPromo() {
        const res = await fetch("/api/applyPromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promoCode: promoInput })
        });

        const data = await res.json();
        alert(data.message);
        loadCart();
    }

    // -----------------------------------------
    // REMOVE PROMO
    // -----------------------------------------
    async function removePromo() {
        const res = await fetch("/api/removePromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        alert(data.message);
        loadCart();
    }

    // -----------------------------------------
    // EMPTY OR LOADING
    // -----------------------------------------
    if (!cart) {
        return (
            <ThemeProvider theme={mcdTheme}>
                <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                    <h1>Your Cart</h1>
                    <p>{message}</p>
                </Container>
                <BottomNav />
            </ThemeProvider>
        );
    }

    // -----------------------------------------
    // MAIN RENDER
    // -----------------------------------------
    return (
        <ThemeProvider theme={mcdTheme}>
            <Container
                maxWidth="xs"
                style={{ padding: 0, marginBottom: "90px" }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        backgroundColor: "#FFE55C",
                        padding: "28px 20px 30px 20px",
                        borderBottomLeftRadius: "30px",
                        borderBottomRightRadius: "30px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        marginBottom: "25px",
                    }}
                >
                    <h2 style={{ margin: 0 }}>Your Cart 🛒</h2>
                    <p style={{ marginTop: "5px", opacity: 0.8 }}>
                        Review and edit your items
                    </p>
                </Box>

                {/* CART ITEMS */}
                <Box sx={{ padding: "0 15px" }}>
                    {cart.items.map((item, i) => (
                        <Box
                            key={i}
                            sx={{
                                background: "#fff",
                                padding: "15px",
                                borderRadius: "18px",
                                marginBottom: "15px",
                                boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                                display: "flex",
                                gap: "15px",
                                alignItems: "center"
                            }}
                        >
                            {/* IMAGE */}
                            <img
                                src={item.image || "/placeholder-food.png"}
                                width="75"
                                height="75"
                                style={{
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    border: "1px solid #eee",
                                }}
                            />

                            {/* DETAILS */}
                            <Box sx={{ flex: 1 }}>
                                <b>{item.name}</b>
                                <p style={{ margin: "3px 0", opacity: 0.6 }}>
                                    €{item.price}
                                </p>

                                {/* QUANTITY CONTROLS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginTop: "5px",
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => updateQty(item.productId, item.qty - 1)}
                                        sx={{ background: "#FFE55C" }}
                                    >
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>

                                    <Typography>{item.qty}</Typography>

                                    <IconButton
                                        size="small"
                                        onClick={() => updateQty(item.productId, item.qty + 1)}
                                        sx={{ background: "#FFE55C" }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* SUBTOTAL */}
                                <p style={{ marginTop: "8px" }}>
                                    Subtotal: <b>€{(item.qty * item.price).toFixed(2)}</b>
                                </p>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{ marginTop: "5px" }}
                                    onClick={() => removeItem(item.productId)}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* PROMO SECTION */}
                <Box sx={{ padding: "0 15px", marginTop: "10px" }}>
                    <Typography><strong>Promotion Code</strong></Typography>

                    <TextField
                        fullWidth
                        placeholder="Enter promo code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        sx={{
                            marginTop: "10px",
                            background: "#fff",
                            borderRadius: "12px",
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ marginTop: "10px" }}
                        onClick={applyPromo}
                    >
                        Apply Code
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        sx={{ marginTop: "10px" }}
                        onClick={removePromo}
                    >
                        Remove Promotion
                    </Button>
                </Box>

                {/* TOTALS */}
                <Box sx={{ padding: "15px" }}>
                    <Typography sx={{ fontSize: "18px" }}>
                        Subtotal: €{total.toFixed(2)}
                    </Typography>

                    {discountAmount > 0 && (
                        <Typography sx={{ color: "green", marginTop: "5px" }}>
                            {promotion} – €{discountAmount.toFixed(2)} off
                        </Typography>
                    )}

                    <Typography sx={{ fontSize: "22px", marginTop: "10px" }}>
                        <strong>Total: €{finalTotal.toFixed(2)}</strong>
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ marginTop: "20px" }}
                        onClick={() => (window.location.href = "/customer/checkout")}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}
