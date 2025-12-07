"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ManagerBottomNav from "../components/ManagerBottomNav";

export default function ManagerDashboard() {
    const [orders, setOrders] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await fetch("/api/getAllOrders");
            const data = await res.json();

            if (!data.success) {
                setMessage(data.message || "Could not load orders.");
                return;
            }

            setOrders(data.orders);
        } catch (err) {
            console.error("loadOrders error:", err);
            setMessage("Error loading orders.");
        }
    }

    async function updateStatus(orderId, newStatus) {
        try {
            const res = await fetch("/api/updateOrderStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, newStatus })
            });

            const data = await res.json();
            setMessage(data.message || "");

            // reload orders
            loadOrders();
        } catch (err) {
            console.error("updateStatus error:", err);
            setMessage("Error updating order.");
        }
    }

    if (!orders) {
        return (
            <>
                <Container maxWidth="sm" style={{ marginTop: "40px" }}>
                    <h1>Manager Dashboard</h1>
                    <p>{message || "Loading orders..."}</p>
                </Container>
                <ManagerBottomNav />
            </>
        );
    }

    return (
        <>
            <Container
                maxWidth="sm"
                style={{ marginTop: "40px", marginBottom: "90px" }}
            >
                <h1>Manager Dashboard</h1>

                {orders.map((order) => (
                    <Box
                        key={order._id}
                        style={{
                            marginBottom: "20px",
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px"
                        }}
                    >
                        <Typography><strong>Order ID:</strong> {order._id}</Typography>
                        <Typography><strong>User:</strong> {order.userId}</Typography>
                        <Typography><strong>Status:</strong> {order.status}</Typography>
                        <Typography><strong>Total:</strong> €{order.total.toFixed(2)}</Typography>

                        <Typography style={{ marginTop: "10px" }}>
                            <strong>Items:</strong>
                        </Typography>
                        {order.items && order.items.map((item, i) => (
                            <Typography key={i} style={{ marginLeft: "10px" }}>
                                {item.name} (x{item.qty}) — €{item.price}
                            </Typography>
                        ))}

                        <Box style={{ marginTop: "15px" }}>
                            <Button
                                variant="outlined"
                                onClick={() => updateStatus(order._id, "preparing")}
                                style={{ marginRight: "10px" }}
                            >
                                Preparing
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => updateStatus(order._id, "completed")}
                            >
                                Completed
                            </Button>
                        </Box>
                    </Box>
                ))}

                {message && (
                    <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
                )}
            </Container>

            <ManagerBottomNav />
        </>
    );
}
