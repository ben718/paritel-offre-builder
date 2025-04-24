
/**
 * Hook personnalisé pour la validation des formulaires
 * Fournit des fonctionnalités de validation réutilisables
 */
import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean;
  message: string;
};

type FieldValidators<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Hook personnalisé pour valider des formulaires
 * @template T Type des valeurs du formulaire
 * @param {T} initialValues Valeurs initiales du formulaire
 * @param {FieldValidators<T>} validators Règles de validation pour chaque champ
 * @returns {Object} Fonctions et état pour gérer la validation de formulaire
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validators: FieldValidators<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  /**
   * Valide un champ spécifique
   * @param {keyof T} field Nom du champ à valider
   * @param {T[keyof T]} value Valeur à valider
   * @returns {string|undefined} Message d'erreur ou undefined si valide
   */
  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const fieldValidators = validators[field];
      
      if (!fieldValidators) return undefined;
      
      for (const validator of fieldValidators) {
        if (!validator.validate(value, values)) {
          return validator.message;
        }
      }
      
      return undefined;
    },
    [validators, values]
  );

  /**
   * Gère le changement de valeur d'un champ
   * @param {keyof T} field Nom du champ modifié
   * @param {T[keyof T]} value Nouvelle valeur
   */
  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      const newValues = { ...values, [field]: value };
      setValues(newValues);
      
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField, values]
  );

  /**
   * Marque un champ comme touché et le valide
   * @param {keyof T} field Nom du champ
   */
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, values[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    [validateField, values]
  );

  /**
   * Valide tous les champs du formulaire
   * @returns {boolean} true si le formulaire est valide, false sinon
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;
    
    // Marquer tous les champs comme touchés
    const newTouched = {} as Record<keyof T, boolean>;
    
    Object.keys(validators).forEach(key => {
      const field = key as keyof T;
      newTouched[field] = true;
      const error = validateField(field, values[field]);
      
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  }, [validateField, validators, values]);

  /**
   * Réinitialise le formulaire à ses valeurs initiales
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
}

/**
 * Règles de validation réutilisables
 */
export const ValidationRules = {
  required: (message: string = "Ce champ est requis"): ValidationRule<any> => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message
  }),
  
  minLength: (min: number, message: string = `Minimum ${min} caractères requis`): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message
  }),
  
  maxLength: (max: number, message: string = `Maximum ${max} caractères autorisés`): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message
  }),
  
  email: (message: string = "Email invalide"): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  pattern: (pattern: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => pattern.test(value),
    message
  }),
  
  match: (fieldToMatch: string, message: string): ValidationRule<any> => ({
    validate: (value, formValues) => formValues && value === formValues[fieldToMatch],
    message
  }),
  
  number: (message: string = "Doit être un nombre"): ValidationRule<any> => ({
    validate: (value) => !isNaN(Number(value)),
    message
  }),
  
  min: (min: number, message: string = `Doit être au moins ${min}`): ValidationRule<number> => ({
    validate: (value) => Number(value) >= min,
    message
  }),
  
  max: (max: number, message: string = `Doit être au maximum ${max}`): ValidationRule<number> => ({
    validate: (value) => Number(value) <= max,
    message
  })
};
