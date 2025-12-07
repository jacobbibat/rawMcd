"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import ManagerBottomNav from "../../../components/ManagerBottomNav";

export default function AddMenuItemPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [available, setAvailable] = useState(true);

    const [message, setMessage] = useState("");

    const categories = [
        "burger",
        "chicken",
        "fries",
        "drink",
        "dessert",
        "breakfast"
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("/api/addMenuItem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    category,
                    image,
                    available
                })
            });

            const data = await res.json();
            setMessage(data.message || "");

        } catch (err) {
            console.error("addMenuItem error:", err);
            setMessage("Error adding menu item.");
        }
    }

    return (
        <>
            <Container
                maxWidth="xs"
                style={{ marginTop: "40px", marginBottom: "90px" }}
            >
                <h1>Add Menu Item</h1>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Price (€)"
                        margin="normal"
                        type="number"
                        inputProps={{ step: "any" }}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Category"
                        margin="normal"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Image URL (optional)"
                        margin="normal"
                        onChange={(e) => setImage(e.target.value)}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={available}
                                onChange={() => setAvailable(!available)}
                            />
                        }
                        label="Available"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: "20px" }}
                    >
                        Add Item
                    </Button>

                    {message && (
                        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
                    )}
                </form>
            </Container>

            <ManagerBottomNav />
        </>
    );
}
