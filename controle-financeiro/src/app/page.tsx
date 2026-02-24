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
type AuthenticatedView = "dashboard" | "hero";

export default function Home() {
  const supabase = getSupabaseClient();
  const [authModal, setAuthModal] = useState<AuthModalType>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(() => supabase === null);
  const [authenticatedView, setAuthenticatedView] =
    useState<AuthenticatedView>("dashboard");

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
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthModal(null);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setAuthenticatedView("dashboard");
      }
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
    const userName =
      session.user.user_metadata?.name ??
      session.user.user_metadata?.full_name ??
      session.user.email?.split("@")[0] ??
      "Usuário";

    if (authenticatedView === "hero") {
      return (
        <>
          <Navbar
            mode="authenticated"
            variant="landing"
            userName={userName}
            onLogout={handleLogout}
            onLogoClick={() => setAuthenticatedView("hero")}
          />
          <Hero
            onPrimaryAction={() => setAuthenticatedView("dashboard")}
            primaryActionLabel="Ir para o Dashboard"
            showScreenshot={false}
            actionVariant="light"
          />
          <Footer />
        </>
      );
    }

    return (
      <Dashboard
        userId={session.user.id}
        userName={userName}
        onLogout={handleLogout}
        onOpenHero={() => setAuthenticatedView("hero")}
      />
    );
  }

  return (
    <>
      <Navbar onOpenLogin={() => setAuthModal("login")} />
      <Hero onPrimaryAction={() => setAuthModal("register")} />
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
