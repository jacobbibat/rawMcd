"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BottomNav from "../../components/BottomNav";

import { ThemeProvider } from "@mui/material/styles";
import { mcdTheme } from "@/theme/mcdonaldsTheme";

export default function SearchMenuPage() {
    const [menu, setMenu] = useState([]);
    const [search, setSearch] = useState("");
    const [session, setSession] = useState(null);

    useEffect(() => {
        loadSession();
        loadMenu();
    }, []);

    // --------------------------------------
    // LOAD SESSION
    // --------------------------------------
    async function loadSession() {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.loggedIn) setSession(data.session);
    }

    // --------------------------------------
    // LOAD MENU ITEMS
    // --------------------------------------
    async function loadMenu() {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        setMenu(data);
    }

    // --------------------------------------
    // ADD TO CART
    // --------------------------------------
    async function handleAddToCart(productId) {
        if (!session) {
            alert("You must be logged in.");
            return;
        }

        try {
            const res = await fetch("/api/addToCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });

            const data = await res.json();
            alert(data.message);
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Error adding item to cart.");
        }
    }

    const filtered = menu.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ThemeProvider theme={mcdTheme}>
            <Container
                maxWidth="xs"
                style={{
                    padding: 0,
                    marginBottom: "90px",
                    backgroundColor: "#fff",
                }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        backgroundColor: "#FFE55C",
                        padding: "28px 20px 35px 20px",
                        borderBottomLeftRadius: "30px",
                        borderBottomRightRadius: "30px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        marginBottom: "25px",
                    }}
                >
                    <h2 style={{ margin: 0 }}>Search Menu 🔍</h2>
                    <p style={{ marginTop: "5px", opacity: 0.8 }}>Find anything you like</p>

                    <TextField
                        fullWidth
                        placeholder="Search for burgers, fries…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            marginTop: "12px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                paddingLeft: "10px",
                            },
                        }}
                    />
                </Box>

                {/* GRID MENU */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                        padding: "0 15px 20px 15px",
                    }}
                >
                    {filtered.length === 0 && (
                        <p style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.7 }}>
                            No matching items found.
                        </p>
                    )}

                    {filtered.map(item => (
                        <Box
                            key={item._id}
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: "22px",
                                padding: "14px",
                                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "space-between",
                                minHeight: "200px",
                            }}
                        >
                            <img
                                src={item.image || "/placeholder-food.png"}
                                alt={item.name}
                                style={{
                                    width: "85px",
                                    height: "85px",
                                    objectFit: "contain",
                                    marginBottom: "10px",
                                }}
                            />

                            <div style={{ lineHeight: "1.2", marginBottom: "8px" }}>
                                <b style={{ fontSize: "15px", display: "block" }}>{item.name}</b>
                                <small style={{ opacity: 0.6, display: "block", marginTop: "2px" }}>
                                    {item.category}
                                </small>
                                <b style={{ fontSize: "16px", display: "block", marginTop: "6px" }}>
                                    €{item.price}
                                </b>
                            </div>

                            <IconButton
                                onClick={() => handleAddToCart(item._id)}
                                sx={{
                                    backgroundColor: "#FFE55C",
                                    borderRadius: "14px",
                                    padding: "6px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                    "&:hover": { backgroundColor: "#FFD944" },
                                }}
                            >
                                <AddShoppingCartIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}
