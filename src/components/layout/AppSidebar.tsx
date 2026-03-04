import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, Search, Calendar, MessageCircle, Users, User, Settings, 
  HelpCircle, FileText, Shield, ChevronDown, X 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Member Directory", url: "/discover", icon: Search },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Messages", url: "/messages", icon: MessageCircle },
];

const accountPages = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Edit Profile", url: "/edit-profile", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

const subPages = [
  { title: "Contact", url: "/help-support", icon: HelpCircle },
  { title: "Community Guidelines", url: "/community-guidelines", icon: Users },
  { title: "Terms of Service", url: "/terms-of-service", icon: FileText },
  { title: "Privacy Policy", url: "/privacy-policy", icon: Shield },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: typeof accountPages) => items.some(item => isActive(item.url));
  const isCollapsed = state === "collapsed";

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 w-full transition-colors border border-border/50 rounded-lg ${
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-primary/30" 
        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:border-primary/20"
    }`;

  return (
    <Sidebar className="transition-all duration-300 ease-in-out" collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground overflow-hidden">
        {/* Close button when expanded, expand button when collapsed */}
        <div className="flex justify-end p-2 border-b border-sidebar-border">
          {!isCollapsed ? (
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4 text-sidebar-foreground" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-sidebar-accent rounded-md transition-colors mx-auto"
              title="Expand sidebar"
            >
              <ChevronDown className="w-4 h-4 text-sidebar-foreground rotate-90" />
            </button>
          )}
        </div>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 transition-opacity duration-200">
            <span className={`${!isCollapsed ? "opacity-100 animate-fade-in" : "opacity-0"} transition-opacity duration-200`}>
              Navigation
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName}>
                       <item.icon className="w-4 h-4 flex-shrink-0 transition-all duration-200 text-icon-color" />
                      <span className={`${
                        !isCollapsed 
                          ? "opacity-100 translate-x-0 animate-fade-in" 
                          : "opacity-0 -translate-x-2"
                      } transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Pages Dropdown */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isCollapsed ? (
                // When collapsed, show clickable icon that navigates to profile
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/profile" className={getNavClassName}>
                      <User className="w-4 h-4 flex-shrink-0 transition-all duration-200 text-icon-color" />
                      <span className="opacity-0 -translate-x-2 transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden">
                        Profile
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                // When expanded, show collapsible dropdown
                <Collapsible defaultOpen={isGroupActive(accountPages)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between group">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 transition-all duration-200 text-icon-color" />
                          <span className="opacity-100 translate-x-0 animate-fade-in transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden">
                            Account
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 transition-all duration-200 ease-in-out opacity-100 rotate-0 group-data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <SidebarMenuSub>
                        {accountPages.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={item.url} className={getNavClassName}>
                                <item.icon className="w-4 h-4 text-icon-color" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support & Legal Pages */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 transition-opacity duration-200">
            <span className={`${!isCollapsed ? "opacity-100 animate-fade-in" : "opacity-0"} transition-opacity duration-200`}>
              Support
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {subPages.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="w-4 h-4 flex-shrink-0 transition-all duration-200 text-icon-color" />
                      <span className={`${
                        !isCollapsed 
                          ? "opacity-100 translate-x-0 animate-fade-in" 
                          : "opacity-0 -translate-x-2"
                      } transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}