import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useFamilyData } from "@/hooks/useFamily";

export function ProfileDropdown() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const { addMember } = useFamilyData();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember.mutate(memberName);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <span>{profile?.nickname}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsAddMemberOpen(true)}>
            Add Family Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="w-[95%] max-w-[425px] rounded-3xl bg-[#E8ECF4] shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] border-none p-6">
          <DialogHeader>
            <DialogTitle className="text-[#374151] text-xl font-semibold">Add Family Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value.slice(0, 10))}
                maxLength={10}
                required
                className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"
              />
              <div className="text-xs text-[#6B7280]">{memberName.length}/10 characters</div>
            </div>
            <Button
              type="submit"
              disabled={addMember.isPending}
              className="w-full bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#374151] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-xl py-3 mt-6 font-medium"
            >
              {addMember.isPending ? "Adding..." : "Add Member"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}