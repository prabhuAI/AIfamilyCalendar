import { Users } from 'lucide-react';
import { MemberCard } from "./MemberCard";
import { useFamilyData } from "@/hooks/useFamily";

export function FamilyMembers() {
  const { familyData, removeMember } = useFamilyData();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1C1C1E] flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Members
        </h2>
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