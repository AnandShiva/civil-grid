import { useState, useMemo } from 'react';
import type { SelectedFeature, CipProjectProperties, EvChargerProperties } from '../types';
import { Search } from 'lucide-react';

interface SearchBarProps {
    projects: any[];
    chargers: any[];
    onSelectFeature: (feature: SelectedFeature) => void;
}

export default function SearchBar({ projects, chargers, onSelectFeature }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const filteredResults = useMemo(() => {
        if (!query || query.length < 2) return [];

        const projectResults = projects
            .filter(p => {
                const props = p.properties as CipProjectProperties;
                return props.ProjectTitle?.toLowerCase().includes(query.toLowerCase()) ||
                    props.ProjectNumber?.toLowerCase().includes(query.toLowerCase());
            })
            .slice(0, 5)
            .map(p => ({ type: 'project' as const, feature: p }));

        const chargerResults = chargers
            .filter(c => {
                const props = c.properties as EvChargerProperties;
                // Chargers might not have names, search by ID or address if available
                return props.OBJECTID.toString().includes(query);
            })
            .slice(0, 5)
            .map(c => ({ type: 'charger' as const, feature: c }));

        return [...projectResults, ...chargerResults];
    }, [query, projects, chargers]);

    const handleSelect = (result: any) => {
        onSelectFeature({ type: result.type, properties: result.feature.properties });
        setQuery('');
        setShowResults(false);
    };

    return (
        <div className="relative mb-4">
            <div className="relative">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    placeholder="Search projects or chargers..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {showResults && filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-100">
                    {filteredResults.map((result, idx) => {
                        const props = result.feature.properties;
                        const label = result.type === 'project'
                            ? (props as CipProjectProperties).ProjectTitle
                            : `EV Charger #${(props as EvChargerProperties).OBJECTID}`;

                        return (
                            <button
                                key={idx}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 last:border-0"
                                onClick={() => handleSelect(result)}
                            >
                                <span className={`w-2 h-2 rounded-full ${result.type === 'project' ? 'bg-blue-500' : 'bg-green-500'}`} />
                                <div className="truncate text-sm text-gray-700 font-medium">{label}</div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
