"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  Mountain,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Filter,
  UserPlus,
  Trophy,
  Calendar,
  Star,
  Camera,
  Globe,
} from "lucide-react";
import { User, Post } from "@/types";
import { userService, postService } from "@/lib/api";

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, postsData] = await Promise.all([
        userService.getAllUsers(),
        postService.getAllPosts(0, 20),
      ]);
      setUsers(usersData);
      setPosts(postsData);
    } catch (error) {
      console.error("Error cargando datos de la comunidad:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementar búsqueda en tiempo real
  };

  const filteredUsers = users.filter((user) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "adventurers" && user.postsCount > 0) return true;
    if (selectedFilter === "new" && user.postsCount === 0) return true;
    return true;
  });

  const filteredPosts = posts.filter((post) => {
    if (
      searchQuery &&
      !post.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getTopAdventurers = () => {
    return users
      .filter((user) => user.postsCount > 0)
      .sort((a, b) => (b.postsCount || 0) - (a.postsCount || 0))
      .slice(0, 5);
  };

  const getRecentActivity = () => {
    return posts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  const stats = {
    totalUsers: users.length,
    totalPosts: posts.length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likesCount || 0), 0),
    totalComments: posts.reduce(
      (sum, post) => sum + (post.commentsCount || 0),
      0
    ),
  };

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
              Comunidad de Aventureros
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecta con otros aventureros, comparte experiencias y descubre
              nuevas personas que comparten tu pasión por la aventura en
              Acapulco.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-blue-100">Aventureros</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <Mountain className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <div className="text-blue-100">Aventuras</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <div className="text-blue-100">Me gusta</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <div className="text-blue-100">Comentarios</div>
            </motion.div>
          </div>
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
                  placeholder="Buscar aventureros, aventuras, ubicaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedFilter("adventurers")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === "adventurers"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Aventureros Activos
                </button>
                <button
                  onClick={() => setSelectedFilter("new")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === "new"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Nuevos Miembros
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Top Adventurers */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Top Aventureros
                </h2>
              </div>

              <div className="space-y-4">
                {getTopAdventurers().map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase() || "A"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.postsCount || 0} aventuras
                      </p>
                    </div>
                    <button className="flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 mt-6"
            >
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Actividad Reciente
                </h2>
              </div>

              <div className="space-y-4">
                {getRecentActivity().map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Mountain className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Community Members */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Miembros de la Comunidad ({filteredUsers.length})
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando comunidad...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {user.username?.charAt(0).toUpperCase() || "A"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {user.username}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                          {user.location && (
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                {user.location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            {user.postsCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">Aventuras</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            {user.followersCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            Seguidores
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            {user.followingCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">Siguiendo</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Seguir
                        </button>
                        <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No se encontraron miembros con los filtros seleccionados
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
