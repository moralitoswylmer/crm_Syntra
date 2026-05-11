import { Field, Input } from '@base-ui/react';
import type { InputHTMLAttributes } from 'react';

interface TextFieldProps {
  name: string;
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  description?: string;
}

export function TextField({
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  required = false,
  defaultValue,
  disabled = false,
  description,
}: TextFieldProps) {
  return (
    <Field.Root name={name} className="field">
      <div className="field__header">
        <Field.Label className="field__label">{label}</Field.Label>
        {description ? <Field.Description className="field__description">{description}</Field.Description> : null}
      </div>

      <Input
        className="field__input"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
      />

      <Field.Error className="field__error" />
    </Field.Root>
  );
}
