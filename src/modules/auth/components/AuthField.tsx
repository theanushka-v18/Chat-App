import { useState } from "react";
import type { ChangeEvent } from "react";
import { LuEye, LuEyeOff, LuLock, LuMail, LuAtSign } from "react-icons/lu";
import { PasswordInput, TextInput } from "@mantine/core";

interface IAuthFieldProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  isPassword?: boolean;
  autoComplete?: string;
  icon?: "mail" | "lock" | "user";
  required?: boolean;
  disabled?: boolean;
}

const ICONS = {
  mail: LuMail,
  lock: LuLock,
  user: LuAtSign,
};

/**
 * Shared auth input: labelled, icon-prefixed, full width and keyboard friendly
 * on every screen size.
 */
const AuthField = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  type,
  isPassword = false,
  autoComplete,
  icon,
  required = false,
  disabled = false,
}: IAuthFieldProps) => {
  const [revealed, setRevealed] = useState(false);
  const Icon = icon ? ICONS[icon] : undefined;

  // Conditional spreads keep optional props out of the object so Mantine's
  // component props are never handed an explicit `undefined`.
  const shared = {
    id,
    name,
    value,
    onChange,
    ...(type ? { type } : {}),
    ...(label ? { label } : {}),
    ...(placeholder ? { placeholder } : {}),
    ...(autoComplete ? { autoComplete } : {}),
    ...(required ? { required: true } : {}),
    ...(disabled ? { disabled: true } : {}),
    ...(Icon
      ? {
          leftSection: <Icon size={18} />,
          leftSectionPointerEvents: "none" as const,
        }
      : {}),
  };

  if (isPassword) {
    return (
      <PasswordInput
        {...shared}
        visible={revealed}
        onVisibilityChange={setRevealed}
        visibilityToggleIcon={(isVisible) =>
          isVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />
        }
      />
    );
  }

  return <TextInput {...shared} />;
};

export default AuthField;
