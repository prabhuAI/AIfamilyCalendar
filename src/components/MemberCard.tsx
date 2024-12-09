import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";

interface MemberCardProps {
  fullName: string;
  nickname: string;
  onRemove: () => void;
}

export function MemberCard({ fullName, nickname, onRemove }: MemberCardProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-[#E8ECF4] rounded-2xl shadow-[4px_4px_10px_rgba(163,177,198,0.6),-4px_-4px_10px_rgba(255,255,255,0.8)]">
      <div>
        <p className="font-medium text-[#374151]">{fullName}</p>
        <p className="text-sm text-[#6B7280]">{nickname}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-xl h-8 w-8"
      >
        <UserMinus className="h-4 w-4" />
      </Button>
    </div>
  );
}