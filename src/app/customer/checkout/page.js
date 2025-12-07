"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import BottomNav from "../../components/BottomNav";
import { ThemeProvider } from "@mui/material/styles";
import { mcdTheme } from "@/theme/mcdonaldsTheme";

export default function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    // -----------------------------------------
    // LOAD CART (SESSION-BASED)
    // -----------------------------------------
    async function loadCart() {
        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) {
            setCart(null);
            return;
        }

        setCart(data.cart);
        setTotal(data.total);
        setDiscountAmount(data.discountAmount);
        setFinalTotal(data.finalTotal);
        setPromotion(data.promotion);
    }

    // -----------------------------------------
    // CONFIRM ORDER
    // -----------------------------------------
    async function confirmOrder() {
        const res = await fetch("/api/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = "/customer/orders?thankyou=true";
        } else {
            alert(data.message);
        }
    }

    // -----------------------------------------
    // LOADING TEMPLATE
    // -----------------------------------------
    if (loading) {
        return (
            <ThemeProvider theme={mcdTheme}>
                <p style={{ marginTop: "40px", textAlign: "center" }}>Loading...</p>
            </ThemeProvider>
        );
    }

    // -----------------------------------------
    // EMPTY CART TEMPLATE
    // -----------------------------------------
    if (!cart) {
        return (
            <ThemeProvider theme={mcdTheme}>
                <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                    <h1>Checkout</h1>
                    <p>Your cart is empty.</p>

                    <Button
                        fullWidth
                        variant="contained"
                        style={{ marginTop: "20px" }}
                        onClick={() => (window.location.href = "/customer/dashboard")}
                    >
                        Back to Home
                    </Button>
                </Container>

                <BottomNav />
            </ThemeProvider>
        );
    }

    // -----------------------------------------
    // MAIN CHECKOUT PAGE
    // -----------------------------------------
    return (
        <ThemeProvider theme={mcdTheme}>
            <Container maxWidth="xs" style={{ padding: 0, marginBottom: "90px" }}>

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
                    <h2 style={{ margin: 0 }}>Checkout ✔️</h2>
                    <p style={{ marginTop: "5px", opacity: 0.8 }}>
                        Review your order before paying
                    </p>
                </Box>

                {/* ITEMS LIST */}
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
                                alignItems: "center",
                            }}
                        >
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

                            <Box sx={{ flex: 1 }}>
                                <b>{item.name}</b>
                                <p style={{ margin: "3px 0", opacity: 0.65 }}>
                                    Qty: {item.qty}
                                </p>
                                <p>
                                    <b>€{item.price.toFixed(2)}</b>
                                </p>
                            </Box>
                        </Box>
                    ))}
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

                    {/* EDIT ORDER */}
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: "25px", marginBottom: "10px" }}
                        onClick={() => (window.location.href = "/customer/view_cart")}
                    >
                        Edit Order
                    </Button>

                    {/* CONFIRM ORDER */}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#FFCC00",
                            "&:hover": { backgroundColor: "#FFB700" },
                        }}
                        onClick={confirmOrder}
                    >
                        Confirm Order
                    </Button>
                </Box>
            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}
