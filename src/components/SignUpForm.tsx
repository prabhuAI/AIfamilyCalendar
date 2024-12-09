import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SignUpForm = ({ onBack }: { onBack: () => void }) => {
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const { toast } = useToast();

  const validateFullName = (name: string) => {
    return name.length > 0 && name.length <= 16;
  };

  const validateNickname = (nick: string) => {
    return nick.length > 0 && nick.length <= 6;
  };

  useEffect(() => {
    setIsFullNameValid(validateFullName(fullName));
  }, [fullName]);

  useEffect(() => {
    setIsNicknameValid(validateNickname(nickname));
  }, [nickname]);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullNameValid || !isNicknameValid || !passwordsMatch) {
      toast({
        title: "Validation Error",
        description: "Please check all requirements",
        variant: "destructive",
      });
      return;
    }

    const email = (e.target as any).email.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          nickname: nickname,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account created successfully! Please check your email to verify your account.",
    });
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name (max 16 characters)
          {fullName && (
            isFullNameValid ? 
              <Check className="inline-block ml-2 h-4 w-4 text-green-500" /> : 
              <X className="inline-block ml-2 h-4 w-4 text-red-500" />
          )}
        </Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={16}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nickname">
          Nickname (max 6 characters) - Will be displayed in calendar
          {nickname && (
            isNicknameValid ? 
              <Check className="inline-block ml-2 h-4 w-4 text-green-500" /> : 
              <X className="inline-block ml-2 h-4 w-4 text-red-500" />
          )}
        </Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password
          {password && confirmPassword && (
            passwordsMatch ? 
              <Check className="inline-block ml-2 h-4 w-4 text-green-500" /> : 
              <X className="inline-block ml-2 h-4 w-4 text-red-500" />
          )}
        </Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
      </div>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onBack}
      >
        Back to Login
      </Button>
    </form>
  );
};