import React from "react";
import { Check, X } from "lucide-react";

/**
 * PasswordCriteria component displays a checklist of password validation rules.
 *
 * It visually indicates whether the provided password satisfies each of the following criteria:
 *  - At least 8 characters long
 *  - Contains at least one uppercase letter
 *  - Contains at least one lowercase letter
 *  - Contains at least one number
 *  - Contains at least one special character (!@#$%^&*)
 *
 * Each rule is shown with a checkmark if valid or a cross  if not.
 */
const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", isValid: password.length >= 8 },
    { label: "At least 1 uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", isValid: /[a-z]/.test(password) },
    { label: "At least 1 number", isValid: /\d/.test(password) },
    {
      label: "At least 1 special character (!@#$%^&*)",
      isValid: /[!@#$%^&*]/.test(password),
    },
  ];

  return (
    <div className="mt-1 space-y-1">
      {criteria.map((item, index) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.isValid ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-red-500 mr-2" />
          )}
          <span className={item.isValid ? "text-gree-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Visually represents the strength of a given password.
 *
 * It evaluates the password based on the following criteria:
 *  - Minimum 8 characters
 *  - Contains both uppercase and lowercase letters
 *  - Contains at least one number
 *  - Contains at least one special character (!@#$%^&*)
 */
const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[!@#$%^&*]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-orange-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Medium";
    if (strength === 3) return "Good";
    return "Strong";
  };
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-bold text-gray-400">
          Password strength:
        </span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transitio-colors duration-300
               ${index < strength ? getColor(strength) : "bg-gray-600"}
          `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
