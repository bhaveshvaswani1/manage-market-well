
import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const DatabaseManager = () => {
  const { exportData, exportDataAsCSV, importData, clearAllData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert('Data imported successfully!');
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This will reset everything to default values.')) {
      clearAllData();
      alert('All data has been cleared and reset to defaults.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Database Management</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Manage your local database. All changes are automatically saved to your browser's local storage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Export JSON */}
        <button
          onClick={exportData}
          className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </button>

        {/* Export CSV */}
        <button
          onClick={exportDataAsCSV}
          className="flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>

        {/* Import Data */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </button>
        </div>

        {/* Clear Data */}
        <button
          onClick={handleClearData}
          className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Reset Data
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All data is stored locally in your browser</li>
          <li>• Changes are automatically saved when you make them</li>
          <li>• Export creates a JSON backup file</li>
          <li>• Import allows you to restore from a backup</li>
          <li>• Reset clears everything and loads default data</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseManager;
