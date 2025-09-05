import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useToast } from '@chakra-ui/react';
import { useAnalytics } from './useAnalytics';

// 📝 Form Hook - Single Responsibility Pattern
// ✅ Handles form state, validation, and submission logic
// ✅ Reusable across Contact, QuoteRequest, and other forms
// ✅ Type-safe with Zod schemas

interface UseFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  formType: 'contact' | 'quote' | 'newsletter';
  initialValues?: Partial<T>;
}

interface FormState<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  touchedFields: Set<string>;
}

export const useForm = <T extends Record<string, any>>({
  schema,
  onSubmit,
  formType,
  initialValues = {},
}: UseFormOptions<T>) => {
  const toast = useToast();
  const { trackFormSubmit } = useAnalytics();
  
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    isValid: false,
    touchedFields: new Set(),
  });

  const validateField = useCallback((name: string, value: any) => {
    try {
      const fieldSchema = schema.shape?.[name as keyof typeof schema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        return null; // No error
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Invalid value';
      }
    }
    return null;
  }, [schema]);

  const validateForm = useCallback((values: Partial<T>) => {
    try {
      schema.parse(values);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        return { isValid: false, errors };
      }
    }
    return { isValid: false, errors: { form: 'Validation failed' } };
  }, [schema]);

  const setValue = useCallback((name: string, value: any) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const fieldError = validateField(name, value);
      const newErrors = { ...prev.errors };
      
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      
      const { isValid } = validateForm(newValues);
      
      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        isValid,
        touchedFields: new Set([...prev.touchedFields, name]),
      };
    });
  }, [validateField, validateForm]);

  const setFieldTouched = useCallback((name: string) => {
    setFormState(prev => ({
      ...prev,
      touchedFields: new Set([...prev.touchedFields, name]),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateForm(formState.values);
    
    if (!isValid) {
      setFormState(prev => ({ ...prev, errors }));
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os erros no formulário.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await onSubmit(formState.values as T);
      
      // Track successful submission
      trackFormSubmit(formType, formState.values);
      
      toast({
        title: 'Sucesso!',
        description: formType === 'contact' 
          ? 'Mensagem enviada com sucesso!' 
          : 'Solicitação enviada com sucesso!',
        status: 'success',
        duration: 5000,
      });
      
      // Reset form
      setFormState({
        values: initialValues,
        errors: {},
        isSubmitting: false,
        isValid: false,
        touchedFields: new Set(),
      });
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Tente novamente.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.values, validateForm, onSubmit, trackFormSubmit, formType, toast, initialValues]);

  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
      isValid: false,
      touchedFields: new Set(),
    });
  }, [initialValues]);

  const getFieldProps = useCallback((name: string) => ({
    value: formState.values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(name, e.target.value);
    },
    onBlur: () => setFieldTouched(name),
    isInvalid: formState.touchedFields.has(name) && !!formState.errors[name],
    errorMessage: formState.touchedFields.has(name) ? formState.errors[name] : undefined,
  }), [formState.values, formState.errors, formState.touchedFields, setValue, setFieldTouched]);

  return {
    values: formState.values,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    getFieldProps,
  };
};