import { Account, Client, Databases, ID, Query } from "appwrite";

const client = new Client();

client
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT);

const account = new Account(client);
const databases = new Databases(client);

const appwriteService = {
    async register(email, password, name) {
        try {
            return await account.create(ID.unique(), email, password, name);
        } catch (error) {
            throw error;
        }
    },

    async login(email, password) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    },

    //get logged in user
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    },
    async logout() {
        await account.deleteSession("current");
    },

    // save generated project Idea
    async saveProjectIdea({ userId, branch, difficulty, ideaText }) {
        try {
            return await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_PROJECT_COLLECTION_ID,
                ID.unique(),
                {
                    userId,
                    branch,
                    difficulty,
                    ideaText,
                    createdAt: new Date().toISOString(),
                }
            );
        } catch (error) {
            throw error;
        }
    },

    async getUserIdeas(userId) {
        try {
            const res = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_PROJECT_COLLECTION_ID,
                [Query.equal("userId", userId)] // Corrected the query to pass userId correctly
            );
            return res.documents;
        } catch (error) {
            console.error("Error fetching user ideas:", error);
            return [];
        }
    },

    async getLimit(userId, date) {
        try {
          console.log('getLimit inputs:', { userId, date, db: import.meta.env.VITE_APPWRITE_DATABASE_ID, coll: import.meta.env.VITE_LIMITS_COLLECTION_ID });
          const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_LIMITS_COLLECTION_ID,
            [Query.equal('userId', userId), Query.equal('date', date)]
          );
          console.log('getLimit response:', response.documents);
          return response.documents[0] || { count: 0 };
        } catch (error) {
          console.error('Get limit failed:', error);
          return { count: 0 };
        }
      },
      
      async updateLimit(userId, date, count) {
        try {
          console.log('updateLimit inputs:', { userId, date, count });
          const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_LIMITS_COLLECTION_ID,
            [Query.equal('userId', userId), Query.equal('date', date)]
          );
          console.log('updateLimit response:', response.documents);
          if (response.documents.length) {
            console.log('Updating document:', response.documents[0].$id);
            await databases.updateDocument(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_LIMITS_COLLECTION_ID,
              response.documents[0].$id,
              { count }
            );
          } else {
            console.log('Creating new limit document');
            await databases.createDocument(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_LIMITS_COLLECTION_ID,
              ID.unique(),
              {
                userId,
                date,
                count,
              }
            );
          }
        } catch (error) {
          console.error('Update limit failed:', error);
          // Don’t throw—let UI handle
        }
      },
};

export default appwriteService;
