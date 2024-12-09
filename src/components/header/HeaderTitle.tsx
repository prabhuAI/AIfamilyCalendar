import { Calendar } from "lucide-react";

export function HeaderTitle() {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-6 w-6 text-[#4169E1]" />
      <h1 className="text-2xl md:text-3xl font-bold text-[#4169E1]">
        Family Calendar
      </h1>
    </div>
  );
}