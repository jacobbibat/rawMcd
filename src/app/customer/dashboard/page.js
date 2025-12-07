"use client";

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import { ThemeProvider } from "@mui/material/styles";
import BottomNav from "../../components/BottomNav";

import {
    mcdTheme,
    promoBannerStyle,
    productCardStyle,
    categoryChipStyle
} from "@/theme/mcdonaldsTheme";

export default function DashboardPage() {

    const [session, setSession] = useState(null);
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("default");

    const categories = ["all", "burger", "chicken", "fries", "drink", "dessert", "breakfast"];

    // LOAD USER SESSION
    useEffect(() => {
        async function loadSession() {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.loggedIn) setSession(data.session);
        }
        loadSession();
        loadProducts();
        loadPromotions();
    }, []);

    async function loadProducts() {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        setProducts(data);
    }

    async function loadPromotions() {
        const res = await fetch("/api/getPromotions");
        const data = await res.json();
        if (data.success) setPromotions(data.promotions);
    }

    async function handleAddToCart(productId) {
        if (!session) return alert("You must be logged in.");
        const res = await fetch("/api/addToCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        alert(data.message);
    }

    // FILTER + SORT
    const filteredProducts = products.filter((item) => {
        const matchSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());

        const matchCat = category === "all" || item.category === category;

        return matchSearch && matchCat;
    });

    let sortedProducts = [...filteredProducts];
    if (sort === "price-low") sortedProducts.sort((a, b) => a.price - b.price);
    if (sort === "price-high") sortedProducts.sort((a, b) => b.price - a.price);
    if (sort === "az") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));

    if (!products.length) return <p>Loading...</p>;

    return (
        <ThemeProvider theme={mcdTheme}>
            <Container
                maxWidth="xs"
                style={{
                    padding: 0,
                    marginBottom: "95px",
                    backgroundColor: "#fff",
                }}
            >

                <Box
                    sx={{
                        backgroundColor: "#FFE55C",
                        padding: "28px 20px 40px 20px",
                        borderBottomLeftRadius: "30px",
                        borderBottomRightRadius: "30px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        marginBottom: "25px",
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Hello, {session ? session.firstName : "Guest"}
                    </h2>
                    <p style={{ marginTop: "5px", opacity: 0.8, marginBottom: "20px" }}>
                        Welcome back 👋
                    </p>

                    {/* SEARCH BAR */}
                    <TextField
                        fullWidth
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                paddingLeft: "10px",
                            },
                        }}
                    />
                </Box>

                {/* PROMOTION BANNER */}
                {promotions.length > 0 && (
                    <Box sx={promoBannerStyle}>
                        <h3 style={{ margin: 0 }}>{promotions[0].title}</h3>
                        <p style={{ margin: "6px 0" }}>{promotions[0].description}</p>
                        <strong>{promotions[0].discount}% OFF</strong>
                    </Box>
                )}

                {/* CATEGORY FILTER */}
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: "10px",
                        padding: "0 10px 15px 10px",
                    }}
                >
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            clickable
                            sx={categoryChipStyle(category === cat)}
                            onClick={() => setCategory(cat)}
                        />
                    ))}
                </Box>

                {/* SORT DROPDOWN */}
                <Box sx={{ padding: "0 15px", marginBottom: "15px" }}>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "16px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                    >
                        <option value="default">Sort Menu</option>
                        <option value="price-low">Price Low → High</option>
                        <option value="price-high">Price High → Low</option>
                        <option value="az">A → Z</option>
                        <option value="za">Z → A</option>
                    </select>
                </Box>

                {/* MENU ITEMS */}
                <Box sx={{ padding: "0 15px" }}>
                    {sortedProducts.map((item) => (
                        <Box key={item._id} sx={productCardStyle}>
                            <img
                                src={item.image || "/placeholder-food.png"}
                                alt={item.name}
                                width="85"
                                height="85"
                                style={{
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                <b style={{ fontSize: "17px" }}>{item.name}</b>
                                <br />
                                <small>{item.description}</small>
                                <br />
                                <b style={{ fontSize: "17px" }}>€{item.price}</b>
                            </div>

                            <IconButton
                                onClick={() => handleAddToCart(item._id)}
                                sx={{
                                    backgroundColor: "#FFE55C",
                                    borderRadius: "14px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                }}
                            >
                                <AddShoppingCartIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                {sortedProducts.length === 0 && (
                    <p style={{ textAlign: "center", marginTop: "30px" }}>
                        No items found.
                    </p>
                )}
            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}
