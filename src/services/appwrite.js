import { Client, Account, Databases, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const appwriteService = {
  async register(email, password, name) {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async loginWithGoogle() {
    try {
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/projectgenerator`,
        `${window.location.origin}/login`
      );
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const user = await account.get();
      console.log('getCurrentUser:', user);
      return user;
    } catch (error) {
      console.error('Get user failed:', error);
      return null;
    }
  },

  async logout() {
    try {
      await account.deleteSessions(); // Clear all sessions
      console.log('All sessions cleared');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

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
      console.error('Save idea failed:', error);
      throw error;
    }
  },

  async getUserIdeas(userId) {
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_PROJECT_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      console.log('getUserIdeas:', res.documents);
      return res.documents;
    } catch (error) {
      console.error('Error fetching user ideas:', error);
      return [];
    }
  },

  async deleteIdea(ideaId) {
    try {
      console.log('Deleting idea:', { ideaId });
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_PROJECT_COLLECTION_ID,
        ideaId
      );
      console.log('Idea deleted:', { ideaId });
    } catch (error) {
      console.error('Delete idea failed:', error);
      throw error;
    }
  },

  async getLimit(userId, date) {
    try {
      console.log('getLimit inputs:', {
        userId,
        date,
        db: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        coll: import.meta.env.VITE_LIMITS_COLLECTION_ID,
      });
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
      throw error;
    }
  },
};

export default appwriteService;