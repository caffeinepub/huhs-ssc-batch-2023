import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInitAuth, useSaveUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("2023");
  const saveProfile = useSaveUserProfile();
  const initAuth = useInitAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      // Register in auth system first (empty string = regular user)
      try {
        await initAuth.mutateAsync("");
      } catch {}
      await saveProfile.mutateAsync({ name: name.trim(), batch });
      toast.success("Profile saved! Welcome to SSC Batch 2023 Portal.");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" data-ocid="profile_setup.dialog">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-xl font-bold">
                Complete Your Profile
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us your name to get started
              </p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rakibul Hasan"
              required
              className="mt-1"
              data-ocid="profile_setup.name.input"
            />
          </div>
          <div>
            <Label htmlFor="profile-batch">Batch Year</Label>
            <Input
              id="profile-batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. 2023"
              className="mt-1"
              data-ocid="profile_setup.batch.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={
              saveProfile.isPending || initAuth.isPending || !name.trim()
            }
            data-ocid="profile_setup.submit_button"
          >
            {saveProfile.isPending || initAuth.isPending
              ? "Saving..."
              : "Save Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
