import axios from 'axios';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';

export const syncWithMongoDb = async () => {
  const { settings, projects, tasks } = useAppStore.getState();
  
  if (!settings.mongoDbUrl || !settings.mongoDbApiKey) {
    console.log("MongoDB credentials not set. Skipping sync.");
    return;
  }

  const payload = {
    dataSource: settings.clusterName,
    database: settings.databaseName,
    collection: "user_data",
    filter: { userId: "default-user" }, // Single user app
    update: {
      $set: {
        userId: "default-user",
        projects,
        tasks,
        settings,
        lastSynced: Date.now()
      }
    },
    upsert: true
  };

  try {
    await axios.post(`${settings.mongoDbUrl}/action/updateOne`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': settings.mongoDbApiKey,
      }
    });
    console.log("Successfully synced to MongoDB");
  } catch (error) {
    console.error("Failed to sync to MongoDB:", error);
    toast.error("Failed to sync with MongoDB Atlas");
  }
};

export const fetchFromMongoDb = async () => {
  const { settings, replaceState } = useAppStore.getState();
  
  if (!settings.mongoDbUrl || !settings.mongoDbApiKey) {
    return;
  }

  const payload = {
    dataSource: settings.clusterName,
    database: settings.databaseName,
    collection: "user_data",
    filter: { userId: "default-user" },
  };

  try {
    const response = await axios.post(`${settings.mongoDbUrl}/action/findOne`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': settings.mongoDbApiKey,
      }
    });

    if (response.data.document) {
      const doc = response.data.document;
      // Replace local state with fetched state
      replaceState({
        projects: doc.projects,
        tasks: doc.tasks,
        settings: doc.settings,
      });
      console.log("Successfully fetched from MongoDB");
      toast.success("State synchronized from cloud!");
    }
  } catch (error) {
    console.error("Failed to fetch from MongoDB:", error);
    toast.error("Failed to fetch from MongoDB Atlas");
  }
};