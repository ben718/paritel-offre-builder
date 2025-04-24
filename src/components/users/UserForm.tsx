
/**
 * Formulaire de création/édition d'utilisateur avec validation
 * @module components/users/UserForm
 */
import React, { useEffect } from 'react';
import { useFormValidation, ValidationRules } from '@/hooks/useFormValidation';
import { UserData, UserStatus } from '@/services/UserService';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface UserFormProps {
  user?: UserData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Formulaire pour la création ou la mise à jour d'un utilisateur
 * @param {UserFormProps} props - Propriétés du composant
 * @returns {JSX.Element} Formulaire utilisateur avec validation
 */
export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { addUser, updateUserData, isLoading, error, resetError } = useUserStore();
  const { toast } = useToast();
  
  // Formulaire avec validation
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  } = useFormValidation(
    {
      full_name: user?.full_name || '',
      email: user?.email || '',
      role: user?.role || 'user',
      status: user?.status || 'active' as UserStatus,
      department: user?.department || '',
      position: user?.position || '',
      phone: user?.phone || ''
    },
    {
      full_name: [ValidationRules.required('Le nom complet est requis')],
      email: [
        ValidationRules.required('L\'email est requis'),
        ValidationRules.email('Format d\'email invalide')
      ],
      role: [ValidationRules.required('Le rôle est requis')],
    }
  );

  // Initialisation du formulaire avec les données existantes
  useEffect(() => {
    if (user) {
      setValues({
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
        department: user.department || '',
        position: user.position || '',
        phone: user.phone || ''
      });
    }
  }, [user, setValues]);

  // Traitement des erreurs API
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
      resetError();
    }
  }, [error, toast, resetError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation",
        description: "Veuillez corriger les erreurs du formulaire",
        variant: "warning"
      });
      return;
    }
    
    try {
      if (user) {
        // Mode édition
        await updateUserData(user.id, values);
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
          variant: "success"
        });
      } else {
        // Mode création
        // Note: Dans un cas réel, l'ID serait généré par le backend
        const userData = {
          ...values,
          id: crypto.randomUUID()
        };
        await addUser(userData);
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
          variant: "success"
        });
        resetForm();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form>
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            <FormField
              name="full_name"
              render={() => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      value={values.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      onBlur={() => handleBlur('full_name')}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {touched.full_name && errors.full_name && (
                    <FormMessage>{errors.full_name}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={values.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {touched.email && errors.email && (
                    <FormMessage>{errors.email}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="role"
                render={() => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select 
                      value={values.role} 
                      onValueChange={(value) => handleChange('role', value)}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {touched.role && errors.role && (
                      <FormMessage>{errors.role}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              
              <FormField
                name="status"
                render={() => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      value={values.status} 
                      onValueChange={(value) => handleChange('status', value as UserStatus)}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              name="department"
              render={() => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Département"
                      value={values.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="position"
                render={() => (
                  <FormItem>
                    <FormLabel>Poste</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Poste"
                        value={values.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                name="phone"
                render={() => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+33 1 23 45 67 89"
                        value={values.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
        )}
        <Button 
          type="submit" 
          form="user-form" 
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : user ? 'Mettre à jour' : 'Créer'}
        </Button>
      </CardFooter>
    </Card>
  );
}
