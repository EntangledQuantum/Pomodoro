import { useState } from 'react';
import { useAppStore } from '../../store';
import { Database, CheckCircle2, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const SetupWizard = ({ onClose }: { onClose?: () => void }) => {
  const { settings, updateSettings } = useAppStore();
  
  const [mongoDbUrl, setMongoDbUrl] = useState(settings.mongoDbUrl || '');
  const [mongoDbApiKey, setMongoDbApiKey] = useState(settings.mongoDbApiKey || '');
  const [clusterName, setClusterName] = useState(settings.clusterName || 'Cluster0');
  const [databaseName, setDatabaseName] = useState(settings.databaseName || 'zenfocus');

  const [step, setStep] = useState(1);

  const handleSave = () => {
    if (!mongoDbUrl || !mongoDbApiKey) {
      toast.error('Please enter both the Data API URL and API Key.');
      return;
    }
    
    updateSettings({
      mongoDbUrl,
      mongoDbApiKey,
      clusterName,
      databaseName,
    });
    
    toast.success('Database configured successfully!');
    if (onClose) onClose();
  };

  const handleSkip = () => {
    toast('Running in local-only mode. You can configure sync later in Settings.', { icon: 'ℹ️' });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Database size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-white">Cloud Sync Setup</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-white">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl text-white/90">Connect your MongoDB Atlas Free Tier</h3>
              <p className="text-white/70 leading-relaxed">
                To sync your tasks seamlessly across Desktop, Web, Android, and iOS, Zen Focus uses the <b>MongoDB Atlas Data API</b>. 
                This is completely free and gives you 512MB of cloud storage!
              </p>
              
              <div className="bg-black/20 p-4 rounded-xl space-y-3 mt-4 text-sm text-white/80">
                <h4 className="font-semibold text-white">How to setup:</h4>
                <ol className="list-decimal list-inside space-y-2 ml-1">
                  <li>Create a free account at <a href="https://mongodb.com/atlas" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">mongodb.com/atlas</a>.</li>
                  <li>Build a free <b>M0 Cluster</b> (e.g., named <code className="bg-black/30 px-1 py-0.5 rounded">Cluster0</code>).</li>
                  <li>In the Atlas sidebar, go to <b>App Services</b> &gt; <b>Data API</b>.</li>
                  <li>Enable the Data API and select your cluster.</li>
                  <li>Copy your <b>URL Endpoint</b> and generate an <b>API Key</b>.</li>
                </ol>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="glass-button-primary w-full py-3 mt-4 text-lg font-medium"
              >
                I have my API Keys <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl text-white/90">Enter your Data API Credentials</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-white/60 font-medium ml-1">Data API URL Endpoint</label>
                  <input 
                    type="text" 
                    value={mongoDbUrl}
                    onChange={(e) => setMongoDbUrl(e.target.value)}
                    placeholder="e.g. https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1"
                    className="glass-input w-full p-3 text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-white/60 font-medium ml-1">Data API Key</label>
                  <input 
                    type="password" 
                    value={mongoDbApiKey}
                    onChange={(e) => setMongoDbApiKey(e.target.value)}
                    placeholder="Paste your API key here"
                    className="glass-input w-full p-3 text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-white/60 font-medium ml-1">Cluster Name</label>
                    <input 
                      type="text" 
                      value={clusterName}
                      onChange={(e) => setClusterName(e.target.value)}
                      placeholder="Cluster0"
                      className="glass-input w-full p-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-white/60 font-medium ml-1">Database Name</label>
                    <input 
                      type="text" 
                      value={databaseName}
                      onChange={(e) => setDatabaseName(e.target.value)}
                      placeholder="zenfocus"
                      className="glass-input w-full p-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="glass-button px-6 py-3"
                >
                  Back
                </button>
                <button 
                  onClick={handleSave}
                  className="glass-button-primary flex-1 py-3"
                >
                  <CheckCircle2 size={20} className="mr-2" /> Connect Database
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {step === 1 && (
          <div className="p-4 border-t border-white/10 bg-black/20 text-center">
            <button onClick={handleSkip} className="text-sm text-white/50 hover:text-white transition-colors">
              Skip for now (Local only mode)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};