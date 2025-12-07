"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";

import logo from "@/img/logo.png"; // McDonalds logo

export default function Page() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    async function handleRegister(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message || "Registration failed");
        } else {
            setMessage("Registration successful!");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
    }

    return (
        <Container
            maxWidth="xs"
            style={{
                padding: "30px",
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
            }}
        >
            {/* LOGO */}
            <Image
                src={logo}
                alt="McDonalds Logo"
                width={100}
                style={{ marginBottom: "20px" }}
            />

            <h1 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                Create Account
            </h1>

            <p style={{ marginTop: "-5px", marginBottom: "20px", opacity: 0.7 }}>
                Join us and start your order 🍟
            </p>

            <form onSubmit={handleRegister}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="First Name"
                    onChange={(e) => update("firstName", e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    onChange={(e) => update("lastName", e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    type="email"
                    label="Email"
                    onChange={(e) => update("email", e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Password"
                    onChange={(e) => update("password", e.target.value)}
                />

                {/* SUBMIT BUTTON */}
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#FFC300",
                        color: "#000",
                        fontWeight: "bold",
                    }}
                >
                    Create Account
                </Button>

                {message && (
                    <p
                        style={{
                            marginTop: "15px",
                            color: "green",
                            fontWeight: "bold",
                        }}
                    >
                        {message}
                    </p>
                )}

                {/* LINK TO LOGIN */}
                <p style={{ marginTop: "15px" }}>
                    Already registered?{" "}
                    <Link
                        href="/login"
                        style={{ color: "#D62828", textDecoration: "underline" }}
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </Container>
    );
}
