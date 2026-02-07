import type { SelectedFeature, CipProjectProperties, EvChargerProperties } from '../types';

interface SidebarProps {
    selectedFeature: SelectedFeature | null;
}

export default function Sidebar({ selectedFeature }: SidebarProps) {
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
                    <FeatureDetails feature={selectedFeature} />
                )}
            </div>
        </div>
    );
}

function FeatureDetails({ feature }: { feature: SelectedFeature }) {
    const { type, properties } = feature;

    if (type === 'project') {
        const props = properties as CipProjectProperties;
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

                {/* Add specific charger props if available in the JSON, e.g. location, type, etc. 
                    Based on the file view earlier, mostly nulls or just OBJECTID and geometry were visible.
                    I'll add placeholders if needed or show available keys.
                */}
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
