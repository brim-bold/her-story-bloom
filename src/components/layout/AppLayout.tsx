import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { signOut } = useAuth();

  const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
                toast.error('Error signing out');
        } else {
                toast.success('Signed out successfully');
        }
  };

  return (
        <SidebarProvider>
              <div className="min-h-screen flex w-full">
                {/* Global header with trigger and sign out */}
                      <div className="flex flex-col w-full">
                        {/* Logo section */}
                                <div className="bg-background py-6 flex justify-center border-b border-border/50">
                                            <img
                                                            src="/lovable-uploads/d130797e-0ee8-4739-b734-fae4106f41f9.png"
                                                            alt="Her Story Collective Logo"
                                                            className="h-20 w-auto object-contain transition-all duration-300 dark:invert"
                                                          />
                                </div>
                                <header className="h-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border flex items-center justify-between px-4">
                                            <div className="flex items-center gap-3">
                                                          <SidebarTrigger className="p-2 hover:bg-secondary rounded-lg transition-colors border border-border/50 hover:border-primary/30" />
                                            </div>
                                            <button
                                                            onClick={handleSignOut}
                                                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                                            title="Sign Out"
                                                          >
                                                          <LogOut className="w-6 h-6 text-icon-color" />
                                            </button>
                                </header>
                                <div className="flex flex-1">
                                            <AppSidebar />
                                            <main className="flex-1 overflow-auto">
                                              {children}
                                            </main>
                                </div>
                      </div>
              </div>
        </SidebarProvider>
      );
}</SidebarProvider>
