import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFamilyData } from "@/hooks/useFamily";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { familyData } = useFamilyData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyData.familyId) {
      toast({
        title: "Error",
        description: "No family found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (fullName.length > 12) {
      toast({
        title: "Error",
        description: "Full name must be 12 characters or less",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First create a new user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          full_name: fullName,
          nickname: nickname || fullName.substring(0, Math.min(fullName.length, 6))
        }])
        .select('id')
        .single();

      if (profileError) {
        throw new Error('Failed to create profile');
      }

      // Add the user to the family
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.familyId,
          user_id: profileData.id
        });

      if (memberError) {
        throw memberError;
      }

      toast({
        title: "Success",
        description: "Family member added successfully",
      });
      onOpenChange(false);
      setFullName("");
      setNickname("");
    } catch (error: any) {
      console.error('Error adding family member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (max 12 characters)</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter member's full name"
              maxLength={12}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (optional, max 6 characters)</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}