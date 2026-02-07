import { useState } from 'react';
import MapView from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import type { SelectedFeature } from './types';
import evChargersData from './data/ev_chargers.json';
import cipProjectsData from './data/cip_projects.json';

// Type assertion for raw JSON data
const chargers = (evChargersData as any).features;
const projects = (cipProjectsData as any).features;

function App() {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-xl z-[400] relative w-96">
        {/* Sidebar Container */}
        <div className="p-4 border-b border-gray-200 bg-slate-50">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Civil Grid</h1>
          <SearchBar
            projects={projects}
            chargers={chargers}
            onSelectFeature={setSelectedFeature}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar selectedFeature={selectedFeature} />
        </div>
      </div>

      <div className="flex-1 h-full relative">
        <MapView
          chargers={chargers}
          projects={projects}
          selectedFeature={selectedFeature}
          onSelectFeature={setSelectedFeature}
        />
      </div>
    </div>
  );
}

export default App;
