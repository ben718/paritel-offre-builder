import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Tag, Settings, FileText, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Définir les sections d'administration avec les rôles requis
  const adminSections = [
    {
      title: 'Gestion des Utilisateurs',
      description: 'Administrer les comptes utilisateurs et leurs rôles.',
      link: '/administration/utilisateurs',
      icon: <Users className="h-8 w-8 text-paritel-primary" />,
      roles: ['Admin'],
    },
    {
      title: 'Gestion des Catégories de la Bibliothèque',
      description: 'Définir et organiser les catégories pour les documents.',
      link: '/administration/categories-bibliotheque',
      icon: <Tag className="h-8 w-8 text-paritel-primary" />,
      roles: ['Admin', 'Chef de produit'],
    },
    {
      title: 'Gestion des Modèles de Documents',
      description: 'Créer et gérer les modèles pour la génération de documents.',
      link: '/administration/modeles',
      icon: <FileText className="h-8 w-8 text-paritel-primary" />,
      roles: ['Admin', 'Chef de produit'],
    },
    // {
    //   title: 'Paramètres Généraux',
    //   description: 'Configurer les paramètres globaux de l\'application.',
    //   link: '/administration/parametres',
    //   icon: <Settings className="h-8 w-8 text-paritel-primary" />,
    //   roles: ['Admin'],
    // },
    {
      title: 'Statistiques et Reporting',
      description: 'Consulter les indicateurs clés et les rapports d\'activité.',
      link: '/reporting',
      icon: <BarChart2 className="h-8 w-8 text-paritel-primary" />,
      roles: ['Admin', 'Chef de produit', 'Manager Commercial'],
    },
  ];

  const canAccessSection = (sectionRoles: string[]) => {
    if (!user || !user.roles) return false;
    return sectionRoles.some(role => user.roles?.includes(role));
  };

  const accessibleSections = adminSections.filter(section => canAccessSection(section.roles));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            <Settings className="mr-3 h-8 w-8" /> Administration
          </h1>
          <p className="text-lg text-gray-600">Panneau de contrôle central pour la gestion de la plateforme.</p>
        </div>
      </div>

      {accessibleSections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accessibleSections.map((section) => (
            <Link to={section.link} key={section.title} className="hover:no-underline">
              <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  {section.icon}
                  <div>
                    <CardTitle className="text-xl text-paritel-primary group-hover:underline">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Aucune section d'administration n'est accessible avec votre profil actuel.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardPage;

