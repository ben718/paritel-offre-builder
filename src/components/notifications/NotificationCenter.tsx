
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  FileText, 
  UserPlus, 
  Package, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: 'system' | 'offer' | 'product';
  read: boolean;
  date: Date;
}

// Mock data for notifications
const getMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      title: 'Nouvelle offre acceptée',
      message: 'L\'offre pour Hôtel Le Majestic a été acceptée',
      type: 'success',
      category: 'offer',
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '2',
      title: 'Mise à jour requise',
      message: 'Veuillez mettre à jour vos informations de profil',
      type: 'info',
      category: 'system',
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: '3',
      title: 'Nouvelle demande d\'accès',
      message: 'Un nouvel utilisateur a demandé l\'accès à la plateforme',
      type: 'info',
      category: 'system',
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
      id: '4',
      title: 'Offre refusée',
      message: 'L\'offre pour Restaurant La Bonne Table a été refusée',
      type: 'error',
      category: 'offer',
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
    },
    {
      id: '5',
      title: 'Nouveaux produits disponibles',
      message: '14 nouveaux produits ont été ajoutés au catalogue',
      type: 'info',
      category: 'product',
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: '6',
      title: 'Maintenance planifiée',
      message: 'Une maintenance est prévue le 20/04 à 22h',
      type: 'warning',
      category: 'system',
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 36) // 1.5 days ago
    }
  ];
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Initialize notifications from "API"
    setNotifications(getMockNotifications());
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.category === activeTab;
  });
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };
  
  const getNotificationIcon = (type: NotificationType, category: string) => {
    // First check by type
    if (type === 'success') return <Check className="h-4 w-4 text-green-500" />;
    if (type === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (type === 'warning') return <AlertCircle className="h-4 w-4 text-amber-500" />;
    
    // Then by category for info type
    if (category === 'offer') return <FileText className="h-4 w-4 text-blue-500" />;
    if (category === 'product') return <Package className="h-4 w-4 text-purple-500" />;
    if (category === 'system') return <Info className="h-4 w-4 text-blue-500" />;
    
    // Default
    return <Info className="h-4 w-4 text-blue-500" />;
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours} h`;
    } else if (diffDays === 1) {
      return `hier`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-paritel-primary">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-paritel-danger text-white rounded-full text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0 mr-4" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              className="h-auto p-1 text-xs text-gray-500 hover:text-paritel-primary"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="all" className="flex-1 text-xs">
              Tout
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 text-xs">
              Non lu{unreadCount > 0 && <span className="ml-1 text-xs">({unreadCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="offer" className="flex-1 text-xs">
              Offres
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-1 text-xs">
              Système
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="max-h-[350px] overflow-y-auto p-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50 hover:bg-blue-50/80' : ''}`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type, notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm truncate pr-2">{notification.title}</p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(notification.date)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-1 mt-2">
                      {!notification.read && (
                        <Button 
                          size="sm"
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Marquer comme lu
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        variant="ghost" 
                        className="h-7 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
