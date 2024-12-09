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

const PaymentReminders = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (newPayment: {
      payment_description: string;
      amount: number;
      due_date: string;
    }) => {
      const { data, error } = await supabase
        .from('payment_reminders')
        .insert([newPayment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setDescription("");
      setAmount("");
      setDueDate(null);
      toast({
        title: "Payment reminder added successfully",
        duration: 2000,
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('payment_reminders')
        .update({ is_completed: isCompleted })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim() || !dueDate) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    addPaymentMutation.mutate({
      payment_description: description,
      amount: numericAmount,
      due_date: dueDate.toISOString(),
    });
  };

  return (
    <div className="container mx-auto py-4 px-3 md:py-8 md:px-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Payment Reminders</h1>
        <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment description..."
            className="flex-1"
          />
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            step="0.01"
            className="w-32"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            placeholderText="Due date"
            className="px-3 py-2 border rounded-md"
          />
          <Button type="submit">Add</Button>
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {payments?.map((item) => (
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
                <div>
                  <span className={item.is_completed ? "line-through text-gray-500" : ""}>
                    {item.payment_description}
                  </span>
                  <span className="ml-2 text-sm font-semibold">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                Due: {format(new Date(item.due_date), 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentReminders;