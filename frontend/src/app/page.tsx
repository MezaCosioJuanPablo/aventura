"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mountain,
  Camera,
  Heart,
  MessageCircle,
  Search,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";
import { Post } from "@/types";
import { postService } from "@/lib/api";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await postService.getAllPosts(0, 6);
      setPosts(postsData);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await postService.searchPosts(
        searchQuery,
        searchQuery
      );
      setPosts(searchResults);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Descubre la
              <span className="block text-yellow-300">Aventura</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Conecta con aventureros, comparte experiencias increíbles y
              encuentra tu próxima aventura en Acapulco y sus alrededores
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
                <input
                  type="text"
                  placeholder="Buscar aventuras, ubicaciones, tipos de actividad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-transparent text-white placeholder-white/70 px-6 py-3 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold">100+</div>
                <div className="text-white/80">Aventuras Compartidas</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <Users className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/80">Aventureros Activos</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center"
              >
                <Globe className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold">50+</div>
                <div className="text-white/80">Ubicaciones Únicas</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Aventura?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma te conecta con la comunidad de aventureros más
              apasionada de Acapulco
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Descubre Lugares Únicos
              </h3>
              <p className="text-gray-600">
                Explora ubicaciones secretas y rutas menos conocidas que solo
                los locales conocen
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Conecta con Aventureros
              </h3>
              <p className="text-gray-600">
                Únete a una comunidad apasionada y comparte experiencias con
                personas que aman la aventura
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comparte tus Experiencias
              </h3>
              <p className="text-gray-600">
                Documenta y comparte tus aventuras con fotos, historias y
                consejos para otros aventureros
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Aventuras Recientes
            </h2>
            <p className="text-xl text-gray-600">
              Descubre las últimas aventuras compartidas por nuestra comunidad
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando aventuras...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {post.photos && post.photos.length > 0 && (
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={post.photos[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
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

                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("es-MX")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron aventuras</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
