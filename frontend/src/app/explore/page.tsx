"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Mountain,
  Heart,
  MessageCircle,
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { Post } from "@/types";
import { postService } from "@/lib/api";

export default function ExplorePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAdventureType, setSelectedAdventureType] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await postService.getAllPosts(0, 50);
      setPosts(postsData);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedLocation && !selectedAdventureType) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await postService.searchPosts(
        selectedLocation || searchQuery,
        selectedAdventureType
      );
      setPosts(searchResults);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedAdventureType("");
    setSelectedDifficulty("");
    loadPosts();
  };

  const handleDeletePost = async (postId: number, postTitle: string) => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la aventura "${postTitle}"?\n\nEsta acción no se puede deshacer.`
    );

    if (isConfirmed) {
      try {
        await postService.deletePost(postId);
        // Recargar la lista de posts
        loadPosts();
        alert("Aventura eliminada exitosamente");
      } catch (error) {
        console.error("Error eliminando la aventura:", error);
        alert("Error al eliminar la aventura. Inténtalo de nuevo.");
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedDifficulty && post.difficultyLevel !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const adventureTypes = [
    "Turismo",
    "Playa",
    "Senderismo",
    "Aventura",
    "Cultural",
    "Gastronómico",
  ];
  const difficultyLevels = ["Fácil", "Intermedio", "Difícil"];
  const locations = [
    "La Quebrada",
    "Playa Revolcadero",
    "Cerro de la Muerte",
    "Acapulco",
    "Puerto Marqués",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explorar Aventuras
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre increíbles aventuras en Acapulco y sus alrededores.
              Filtra por ubicación, tipo de actividad y nivel de dificultad.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar aventuras, ubicaciones, tipos de actividad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas las ubicaciones</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Adventure Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Aventura
                  </label>
                  <select
                    value={selectedAdventureType}
                    onChange={(e) => setSelectedAdventureType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    {adventureTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Dificultad
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los niveles</option>
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Resultados ({filteredPosts.length})
          </h2>
          {filteredPosts.length > 0 && (
            <div className="text-sm text-gray-500">
              Mostrando {filteredPosts.length} aventuras
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando aventuras...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.photos && post.photos.length > 0 && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={post.photos[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.difficultyLevel && (
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            post.difficultyLevel === "Fácil"
                              ? "bg-green-100 text-green-800"
                              : post.difficultyLevel === "Intermedio"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {post.difficultyLevel}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      {post.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  {post.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {post.adventureType && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mountain className="w-4 h-4 mr-2" />
                        {post.adventureType}
                      </div>
                    )}
                    {post.estimatedDuration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {post.estimatedDuration}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.likesCount}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.commentsCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/edit/${post.id}`)}
                        className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </button>
                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("es-MX")}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No se encontraron aventuras con los filtros seleccionados
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
