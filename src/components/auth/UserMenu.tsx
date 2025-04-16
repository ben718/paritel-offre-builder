
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Settings, 
  UserCog,
  Shield,
  Code,
  Wrench
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

const UserMenu = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Helper function to check if the user has a certain role
  const hasRole = (role: string) => userProfile?.roles.includes(role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (!userProfile) {
    return (
      <button
        className="flex items-center p-1 text-gray-600 hover:text-paritel-primary"
        onClick={() => navigate('/login')}
      >
        <User className="w-5 h-5" />
      </button>
    );
  }

  const initials = userProfile.full_name
    ? userProfile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : userProfile.email[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center p-1 text-gray-600 hover:text-paritel-primary">
          <div className="w-8 h-8 bg-paritel-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile.full_name || userProfile.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>

          {/* Conditional rendering based on roles */}
          {hasRole('admin') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('/users')}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Gestion des utilisateurs</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/administration')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </DropdownMenuItem>
            </>
          )}

          {hasRole('superadmin') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('/site-builder')}>
                <Wrench className="mr-2 h-4 w-4" />
                <span>Concepteur de Site</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/code-editor')}>
                <Code className="mr-2 h-4 w-4" />
                <span>Éditeur de Code</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
