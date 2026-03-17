import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  getParam: (pattern: RegExp) => string | null;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const getParam = (pattern: RegExp) => {
    const m = currentPath.match(pattern);
    return m ? m[1] : null;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, getParam }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
}
