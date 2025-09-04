import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Video,
  ThumbsUp,
  MessageCircle,
  Clock,
  Edit,
  Trash,
  X,
  Send,
  Plus,
  AlertCircle,
  Loader2,
  Filter,
  Tag,
  SortAsc,
  SortDesc,
  Share,
  Bookmark,
  ChevronDown,
  Save,
  User,
} from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

const TOPICS = [
  "mechanics",
  "thermodynamics",
  "electromagnetism",
  "modern-physics",
  "optics",
  "quantum-physics",
  "waves",
  "nuclear-physics",
];

const MasonryDoubts = () => {
  // State management
  const [doubts, setDoubts] = useState([]);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewDoubtForm, setShowNewDoubtForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [bookmarkedDoubts, setBookmarkedDoubts] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: TOPICS[0],
    tags: [],
    needsMeeting: false,
    tempTag: "",
  });

  // Load user's bookmarks
  useEffect(() => {
    if (!auth.currentUser) return;

    const loadBookmarks = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setBookmarkedDoubts(userDoc.data().bookmarks || []);
        } else {
          await updateDoc(userRef, { bookmarks: [] });
        }
      } catch (err) {
        console.error("Error loading bookmarks:", err);
      }
    };

    loadBookmarks();
  }, []);

  // Fetch doubts with filtering and sorting
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const doubtRef = collection(db, "doubts");
        let q = query(doubtRef);

        if (selectedTopic !== "all") {
          q = query(q, where("topic", "==", selectedTopic));
        }

        switch (sortBy) {
          case "date":
            q = query(q, orderBy("createdAt", sortOrder));
            break;
          case "solutions":
            q = query(q, orderBy("solutionsCount", sortOrder));
            break;
          case "likes":
            q = query(q, orderBy("likesCount", sortOrder));
            break;
          default:
            q = query(q, orderBy("createdAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let doubtList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt:
              doc.data().createdAt?.toDate().toISOString() ||
              new Date().toISOString(),
          }));

          // Apply search filter
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            doubtList = doubtList.filter(
              (doubt) =>
                doubt.title.toLowerCase().includes(searchLower) ||
                doubt.description.toLowerCase().includes(searchLower) ||
                doubt.tags.some((tag) =>
                  tag.toLowerCase().includes(searchLower)
                )
            );
          }

          // Filter bookmarks if needed
          if (showBookmarksOnly) {
            doubtList = doubtList.filter((doubt) =>
              bookmarkedDoubts.includes(doubt.id)
            );
          }

          setDoubts(doubtList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        setError("Error fetching doubts");
        setLoading(false);
      }
    };

    fetchDoubts();
  }, [
    searchQuery,
    selectedTopic,
    sortBy,
    sortOrder,
    showBookmarksOnly,
    bookmarkedDoubts,
  ]);

  // Form handling
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (!formData.tempTag.trim()) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...new Set([...prev.tags, prev.tempTag.trim().toLowerCase()])],
      tempTag: "",
    }));
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // CRUD Operations
  const createDoubt = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { tempTag, ...doubtData } = formData;
      await addDoc(collection(db, "doubts"), {
        ...doubtData,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: serverTimestamp(),
        solutions: [],
        likesCount: 0,
        solutionsCount: 0,
      });
      setShowNewDoubtForm(false);
      setFormData({
        title: "",
        description: "",
        topic: TOPICS[0],
        tags: [],
        needsMeeting: false,
        tempTag: "",
      });
    } catch (err) {
      setError("Error creating doubt");
    } finally {
      setLoading(false);
    }
  };

  const updateDoubt = async (e) => {
    e.preventDefault();
    if (!selectedDoubt) return;

    try {
      setLoading(true);
      const { tempTag, ...doubtData } = formData;
      const doubtRef = doc(db, "doubts", selectedDoubt.id);
      await updateDoc(doubtRef, {
        ...doubtData,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      setSelectedDoubt(null);
    } catch (err) {
      setError("Error updating doubt");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoubt = async (doubtId) => {
    if (!window.confirm("Are you sure you want to delete this doubt?")) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "doubts", doubtId));
      setSelectedDoubt(null);
    } catch (err) {
      setError("Error deleting doubt");
    } finally {
      setLoading(false);
    }
  };
  // Fixed addSolution function
  const addSolution = async (doubtId, solutionText) => {
    try {
      if (!auth.currentUser) {
        setError("You must be logged in to post a solution");
        return;
      }

      setLoading(true);
      const doubtRef = doc(db, "doubts", doubtId);

      // First get the current document to ensure we have the latest data
      const doubtDoc = await getDoc(doubtRef);
      if (!doubtDoc.exists()) {
        throw new Error("Doubt not found");
      }

      const doubtData = doubtDoc.data();
      const currentSolutions = doubtData.solutions || [];
      const currentCount = doubtData.solutionsCount || 0;

      const newSolution = {
        id: Date.now().toString(),
        text: solutionText,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        name: auth.currentUser.displayName || auth.currentUser.email, // Added name field
        createdAt: new Date().toISOString(),
        likes: [],
      };

      // Update the document with the new solution and incremented count
      await updateDoc(doubtRef, {
        solutions: [...currentSolutions, newSolution],
        solutionsCount: currentCount + 1,
      });

      // Update the local state if this is the selected doubt
      if (selectedDoubt && selectedDoubt.id === doubtId) {
        setSelectedDoubt((prev) => ({
          ...prev,
          solutions: [...(prev.solutions || []), newSolution],
          solutionsCount: (prev.solutionsCount || 0) + 1,
        }));
      }

      setLoading(false);
    } catch (err) {
      console.error("Error adding solution:", err);
      setError("Error adding solution: " + err.message);
      setLoading(false);
    }
  };

  // Utility functions
  const toggleBookmark = useCallback(
    async (doubtId) => {
      try {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);

        if (bookmarkedDoubts.includes(doubtId)) {
          await updateDoc(userRef, {
            bookmarks: arrayRemove(doubtId),
          });
          setBookmarkedDoubts((prev) => prev.filter((id) => id !== doubtId));
        } else {
          await updateDoc(userRef, {
            bookmarks: arrayUnion(doubtId),
          });
          setBookmarkedDoubts((prev) => [...prev, doubtId]);
        }
      } catch (err) {
        setError("Error updating bookmark");
      }
    },
    [bookmarkedDoubts]
  );

  const shareDoubt = async (doubt) => {
    try {
      const shareData = {
        title: doubt.title,
        text: doubt.description,
        url: `${window.location.origin}/doubts/${doubt.id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      setError("Error sharing doubt");
    }
  };

  // Components
  const SearchBar = () => (
    <div className="relative mb-6">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search doubts..."
        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] 
          transition-all duration-300 hover:border-[#FF7349]"
      />
    </div>
  );

  const FilterControls = () => (
    <div className="mb-8 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-lg animate-fade-in">
      {/* Topic Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-[#E83B00]" />
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E83B00] 
            transition-all duration-300 hover:border-[#FF7349]"
        >
          <option value="all">All Topics</option>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic.charAt(0).toUpperCase() + topic.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E83B00] 
            transition-all duration-300 hover:border-[#FF7349]"
        >
          <option value="date">Sort by Date</option>
          <option value="solutions">Sort by Solutions</option>
          <option value="likes">Sort by Likes</option>
        </select>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="p-2 rounded-lg border hover:bg-[#FF7349] hover:text-white 
            transition-all duration-300"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-5 h-5" />
          ) : (
            <SortDesc className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Bookmark Filter */}
      <button
        onClick={() => setShowBookmarksOnly((prev) => !prev)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
          transition-all duration-300
          ${
            showBookmarksOnly
              ? "bg-[#E83B00] text-white"
              : "hover:bg-[#FF7349] hover:text-white"
          }`}
      >
        <Bookmark className="w-5 h-5" />
        <span>{showBookmarksOnly ? "All Doubts" : "Bookmarks"}</span>
      </button>

      {/* Clear Filters */}
      {(selectedTopic !== "all" || sortBy !== "date" || showBookmarksOnly) && (
        <button
          onClick={() => {
            setSelectedTopic("all");
            setSortBy("date");
            setSortOrder("desc");
            setShowBookmarksOnly(false);
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#E83B00] 
            transition-colors duration-300"
        >
          <X className="w-5 h-5" />
          Clear Filters
        </button>
      )}

      {/* Applied Filters Tags */}
      {(selectedTopic !== "all" || sortBy !== "date" || showBookmarksOnly) && (
        <div className="w-full flex flex-wrap gap-2 mt-2">
          {selectedTopic !== "all" && (
            <span
              className="px-3 py-1 bg-orange-100 text-[#E83B00] rounded-full text-sm 
              flex items-center gap-2"
            >
              Topic:{" "}
              {selectedTopic.charAt(0).toUpperCase() +
                selectedTopic.slice(1).replace("-", " ")}
              <button
                onClick={() => setSelectedTopic("all")}
                className="hover:text-red-500 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {sortBy !== "date" && (
            <span
              className="px-3 py-1 bg-orange-100 text-[#E83B00] rounded-full text-sm 
              flex items-center gap-2"
            >
              Sorted by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              <button
                onClick={() => setSortBy("date")}
                className="hover:text-red-500 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {showBookmarksOnly && (
            <span
              className="px-3 py-1 bg-orange-100 text-[#E83B00] rounded-full text-sm 
              flex items-center gap-2"
            >
              Bookmarks Only
              <button
                onClick={() => setShowBookmarksOnly(false)}
                className="hover:text-red-500 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );

  const DoubtCard = ({ doubt }) => {
    const [showSolutions, setShowSolutions] = useState(false);
    const [newSolution, setNewSolution] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isBookmarked = bookmarkedDoubts.includes(doubt.id);

    // Local handler for solution submission
    const handleSolutionSubmit = async (e) => {
      e.preventDefault();
      if (!newSolution.trim()) return;

      try {
        setIsSubmitting(true);
        await addSolution(doubt.id, newSolution);
        setNewSolution("");
      } catch (err) {
        console.error("Error submitting solution:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div
        className="bg-white rounded-lg shadow-lg p-6 space-y-4 transform hover:scale-102 
        transition-all duration-300 hover:shadow-xl"
      >
        {/* Card Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{doubt.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => toggleBookmark(doubt.id)}
              className={`p-1.5 rounded-lg hover:bg-orange-50 transition-colors duration-300
                ${isBookmarked ? "text-[#E83B00]" : "text-gray-400"}`}
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? "animate-bounce" : ""}`}
              />
            </button>
            <button
              onClick={() => shareDoubt(doubt)}
              className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 transition-colors duration-300"
            >
              <Share className="w-5 h-5" />
            </button>
            {doubt.userId === auth.currentUser?.uid && (
              <>
                <button
                  onClick={() => {
                    setFormData({ ...doubt, tempTag: "" });
                    setSelectedDoubt(doubt);
                    setIsEditing(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 transition-colors duration-300"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteDoubt(doubt.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors duration-300"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 line-clamp-3">{doubt.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-full text-sm">
            {doubt.topic}
          </span>
          {doubt.tags &&
            doubt.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-orange-50 text-[#E83B00] rounded-full text-sm hover:bg-orange-100 transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
          {doubt.needsMeeting && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1">
              <Video className="w-4 h-4" />
              Meeting
            </span>
          )}
        </div>

        {/* Stats & Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {doubt.solutions?.length || 0} solutions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(doubt.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {doubt.userName || "Anonymous"}
          </span>
        </div>

        {/* Solutions Section */}
        {showSolutions && (
          <div className="space-y-4 pt-4 border-t">
            {doubt.solutions && doubt.solutions.length > 0 ? (
              doubt.solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      {solution.userName || solution.name || "Anonymous"} •{" "}
                      {new Date(solution.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-gray-400 hover:text-[#E83B00] transition-colors duration-300">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700">{solution.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No solutions yet. Be the first to contribute!
              </p>
            )}

            {/* Add Solution Form */}
            <form onSubmit={handleSolutionSubmit} className="flex gap-2">
              <input
                type="text"
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                placeholder="Add a solution..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E83B00] hover:border-[#FF7349] transition-all duration-300"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !newSolution.trim()}
                className="px-4 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        )}

        {/* Toggle Solutions Button */}
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="w-full px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 
            transition-all duration-300 flex items-center justify-center gap-2"
        >
          {showSolutions ? "Hide" : "Show"} Solutions
          <ChevronDown
            className={`w-5 h-5 transform transition-transform duration-300 ${
              showSolutions ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    );
  };

  // Main render
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
          from-[#E83B00] to-[#FF7349]"
        >
          Physics Doubts
        </h1>
        <button
          onClick={() => setShowNewDoubtForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white 
            rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 
            flex items-center gap-2"
        >
          <Plus size={20} />
          New Doubt
        </button>
      </div>

      {/* Search and Filters */}
      <SearchBar />
      <FilterControls />

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-[#E83B00]" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doubts.map((doubt) => (
            <DoubtCard key={doubt.id} doubt={doubt} />
          ))}
        </div>
      )}
      {/* Modals and Forms */}
      {/* Modal Component */}
      <div
        className={`fixed inset-0 z-50 ${
          showNewDoubtForm || isEditing ? "flex" : "hidden"
        } items-center justify-center p-4 bg-black bg-opacity-50`}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
          {/* Modal Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text text-transparent">
              {isEditing ? "Edit Doubt" : "Create New Doubt"}
            </h2>
            <button
              onClick={() => {
                setShowNewDoubtForm(false);
                setIsEditing(false);
                setFormData({
                  title: "",
                  description: "",
                  topic: TOPICS[0],
                  tags: [],
                  needsMeeting: false,
                  tempTag: "",
                });
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Modal Body - Form */}
          <form
            onSubmit={isEditing ? updateDoubt : createDoubt}
            className="p-6 space-y-6"
          >
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange(e, "title")}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349]"
                placeholder="What's your doubt about?"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange(e, "description")}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349] min-h-[150px] resize-y"
                placeholder="Describe your doubt in detail..."
                required
              />
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => handleInputChange(e, "topic")}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349]"
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() +
                      topic.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-100 text-[#E83B00] rounded-full text-sm flex items-center gap-2 animate-fade-in"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="hover:text-red-500 transition-colors duration-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.tempTag}
                  onChange={(e) => handleInputChange(e, "tempTag")}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349]"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Video Meeting Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="needsMeeting"
                checked={formData.needsMeeting}
                onChange={(e) => handleInputChange(e, "needsMeeting")}
                className="rounded text-[#E83B00] focus:ring-2 focus:ring-[#E83B00] w-5 h-5"
              />
              <label
                htmlFor="needsMeeting"
                className="text-sm text-gray-700 flex items-center gap-2"
              >
                <Video size={18} className="text-[#E83B00]" />
                Request Video Meeting
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowNewDoubtForm(false);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg 
            hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? "Update Doubt" : "Create Doubt"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success/Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 hover:text-red-900"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MasonryDoubts;
