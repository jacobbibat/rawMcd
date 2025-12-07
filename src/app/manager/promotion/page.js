"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ManagerBottomNav from "../../components/ManagerBottomNav";

export default function PromotionPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        loadPromotions();
    }, []);

    async function deletePromotion(promoId) {
        const res = await fetch("/api/deletePromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promoId })
        });

        const data = await res.json();
        alert(data.message);

        if (data.success) loadPromotions();
    }


    async function loadPromotions() {
        try {
            const res = await fetch("/api/getPromotions");
            const data = await res.json();

            if (data.success) {
                setPromotions(data.promotions);
            }
        } catch (err) {
            console.error("loadPromotions error:", err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("/api/addPromotion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    discount,
                    code
                })
            });

            const data = await res.json();
            setMessage(data.message || "");

            if (data.success) {
                // clear inputs
                setTitle("");
                setDescription("");
                setDiscount("");
                setCode("");
                loadPromotions();
            }

        } catch (err) {
            console.error("addPromotion error:", err);
            setMessage("Error creating promotion.");
        }
    }

    return (
        <>
            <Container
                maxWidth="sm"
                style={{ marginTop: "40px", marginBottom: "90px" }}
            >
                <h1>Manage Promotions</h1>

                {/* Create Promotion Form */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Discount (%)"
                        type="number"
                        margin="normal"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Promo Code"
                        margin="normal"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: "20px" }}
                    >
                        Create Promotion
                    </Button>

                    {message && (
                        <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
                    )}
                </form>

                {/* Existing Promotions */}
                <Typography style={{ marginTop: "30px", marginBottom: "10px" }}>
                    <strong>Active Promotions</strong>
                </Typography>

                {promotions.map((promo) => (
                    <Box
                        key={promo._id}
                        style={{
                            padding: "12px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "10px"
                        }}
                    >
                        <Typography><b>{promo.title}</b></Typography>
                        <Typography>{promo.description}</Typography>
                        <Typography>Discount: {promo.discount}%</Typography>
                        <Typography>Code: {promo.code}</Typography>

                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            style={{ marginTop: "10px" }}
                            onClick={() => deletePromotion(promo._id)}
                        >
                            Delete Promotion
                        </Button>
                    </Box>
                ))}


                {promotions.length === 0 && (
                    <p>No active promotions.</p>
                )}
            </Container>

            <ManagerBottomNav />
        </>
    );
}
