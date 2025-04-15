import { Client, Account, Databases, ID, Query, Storage } from "appwrite";
// Removed CryptoJS import - no longer needed

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_PROJECT_COLLECTION_ID;
const LIMITS_COLLECTION_ID = import.meta.env.VITE_LIMITS_COLLECTION_ID;

const appwriteService = {
    async register(email, password, name) {
        try {
            await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);
            await account.createVerification(
                `${window.location.origin}/verify-email`
            );
            await account.deleteSession("current"); // Log out after sending verification
        } catch (error) {
            console.error("Registration Error:", error);
            throw error; // Re-throw for handling in UI
        }
    },

    login(email, password) {
        return account.createEmailPasswordSession(email, password);
    },

    loginWithGoogle(
        // Success URL might need adjustment if it relied on profile pic sync
        successUrl = `${window.location.origin}/projectgenerator`,
        failureUrl = `${window.location.origin}/login`
    ) {
        return account.createOAuth2Session(
            "google",
            // Callback URL likely stays the same
            `${window.location.origin}/google-callback`,
            failureUrl,
            // Scopes are still needed for name/email even without picture syncing
            ["profile", "email", "openid"]
        );
    },

    // Removed the updatePrefsIfGoogle function entirely

    async getCurrentUser() {
        try {
            // Directly return the user fetched from Appwrite
            const user = await account.get();
            return user;
        } catch (error) {
            // It's better practice to log the error or handle it more gracefully
            // console.error("Failed to get current user:", error);
            return null;
        }
    },

    logout() {
        return account.deleteSession("current");
    },

    async updateProfile({ name, picture, bio, setUser }) {
        try {
            if (name) await account.updateName(name);
            const prefs = { picture: picture || "", bio: bio || "" };
            await account.updatePrefs(prefs);
            const updatedUser = await account.get();
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    async uploadFile(file) {
        try {
            const response = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                file
            );
            return response.$id;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    },
    
    getFilePreview(fileId) {
        return storage.getFilePreview(BUCKET_ID, fileId).href;
    },

    async saveProjectIdea({ userId, branch, difficulty, ideaText }) {
        return databases.createDocument(
            DB_ID,
            PROJECTS_COLLECTION_ID,
            ID.unique(),
            {
                userId,
                branch,
                difficulty,
                ideaText,
                favorite: false, // Added default favorite field
                createdAt: new Date().toISOString(),
            }
        );
    },

    async toggleFavorite(ideaId, favorite) {
        try {
            await databases.updateDocument(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                ideaId,
                { favorite }
            );
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            throw error;
        }
    },

    async getUserIdeas(userId) {
        try {
            const res = await databases.listDocuments(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                [Query.equal("userId", userId), Query.orderDesc("createdAt")]
            );
            return res.documents;
        } catch (error) {
            console.error("Failed to get user ideas:", error);
            return []; // Return empty array on failure
        }
    },

    deleteIdea(ideaId) {
        return databases.deleteDocument(DB_ID, PROJECTS_COLLECTION_ID, ideaId);
    },

    async getLimit(userId, date) {
        try {
            const res = await databases.listDocuments(
                DB_ID,
                LIMITS_COLLECTION_ID,
                [Query.equal("userId", userId), Query.equal("date", date)]
            );
            // Return a default structure if no document found
            return res.documents[0] || { userId, date, count: 0 };
        } catch (error) {
            console.error("Failed to get limit:", error);
            // Return a default structure on error
            return { userId, date, count: 0 };
        }
    },

    updateLimit(userId, date, count, existingDocId) {
        if (existingDocId) {
            return databases.updateDocument(
                DB_ID,
                LIMITS_COLLECTION_ID,
                existingDocId,
                { count }
            );
        }
        return databases.createDocument(
            DB_ID,
            LIMITS_COLLECTION_ID,
            ID.unique(),
            {
                userId,
                date,
                count,
            }
        );
    },
};

export { client, account };
export default appwriteService;
