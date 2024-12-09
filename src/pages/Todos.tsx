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

const Todos = () => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: { task: string; due_date: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          ...newTodo,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTask("");
      setDueDate(null);
      toast({
        title: "Task added successfully",
        duration: 2000,
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: isCompleted })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addTodoMutation.mutate({
      task: newTask,
      due_date: dueDate ? dueDate.toISOString() : null,
    });
  };

  return (
    <div className="container mx-auto py-4 px-3 md:py-8 md:px-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">To-Do List</h1>
        <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date: Date) => setDueDate(date)}
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
          {todos?.map((item) => (
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
                  {item.task}
                </span>
              </div>
              {item.due_date && (
                <span className="text-sm text-gray-500">
                  Due: {format(new Date(item.due_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Todos;