import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_PROJECT_COLLECTION_ID;
const LIMITS_COLLECTION_ID = import.meta.env.VITE_LIMITS_COLLECTION_ID;

const appwriteService = {
    async register(email, password, name) {
        try {
            // Create user
            await account.create(ID.unique(), email, password, name);

            // Create session to send verification
            await account.createEmailPasswordSession(email, password);

            // Send verification email
            await account.createVerification(
                `${window.location.origin}/verify-email`
            );

            // Immediately log out to force fresh login after verification
            await account.deleteSession("current");
        } catch (error) {
            throw error;
        }
    },

    login(email, password) {
        return account.createEmailPasswordSession(email, password);
    },

    loginWithGoogle() {
        // Redirects to Appwrite Google OAuth flow
        return account.createOAuth2Session(
            "google",
            `${window.location.origin}/projectgenerator`,
            `${window.location.origin}/login`
        );
    },

    async getCurrentUser() {
        try {
            return await account.get();
        } catch {
            return null;
        }
    },

    logout() {
        return account.deleteSession("current");
    },

    saveProjectIdea({ userId, branch, difficulty, ideaText }) {
        return databases.createDocument(
            DB_ID,
            PROJECTS_COLLECTION_ID,
            ID.unique(),
            {
                userId,
                branch,
                difficulty,
                ideaText,
                createdAt: new Date().toISOString(),
            }
        );
    },

    async getUserIdeas(userId) {
        try {
            const res = await databases.listDocuments(
                DB_ID,
                PROJECTS_COLLECTION_ID,
                [Query.equal("userId", userId), Query.orderDesc("createdAt")]
            );
            return res.documents;
        } catch {
            return [];
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
            return res.documents[0] || { count: 0 };
        } catch {
            return { count: 0 };
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
            { userId, date, count }
        );
    },
};

export default appwriteService;
