import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, LogIn } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login, isLoggingIn } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState("info");

  const handleLogin = () => {
    login();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="login.dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Welcome Back
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                SSC Batch 2023 Portal
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger
              value="info"
              className="flex-1"
              data-ocid="login.info.tab"
            >
              About Login
            </TabsTrigger>
            <TabsTrigger value="login" className="flex-1" data-ocid="login.tab">
              Login / Signup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pt-2">
            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Secure Authentication
              </h3>
              <p className="text-sm text-muted-foreground">
                This portal uses Internet Identity for secure, password-free
                authentication. Your identity is cryptographically secured and
                never stored on our servers.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Click &quot;Login / Signup&quot; tab above.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>
                  A secure login window will open. Create or use your Internet
                  Identity.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>
                  Once authenticated, you can post, comment, and like content.
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => setActiveTab("login")}
            >
              Get Started
            </Button>
          </TabsContent>

          <TabsContent value="login" className="space-y-4 pt-2">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to securely login with Internet Identity.
                No password needed — just your device biometrics or security
                key.
              </p>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="login.submit_button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn
                  ? "Opening login..."
                  : "Login with Internet Identity"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              New users will be prompted to set up their profile after first
              login.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
