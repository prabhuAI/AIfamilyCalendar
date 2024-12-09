import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Groceries = () => {
  const [newItem, setNewItem] = useState("");
  const [buyByDate, setBuyByDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groceries, isLoading } = useQuery({
    queryKey: ['groceries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addGroceryMutation = useMutation({
    mutationFn: async (newGrocery: { item_name: string; buy_by_date: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('groceries')
        .insert([{
          ...newGrocery,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
      setNewItem("");
      setBuyByDate(null);
      toast({
        title: "Item added successfully",
        duration: 2000,
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('groceries')
        .update({ is_completed: isCompleted })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    addGroceryMutation.mutate({
      item_name: newItem,
      buy_by_date: buyByDate ? buyByDate.toISOString() : null,
    });
  };

  return (
    <div className="container mx-auto py-4 px-3 md:py-8 md:px-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Grocery List</h1>
        <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            className="flex-1"
          />
          <DatePicker
            selected={buyByDate}
            onChange={(date: Date) => setBuyByDate(date)}
            placeholderText="Buy by date"
            className="px-3 py-2 border rounded-md"
          />
          <Button type="submit">Add</Button>
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {groceries?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={(checked) => {
                    toggleCompleteMutation.mutate({
                      id: item.id,
                      isCompleted: checked as boolean,
                    });
                  }}
                />
                <span className={item.is_completed ? "line-through text-gray-500" : ""}>
                  {item.item_name}
                </span>
              </div>
              {item.buy_by_date && (
                <span className="text-sm text-gray-500">
                  Buy by: {format(new Date(item.buy_by_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groceries;