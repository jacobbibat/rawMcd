"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import BottomNav from "@/app/components/BottomNav";
import { ThemeProvider } from "@mui/material/styles";
import { mcdTheme } from "@/theme/mcdonaldsTheme";

export default function OrdersPage() {
    const [orders, setOrders] = useState(null);
    const [message, setMessage] = useState("");

    const params = useSearchParams();
    const thankYou = params.get("thankyou") === "true";

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const res = await fetch("/api/getOrders", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message);
            return;
        }

        setOrders(data.orders);
    }

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
                    <h2 style={{ margin: 0 }}>Your Orders 📦</h2>
                    <p style={{ marginTop: "5px", opacity: 0.8 }}>
                        Track your recent purchases
                    </p>
                </Box>

                {/* THANK YOU BANNER */}
                {thankYou && (
                    <Box
                        sx={{
                            margin: "0 15px 20px 15px",
                            background: "#d4edda",
                            borderRadius: "14px",
                            padding: "14px",
                            textAlign: "center",
                            color: "#155724",
                            fontWeight: "bold",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        🎉 Your order has been placed!
                    </Box>
                )}

                {/* MESSAGES */}
                {message && (
                    <Typography sx={{ textAlign: "center", marginBottom: "20px" }}>
                        {message}
                    </Typography>
                )}

                {/* EMPTY STATE */}
                {orders && orders.length === 0 && (
                    <Typography sx={{ textAlign: "center", opacity: 0.7 }}>
                        No previous orders found.
                    </Typography>
                )}

                {/* ORDERS LIST */}
                <Box sx={{ padding: "0 15px" }}>
                    {orders &&
                        orders.map((order, index) => (
                            <Box
                                key={index}
                                sx={{
                                    background: "#fff",
                                    padding: "15px",
                                    borderRadius: "18px",
                                    marginBottom: "15px",
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    <strong>Order #{index + 1}</strong>
                                </Typography>

                                <Typography sx={{ opacity: 0.7 }}>
                                    Status: {order.status}
                                </Typography>

                                <Typography sx={{ marginTop: "10px", fontWeight: 600 }}>
                                    Items:
                                </Typography>

                                {order.items.map((item, i) => (
                                    <Typography key={i} sx={{ marginLeft: "10px" }}>
                                        {item.name} (x{item.qty}) — €{item.price}
                                    </Typography>
                                ))}

                                <Typography sx={{ marginTop: "12px", fontSize: "18px" }}>
                                    <strong>Total: €{order.total.toFixed(2)}</strong>
                                </Typography>

                                <Typography sx={{ marginTop: "6px", opacity: 0.6, fontSize: "12px" }}>
                                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                </Box>

                {/* BACK BUTTON */}
                <Box sx={{ padding: "0 15px 20px 15px" }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#FFCC00",
                            "&:hover": { backgroundColor: "#FFB700" },
                            marginTop: "10px"
                        }}
                        onClick={() => (window.location.href = "/customer/dashboard")}
                    >
                        Back to Homepage
                    </Button>
                </Box>
            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}
