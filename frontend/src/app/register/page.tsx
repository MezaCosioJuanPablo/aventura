"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Mountain,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { RegisterRequest } from "@/types";
import { userService } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check password strength
    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await userService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store user info in localStorage (temporary solution)
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home page after successful registration
      router.push("/");
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors({ submit: "Error al crear la cuenta. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength <= 2) return "text-red-500";
    if (strength <= 3) return "text-yellow-500";
    if (strength <= 4) return "text-blue-500";
    return "text-green-500";
  };

  const getPasswordStrengthText = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength <= 2) return "Débil";
    if (strength <= 3) return "Regular";
    if (strength <= 4) return "Buena";
    return "Excelente";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Mountain className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Únete a la aventura
          </h2>
          <p className="text-gray-600">
            Crea tu cuenta y comienza a explorar con nosotros
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="tu_usuario"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Fortaleza de la contraseña:
                    </span>
                    <span
                      className={`text-sm font-medium ${getPasswordStrengthColor()}`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${
                          passwordStrength.length
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.length
                            ? "text-gray-700"
                            : "text-gray-500"
                        }
                      >
                        Al menos 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${
                          passwordStrength.uppercase
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.uppercase
                            ? "text-gray-700"
                            : "text-gray-500"
                        }
                      >
                        Una letra mayúscula
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${
                          passwordStrength.lowercase
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.lowercase
                            ? "text-gray-700"
                            : "text-gray-500"
                        }
                      >
                        Una letra minúscula
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${
                          passwordStrength.number
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.number
                            ? "text-gray-700"
                            : "text-gray-500"
                        }
                      >
                        Un número
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${
                          passwordStrength.special
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.special
                            ? "text-gray-700"
                            : "text-gray-500"
                        }
                      >
                        Un carácter especial
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma tu contraseña"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  Acepto los{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    política de privacidad
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
