"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mountain, Camera, Upload, X, Plus, Save } from "lucide-react";
import { CreatePostRequest } from "@/types";
import { postService } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateAdventurePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    description: "",
    location: "",
    adventureType: "",
    difficultyLevel: "",
    estimatedDuration: "",
    userId: 1, // Temporal - debería venir del contexto de autenticación
    userName: "Antonio", // Temporal - debería venir del contexto de autenticación
    photos: [],
  });
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const adventureTypes = [
    "Turismo",
    "Playa",
    "Senderismo",
    "Aventura",
    "Cultural",
    "Gastronómico",
    "Deportivo",
    "Fotográfico",
    "Histórico",
  ];

  const difficultyLevels = ["Fácil", "Intermedio", "Difícil"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim() && !photoUrls.includes(newPhotoUrl.trim())) {
      setPhotoUrls((prev) => [...prev, newPhotoUrl.trim()]);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl.trim()],
      }));
      setNewPhotoUrl("");
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(newPhotos);
    setFormData((prev) => ({
      ...prev,
      photos: newPhotos,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }
    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es obligatoria";
    }
    if (!formData.adventureType) {
      newErrors.adventureType = "Selecciona un tipo de aventura";
    }
    if (!formData.difficultyLevel) {
      newErrors.difficultyLevel = "Selecciona un nivel de dificultad";
    }
    if (!formData.estimatedDuration.trim()) {
      newErrors.estimatedDuration = "La duración estimada es obligatoria";
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
      await postService.createPost(formData);

      // Redirect to explore page after successful creation
      router.push("/explore");
    } catch (error) {
      console.error("Error creando la aventura:", error);
      setErrors({ submit: "Error al crear la aventura. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crear Nueva Aventura
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comparte tu experiencia increíble con la comunidad de aventureros.
              Cuéntanos sobre tu aventura, agrega fotos y detalles únicos.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Título de la Aventura *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Mi increíble experiencia en La Quebrada"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe tu aventura, qué hiciste, qué sentiste, consejos para otros aventureros..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location and Adventure Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ubicación *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ej: La Quebrada, Acapulco"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="adventureType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de Aventura *
                </label>
                <select
                  id="adventureType"
                  name="adventureType"
                  value={formData.adventureType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.adventureType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona un tipo</option>
                  {adventureTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.adventureType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.adventureType}
                  </p>
                )}
              </div>
            </div>

            {/* Difficulty and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="difficultyLevel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nivel de Dificultad *
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.difficultyLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona el nivel</option>
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.difficultyLevel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.difficultyLevel}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="estimatedDuration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Duración Estimada *
                </label>
                <input
                  type="text"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  placeholder="Ej: 2 horas, 1 día, 3 días"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.estimatedDuration
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.estimatedDuration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.estimatedDuration}
                  </p>
                )}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos de la Aventura
              </label>
              <div className="space-y-4">
                {/* Add Photo Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="URL de la imagen (ej: https://example.com/foto.jpg)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </button>
                </div>

                {/* Photo Preview */}
                {photoUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photoUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300x200?text=Error+de+imagen";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Aventura
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
