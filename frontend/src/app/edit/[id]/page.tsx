"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  MapPin,
  Clock,
  Mountain,
  Users,
  Trash2,
} from "lucide-react";
import { postService } from "@/lib/api";
import { Post, CreatePostRequest } from "@/types";

export default function EditAdventurePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    description: "",
    location: "",
    adventureType: "",
    difficultyLevel: "",
    estimatedDuration: "",
    userId: 1,
    userName: "Antonio",
    photos: [],
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await postService.getPostById(id);
      setPost(postData);
      setFormData({
        title: postData.title,
        description: postData.description,
        location: postData.location,
        adventureType: postData.adventureType,
        difficultyLevel: postData.difficultyLevel,
        estimatedDuration: postData.estimatedDuration,
        userId: postData.userId,
        userName: postData.userName,
        photos: postData.photos || [],
      });
    } catch (err) {
      setError("Error al cargar la aventura");
      console.error("Error loading post:", err);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim() && !formData.photos.includes(newPhotoUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl.trim()],
      }));
      setNewPhotoUrl("");
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await postService.updatePost(id, formData);
      router.push(`/explore`);
    } catch (err) {
      setError("Error al actualizar la aventura");
      console.error("Error updating post:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: number, postTitle: string) => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la aventura "${postTitle}"?\n\nEsta acción no se puede deshacer.`
    );

    if (isConfirmed) {
      try {
        await postService.deletePost(postId);
        alert("Aventura eliminada exitosamente");
        router.push(`/explore`);
      } catch (error) {
        console.error("Error eliminando la aventura:", error);
        alert("Error al eliminar la aventura. Inténtalo de nuevo.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aventura...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aventura no encontrada</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Editar Aventura
          </h1>
          <p className="text-gray-600">
            Modifica los detalles de tu aventura &quot;{post.title}&quot;
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Título */}
            <div className="mb-6">
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Explorando las cascadas de Coyuca"
              />
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu experiencia, qué viste, cómo te sentiste..."
              />
            </div>

            {/* Ubicación */}
            <div className="mb-6">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MapPin className="inline w-4 h-4 mr-2" />
                Ubicación *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Coyuca de Benítez, Guerrero"
              />
            </div>

            {/* Tipo de Aventura y Dificultad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="adventureType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Mountain className="inline w-4 h-4 mr-2" />
                  Tipo de Aventura *
                </label>
                <select
                  id="adventureType"
                  name="adventureType"
                  value={formData.adventureType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Senderismo">Senderismo</option>
                  <option value="Playa">Playa</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Turismo">Turismo</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Gastronómico">Gastronómico</option>
                  <option value="Fotográfico">Fotográfico</option>
                  <option value="Histórico">Histórico</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="difficultyLevel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Users className="inline w-4 h-4 mr-2" />
                  Nivel de Dificultad *
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona dificultad</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Duración Estimada */}
            <div className="mb-6">
              <label
                htmlFor="estimatedDuration"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Clock className="inline w-4 h-4 mr-2" />
                Duración Estimada *
              </label>
              <input
                type="text"
                id="estimatedDuration"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 4 horas, 1 día, 2 días"
              />
            </div>

            {/* Fotos */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="inline w-4 h-4 mr-2" />
                Fotos de la Aventura
              </label>

              {/* Agregar nueva foto */}
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="URL de la imagen"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de fotos */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="inline w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeletePost(post.id, post.title)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="inline w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
