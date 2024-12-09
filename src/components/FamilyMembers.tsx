import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, UserMinus } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface AddMemberData {
  email: string;
}

export function FamilyMembers() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: familyMembers, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // If user has no family, create one
      if (!familyMembers || familyMembers.length === 0) {
        const { data: newFamily, error: familyError } = await supabase
          .from('families')
          .insert([{ family_name: 'My Family' }])
          .select()
          .single();

        if (familyError) throw familyError;

        await supabase
          .from('family_members')
          .insert([{ family_id: newFamily.id, user_id: user.id }]);

        return { familyId: newFamily.id, members: [] };
      }

      const familyId = familyMembers[0].family_id;

      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select(`
          user_id,
          profiles:profiles(full_name, nickname)
        `)
        .eq('family_id', familyId);

      if (membersError) throw membersError;

      return { familyId, members };
    }
  });

  const addMember = useMutation({
    mutationFn: async (data: AddMemberData) => {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = (users as User[]).find(u => u.email === data.email);
      if (!user) throw new Error('User not found');

      const { error: memberError } = await supabase
        .from('family_members')
        .insert([{ family_id: familyData?.familyId, user_id: user.id }]);

      if (memberError) throw memberError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      setEmail('');
      setOpen(false);
      toast({
        title: "Success",
        description: "Family member added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('family_id', familyData?.familyId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      toast({
        title: "Success",
        description: "Family member removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember.mutate({ email });
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
        {familyData?.members.length === 0 ? (
          <p className="text-[#8E8E93] text-center py-4">No family members yet</p>
        ) : (
          familyData?.members.map((member: any) => (
            <div
              key={member.user_id}
              className="flex justify-between items-center p-4 bg-[#E8ECF4] rounded-2xl shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)]"
            >
              <div>
                <p className="font-medium text-[#374151]">{member.profiles.full_name}</p>
                <p className="text-sm text-[#6B7280]">{member.profiles.nickname}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMember.mutate(member.user_id)}
                className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-xl h-8 w-8"
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
