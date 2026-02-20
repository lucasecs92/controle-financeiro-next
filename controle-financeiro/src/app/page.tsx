"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import LoginModal from "@/features/auth/components/LoginModal/LoginModal";
import RegisterModal from "@/features/auth/components/RegisterModal/RegisterModal";
import Dashboard from "@/features/dashboard/components/Dashboard/Dashboard";
import { getSupabaseClient } from "@/lib/supabase/client";

type AuthModalType = "login" | "register" | null;

export default function Home() {
  const supabase = getSupabaseClient();
  const [authModal, setAuthModal] = useState<AuthModalType>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(() => supabase === null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthModal(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  if (!isAuthReady) {
    return null;
  }

  if (session) {
    return (
      <Dashboard
        userId={session.user.id}
        userName={
          session.user.user_metadata?.name ??
          session.user.user_metadata?.full_name ??
          session.user.email?.split("@")[0] ??
          "Usuário"
        }
        onLogout={handleLogout}
      />
    );
  }

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
