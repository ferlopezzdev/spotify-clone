'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Search, LogOut, ChevronDown } from 'lucide-react';
import { SpotifyUserProfile } from '@/types/api-response/me.types';
import { logout } from '@/app/actions/logout.action';

interface HeaderProps {
  user: SpotifyUserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ 
  user, 
  searchQuery, 
  onSearchChange, 
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar canciones"
              className="w-[90%] pl-10 pr-4 py-2 bg-gray-800 text-white border-gray-700 focus:border-green-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.images[0]?.url} />
            <AvatarFallback className="bg-green-500 text-black text-xs">
              {getInitials(user.display_name || 'U')}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-lg"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.images[0]?.url} />
                  <AvatarFallback className="bg-green-500 text-black text-xs">
                    {getInitials(user.display_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium text-white max-w-24 truncate">
                  {user.display_name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white">{user.display_name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-gray-800 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}