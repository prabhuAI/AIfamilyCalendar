import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserRound, ListChecks, CreditCard, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const navigate = useNavigate();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>{profile?.nickname}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/groceries')} className="cursor-pointer">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span>Groceries</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/todos')} className="cursor-pointer">
          <ListChecks className="mr-2 h-4 w-4" />
          <span>Things to Do</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/payment-reminders')} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment Reminders</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}