"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import LoginModal from "@/features/auth/components/LoginModal/LoginModal";
import RegisterModal from "@/features/auth/components/RegisterModal/RegisterModal";

type AuthModalType = "login" | "register" | null;

export default function Home() {
  const [authModal, setAuthModal] = useState<AuthModalType>(null);

  return (
    <>
      <Navbar onOpenLogin={() => setAuthModal("login")} />
      <Hero onOpenRegister={() => setAuthModal("register")} />
      <Footer />

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onOpenRegister={() => setAuthModal("register")}
        />
      )}

      {authModal === "register" && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onOpenLogin={() => setAuthModal("login")}
        />
      )}
    </>
  );
}
