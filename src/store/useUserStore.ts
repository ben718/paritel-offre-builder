
/**
 * Store global pour la gestion des utilisateurs
 * Utilisant Zustand pour une gestion d'état simple et performante
 */
import { create } from 'zustand';
import { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  UserData,
  UserStatus
} from '@/services/UserService';

interface UserState {
  users: UserData[];
  selectedUser: UserData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllUsers: () => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  addUser: (userData: Omit<UserData, 'created_at' | 'updated_at'> & { id: string }) => Promise<void>;
  updateUserData: (userId: string, userData: Partial<UserData>) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  resetError: () => void;
}

/**
 * Store pour centraliser la gestion des utilisateurs
 * @returns {Object} Actions et état pour la gestion des utilisateurs
 */
export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await fetchUsers();
      set({ users, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await fetchUserById(userId);
      set({ selectedUser: user, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors du chargement de l'utilisateur ${userId}`;
      set({ error: errorMessage, isLoading: false });
    }
  },

  addUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await createUser(userData);
      if (newUser) {
        set(state => ({ 
          users: [...state.users, newUser],
          isLoading: false
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors de la création de l'utilisateur`;
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateUserData: async (userId: string, userData: Partial<UserData>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await updateUser(userId, userData);
      if (updatedUser) {
        // Mettre à jour la liste des utilisateurs et l'utilisateur sélectionné si nécessaire
        set(state => ({
          users: state.users.map(user => user.id === userId ? updatedUser : user),
          selectedUser: state.selectedUser?.id === userId ? updatedUser : state.selectedUser,
          isLoading: false
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors de la mise à jour de l'utilisateur ${userId}`;
      set({ error: errorMessage, isLoading: false });
    }
  },

  removeUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await deleteUser(userId);
      if (success) {
        set(state => ({ 
          users: state.users.filter(user => user.id !== userId),
          selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
          isLoading: false
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors de la suppression de l'utilisateur ${userId}`;
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateUserStatus: async (userId: string, status: UserStatus) => {
    set({ isLoading: true, error: null });
    try {
      // Utiliser la méthode générale updateUserData pour éviter la duplication de code
      await get().updateUserData(userId, { status });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors de la mise à jour du statut de l'utilisateur ${userId}`;
      set({ error: errorMessage, isLoading: false });
    }
  },

  resetError: () => set({ error: null })
}));
