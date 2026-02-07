export interface EvChargerProperties {
    OBJECTID: number;
    // Add other properties as needed based on the JSON
}

export interface CipProjectProperties {
    OBJECTID: number;
    ProjectTitle: string;
    ProjectNumber?: string;
    ProgramName?: string;
    ProjectPhase?: string;
    ConstructionCost?: number;
    StartDate?: number;
    EndDate?: number;
    PM_Name?: string;
    PM_Phone?: string;
    PM_Email?: string;
    Description?: string;
}

export type FeatureType = 'project' | 'charger';

export interface SelectedFeature {
    type: FeatureType;
    properties: EvChargerProperties | CipProjectProperties;
}
