
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  loginTab: React.ReactNode;
  signupTab: React.ReactNode;
  resetPasswordTab: React.ReactNode;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  onTabChange,
  loginTab,
  signupTab,
  resetPasswordTab
}) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
        <TabsTrigger value="reset">Reset Password</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        {loginTab}
      </TabsContent>
      
      <TabsContent value="signup">
        {signupTab}
      </TabsContent>

      <TabsContent value="reset">
        {resetPasswordTab}
      </TabsContent>
    </Tabs>
  );
};
