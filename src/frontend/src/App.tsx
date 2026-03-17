import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useIncrementVisitorCount,
} from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import FriendsPage from "./pages/FriendsPage";
import HomePage from "./pages/HomePage";
import PDFsPage from "./pages/PDFsPage";
import PhotosPage from "./pages/PhotosPage";
import PostDetailPage from "./pages/PostDetailPage";
import SocialPage from "./pages/SocialPage";
import VideosPage from "./pages/VideosPage";
import { RouterProvider, useRouter } from "./router";

function AppContent() {
  const { currentPath } = useRouter();
  const { identity } = useInternetIdentity();
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const { mutate: incrementMutate } = useIncrementVisitorCount();
  const incrementedRef = useRef(false);

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && profile === null;

  useEffect(() => {
    if (!incrementedRef.current) {
      incrementedRef.current = true;
      incrementMutate();
    }
  }, [incrementMutate]);

  const isAdmin = currentPath === "/admin";

  const renderPage = () => {
    if (currentPath === "/" || currentPath === "")
      return (
        <HomePage searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      );
    if (currentPath === "/friends") return <FriendsPage />;
    if (currentPath === "/photos") return <PhotosPage />;
    if (currentPath === "/videos") return <VideosPage />;
    if (currentPath === "/pdfs") return <PDFsPage />;
    if (currentPath === "/social") return <SocialPage />;
    if (currentPath === "/admin") return <AdminPage />;
    if (currentPath.startsWith("/posts/")) return <PostDetailPage />;
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdmin && (
        <Header
          onLoginClick={() => setLoginOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
      <div className="flex-1">{renderPage()}</div>
      {!isAdmin && <Footer />}

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <ProfileSetupModal open={showProfileSetup} />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
