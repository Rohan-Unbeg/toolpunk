import { useContext, useState, useEffect } from "react";
import {
    FaUser,
    FaLightbulb,
    FaEdit,
    FaTrash,
    FaHeart,
    FaRegHeart,
    FaCalendarAlt,
    FaArrowLeft,
    FaCogs,
} from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { Tab } from "@headlessui/react";
import appwriteService from "../services/appwrite";
import { toast } from "react-toastify";

const Profile = () => {
    const { user, setUser, isLoading } = useContext(AuthContext);
    const [ideas, setIdeas] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempName, setTempName] = useState("");
    const [tempBio, setTempBio] = useState("");

    useEffect(() => {
        if (user) {
            setTempName(user.name);
            setTempBio(user.prefs?.bio || "");
            appwriteService
                .getUserIdeas(user.$id)
                .then(setIdeas)
                .catch(() => toast.error("Failed to load ideas"));
        }
        return () => previewUrl && URL.revokeObjectURL(previewUrl);
    }, [user, previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (
            !file ||
            !file.type.match("image.*") ||
            file.size > 5 * 1024 * 1024
        ) {
            toast.error(
                file ? "Select a valid image (<5MB)" : "No file selected"
            );
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const uploadFile = async () => {
        if (!selectedFile) return user.prefs?.picture || "";
        setIsUploading(true);
        try {
            const fileId = await appwriteService.uploadFile(selectedFile);
            return appwriteService.getFilePreview(fileId);
        } catch {
            toast.error("Image upload failed");
            return user.prefs?.picture || "";
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const name = tempName.trim();
        const bio = tempBio.trim();
        const pictureUrl = await uploadFile();
        try {
            await appwriteService.updateProfile({
                name,
                picture: pictureUrl,
                bio,
                setUser,
            });
            toast.success("Profile updated!");
            setIsEditMode(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch {
            toast.error("Update failed");
        }
    };

    const toggleFavorite = async (ideaId, favorite) => {
        try {
            await appwriteService.toggleFavorite(ideaId, favorite);
            setIdeas(
                ideas.map((i) => (i.$id === ideaId ? { ...i, favorite } : i))
            );
            toast.success(favorite ? "Favorited" : "Unfavorited");
        } catch {
            toast.error("Favorite toggle failed");
        }
    };

    const getAvatar = () => (
        <img
            src={
                previewUrl ||
                user.prefs?.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "U"
                )}&background=[var(--color-primary)]&color=fff`
            }
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow"
        />
    );

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <div className="h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isPremium = user.labels?.includes("premium");
    const favoriteIdeas = ideas.filter((idea) => idea.favorite);
    const recentIdeas = [...ideas]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-16 pb-8 px-4 transition-colors duration-200">
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-[var(--color-primary)] hover:text-primary-500 flex items-center gap-1 text-sm"
                    >
                        <FaArrowLeft /> Back
                    </Link>
                    {!isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:bg-primary-500 flex items-center gap-1 text-sm shadow-md transition-colors"
                        >
                            <FaEdit /> Edit
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-[var(--color-primary)] to-accent-400" />
                    <div className="p-4 relative">
                        <div className="absolute top-0 left-4 -translate-y-1/2">
                            {getAvatar()}
                        </div>
                        <div className="mt-10 sm:ml-28">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
                                <div>
                                    <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                                        {user.name}
                                        {isPremium && (
                                            <span className="bg-accent-100 dark:bg-accent-200 text-accent-800 dark:text-accent-900 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                <RiVipCrownFill /> Premium
                                            </span>
                                        )}
                                    </h1>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {user.email}
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                        {user.prefs?.bio || "No bio yet"}
                                    </p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                                        Joined{" "}
                                        {new Date(
                                            user.$createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                {!isEditMode && (
                                    <Link
                                        to="/projectgenerator"
                                        className="mt-2 sm:mt-0 bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:bg-primary-500 text-sm shadow-md transition-colors"
                                    >
                                        New Idea
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditMode && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 border border-[var(--color-primary)]/20">
                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-3"
                        >
                            <div>
                                <label className="block text-sm text-neutral-700 dark:text-neutral-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) =>
                                        setTempName(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-700 dark:text-neutral-300">
                                    Bio
                                </label>
                                <textarea
                                    value={tempBio}
                                    onChange={(e) => setTempBio(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    rows="3"
                                    maxLength="160"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-700 dark:text-neutral-300">
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-2">
                                    {getAvatar()}
                                    <label className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:bg-primary-500 text-sm cursor-pointer shadow-md transition-colors">
                                        {selectedFile ? "Change" : "Upload"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                            }}
                                            className="text-sm text-error-600 dark:text-error-400 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(false)}
                                    className="px-3 py-1.5 border rounded-lg text-neutral-700 dark:text-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-primary-500 text-sm shadow-md transition-colors ${
                                        isUploading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isUploading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm text-center">
                        <FaLightbulb className="text-[var(--color-primary)] text-lg mx-auto mb-1" />
                        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                            {ideas.length}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Ideas
                        </p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm text-center">
                        <FaHeart className="text-accent-400 text-lg mx-auto mb-1" />
                        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                            {favoriteIdeas.length}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Favorites
                        </p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm text-center">
                        <FaUser className="text-success-500 text-lg mx-auto mb-1" />
                        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                            {isPremium ? "∞" : "3/day"}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Limit
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 border border-[var(--color-primary)]/20">
                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
                        Your Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            to="/projectgenerator"
                            className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 p-3 rounded-lg flex flex-col gap-1"
                        >
                            <h3 className="font-semibold text-[var(--color-primary)]">
                                🎯 Project Idea Generator
                            </h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Unique project ideas for your field
                            </p>
                        </Link>
                        <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg opacity-70">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-300">
                                📄 Project Report Generator
                            </h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Coming soon
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-[var(--color-primary)]/20">
                    <Tab.Group>
                        <Tab.List className="flex border-b dark:border-neutral-700">
                            {["All Ideas", "Favorites", "Recent"].map((tab) => (
                                <Tab
                                    key={tab}
                                    className={({ selected }) =>
                                        `flex-1 py-2 text-sm font-medium ${
                                            selected
                                                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                                                : "text-neutral-500 dark:text-neutral-400"
                                        }`
                                    }
                                >
                                    {tab}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="p-3">
                            {[ideas, favoriteIdeas, recentIdeas].map(
                                (list, idx) => (
                                    <Tab.Panel key={idx}>
                                        {list.length === 0 ? (
                                            <div className="text-center py-4">
                                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                                    No{" "}
                                                    {idx === 1
                                                        ? "favorites"
                                                        : idx === 2
                                                        ? "recent ideas"
                                                        : "ideas"}{" "}
                                                    yet
                                                </p>
                                                <Link
                                                    to="/projectgenerator"
                                                    className="mt-2 inline-block bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:bg-primary-500 text-sm shadow-md transition-colors"
                                                >
                                                    Generate Ideas
                                                </Link>
                                            </div>
                                        ) : (
                                            <ul className="space-y-2">
                                                {list.map((idea) => (
                                                    <li
                                                        key={idea.$id}
                                                        className="p-2 border border-[var(--color-primary)]/20 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm text-neutral-800 dark:text-neutral-100">
                                                                    {
                                                                        idea.ideaText
                                                                    }
                                                                </p>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">
                                                                        {
                                                                            idea.branch
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded flex items-center gap-1">
                                                                        <FaCalendarAlt
                                                                            size={
                                                                                10
                                                                            }
                                                                        />{" "}
                                                                        {new Date(
                                                                            idea.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        toggleFavorite(
                                                                            idea.$id,
                                                                            !idea.favorite
                                                                        )
                                                                    }
                                                                    className="text-neutral-400 hover:text-accent-400 dark:hover:text-accent-400"
                                                                >
                                                                    {idea.favorite ? (
                                                                        <FaHeart className="text-accent-400" />
                                                                    ) : (
                                                                        <FaRegHeart />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        appwriteService
                                                                            .deleteIdea(
                                                                                idea.$id
                                                                            )
                                                                            .then(
                                                                                () => {
                                                                                    setIdeas(
                                                                                        ideas.filter(
                                                                                            (
                                                                                                i
                                                                                            ) =>
                                                                                                i.$id !==
                                                                                                idea.$id
                                                                                        )
                                                                                    );
                                                                                    toast.success(
                                                                                        "Idea deleted"
                                                                                    );
                                                                                }
                                                                            )
                                                                            .catch(
                                                                                () =>
                                                                                    toast.error(
                                                                                        "Failed to delete"
                                                                                    )
                                                                            )
                                                                    }
                                                                    className="text-neutral-400 hover:text-error-600 dark:hover:text-error-400"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Tab.Panel>
                                )
                            )}
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                {!isPremium && (
                    <div className="bg-accent-100 dark:bg-accent-200 rounded-lg p-3 text-center text-sm text-accent-800 dark:text-accent-900">
                        Free plan — Upgrade to Premium for unlimited ideas! 💎
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;