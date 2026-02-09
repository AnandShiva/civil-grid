import type { SelectedFeature, CipProjectProperties, EvChargerProperties, SpatialCorrelations } from '../types';

interface SidebarProps {
    selectedFeature: SelectedFeature | null;
    correlations?: SpatialCorrelations;
    projects?: any[];
    chargers?: any[];
    onSelectFeature?: (feature: SelectedFeature | null) => void;
}

export default function Sidebar({ selectedFeature, correlations, projects, chargers, onSelectFeature }: SidebarProps) {
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-4">
                {!selectedFeature ? (
                    <div className="text-center mt-20 px-6">
                        <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-600 font-medium">No Selection</p>
                        <p className="text-slate-500 text-sm mt-1">Select a project or EV charger map marker to view details.</p>
                    </div>
                ) : (
                    <FeatureDetails
                        feature={selectedFeature}
                        correlations={correlations}
                        projects={projects}
                        chargers={chargers}
                        onSelectFeature={onSelectFeature}
                    />
                )}
            </div>
        </div>
    );
}

interface FeatureDetailsProps {
    feature: SelectedFeature;
    correlations?: SpatialCorrelations;
    projects?: any[];
    chargers?: any[];
    onSelectFeature?: (feature: SelectedFeature | null) => void;
}

function FeatureDetails({ feature, correlations, projects, chargers, onSelectFeature }: FeatureDetailsProps) {
    const { type, properties } = feature;

    if (type === 'project') {
        const props = properties as CipProjectProperties;
        const linkedChargerIds = correlations?.projectToChargers[props.OBJECTID] || [];

        return (
            <div className="space-y-6">
                <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                        CIP Project
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">
                        {props.ProjectTitle}
                    </h2>
                </div>

                {linkedChargerIds.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center">
                            <span className="mr-1">⚡</span> Nested Chargers Presents!
                        </h3>
                        <p className="text-xs text-green-700 mb-2">
                            {linkedChargerIds.length} charger(s) located within this project area.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {linkedChargerIds.map(id => (
                                <button
                                    key={id}
                                    onClick={() => {
                                        const charger = chargers?.find(c => c.properties.OBJECTID === id);
                                        if (charger && onSelectFeature) {
                                            onSelectFeature({ type: 'charger', properties: charger.properties });
                                        }
                                    }}
                                    className="px-2 py-1 bg-white border border-green-300 rounded text-xs text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    Charger #{id}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <DetailItem label="Program" value={props.ProgramName} />
                <DetailItem label="Phase" value={props.ProjectPhase} />
                <DetailItem
                    label="Construction Cost"
                    value={props.ConstructionCost ? `$${props.ConstructionCost.toLocaleString()}` : 'N/A'}
                />

                <div className="grid grid-cols-2 gap-4">
                    <DetailItem
                        label="Start Date"
                        value={props.StartDate ? new Date(props.StartDate).toLocaleDateString() : 'N/A'}
                    />
                    <DetailItem
                        label="End Date"
                        value={props.EndDate ? new Date(props.EndDate).toLocaleDateString() : 'N/A'}
                    />
                </div>

                {(props.PM_Name || props.PM_Email) && (
                    <div className="border-t border-slate-100 pt-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Project Manager
                        </label>
                        <p className="text-slate-800 font-medium">{props.PM_Name}</p>
                        <p className="text-slate-600 text-sm">{props.PM_Email}</p>
                        <p className="text-slate-600 text-sm">{props.PM_Phone}</p>
                    </div>
                )}

                {props.Description && (
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Description
                        </label>
                        <p className="text-sm text-slate-700 leading-relaxed">{props.Description}</p>
                    </div>
                )}
            </div>
        );
    } else {
        const props = properties as EvChargerProperties;
        const linkedProjectIds = correlations?.chargerToProjects[props.OBJECTID] || [];

        return (
            <div className="space-y-6">
                <div>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                        EV Charger
                    </span>
                    <h2 className="text-lg font-bold text-slate-800">
                        EV Charger Station
                    </h2>
                    <p className="text-slate-500 text-sm">ID: {props.OBJECTID}</p>
                </div>

                {linkedProjectIds.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                            <span className="mr-1">🚧</span> Coordination Opportunity
                        </h3>
                        <p className="text-xs text-blue-700 mb-2">
                            This charger is located within {linkedProjectIds.length} planned project(s).
                        </p>
                        <div className="flex flex-col gap-2">
                            {linkedProjectIds.map(id => {
                                const project = projects?.find(p => p.properties.OBJECTID === id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            if (project && onSelectFeature) {
                                                onSelectFeature({ type: 'project', properties: project.properties });
                                            }
                                        }}
                                        className="text-left px-2 py-1.5 bg-white border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-100 transition-colors truncate w-full"
                                    >
                                        {project?.properties.ProjectTitle || `Project #${id}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
                    <p>Charger details are limited in this dataset.</p>
                </div>
            </div>
        );
    }
}

function DetailItem({ label, value }: { label: string, value: string | number | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                {label}
            </label>
            <p className="text-slate-800">{value}</p>
        </div>
    );
}
