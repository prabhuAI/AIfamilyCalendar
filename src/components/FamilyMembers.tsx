import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus } from "lucide-react";
import { MemberCard } from "./MemberCard";
import { useFamilyData } from "@/hooks/useFamily";

export function FamilyMembers() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { familyData, addMember, removeMember } = useFamilyData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember.mutate(email, {
      onSuccess: () => {
        setEmail('');
        setOpen(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1C1C1E] flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Members
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E8ECF4] hover:bg-[#D8DDE5] text-[#6B7280] shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-2xl px-6 py-3 font-medium transition-all duration-200">
              <UserPlus className="h-5 w-5 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-[425px] rounded-3xl bg-[#E8ECF4] shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] border-none p-6">
            <DialogHeader>
              <DialogTitle className="text-[#374151] text-xl font-semibold">Add Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl bg-[#E8ECF4] border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"
                />
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
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        {!familyData?.members || familyData.members.length === 0 ? (
          <p className="text-[#8E8E93] text-center py-4">No family members yet</p>
        ) : (
          familyData.members.map((member: any) => (
            <MemberCard
              key={member.user_id}
              fullName={member.profiles.full_name}
              nickname={member.profiles.nickname}
              onRemove={() => removeMember.mutate(member.user_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}