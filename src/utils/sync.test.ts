import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { syncWithMongoDb } from './sync';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';

// Mock dependencies
vi.mock('axios');
vi.mock('react-hot-toast');
vi.mock('../store', () => ({
  useAppStore: {
    getState: vi.fn(),
  },
}));

describe('syncWithMongoDb', () => {
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should skip sync if MongoDB credentials are not set', async () => {
    vi.mocked(useAppStore.getState).mockReturnValue({
      settings: { mongoDbUrl: '', mongoDbApiKey: '', clusterName: '', databaseName: '' },
      projects: [],
      tasks: {},
    } as unknown as ReturnType<typeof useAppStore.getState>);

    await syncWithMongoDb();

    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should successfully sync to MongoDB', async () => {
    vi.mocked(useAppStore.getState).mockReturnValue({
      settings: { mongoDbUrl: 'http://mongodb.url', mongoDbApiKey: 'api-key', clusterName: 'Cluster0', databaseName: 'Db' },
      projects: [],
      tasks: {},
    } as unknown as ReturnType<typeof useAppStore.getState>);

    vi.mocked(axios.post).mockResolvedValueOnce({});

    await syncWithMongoDb();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://mongodb.url/action/updateOne',
      expect.any(Object),
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'api-key',
        },
      }
    );
  });

  it('should handle sync error and show toast', async () => {
    vi.mocked(useAppStore.getState).mockReturnValue({
      settings: { mongoDbUrl: 'http://mongodb.url', mongoDbApiKey: 'api-key', clusterName: 'Cluster0', databaseName: 'Db' },
      projects: [],
      tasks: {},
    } as unknown as ReturnType<typeof useAppStore.getState>);

    const error = new Error('Network Error');
    vi.mocked(axios.post).mockRejectedValueOnce(error);

    await syncWithMongoDb();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Failed to sync to MongoDB:', error);
    expect(toast.error).toHaveBeenCalledWith('Failed to sync with MongoDB Atlas');
  });
});
