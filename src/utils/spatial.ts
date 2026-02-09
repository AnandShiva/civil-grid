import * as turf from '@turf/turf';
import type { Feature, Polygon, Point, MultiPolygon } from 'geojson';
import type { SpatialCorrelations } from '../types';

/**
 * Calculates spatial correlations between projects (polygons) and chargers (points).
 * Returns two maps:
 * 1. projectToChargers: ProjectID -> [ChargerIDs]
 * 2. chargerToProjects: ChargerID -> [ProjectIDs]
 */
export function findProjectChargerCorrelations(
    projects: Feature<Polygon | MultiPolygon>[],
    chargers: Feature<Point>[]
): SpatialCorrelations {
    const projectToChargers: Record<number, number[]> = {};
    const chargerToProjects: Record<number, number[]> = {};

    // Initialize maps
    projects.forEach(p => {
        if (p.properties?.OBJECTID) {
            projectToChargers[p.properties.OBJECTID] = [];
        }
    });

    chargers.forEach(c => {
        if (c.properties?.OBJECTID) {
            chargerToProjects[c.properties.OBJECTID] = [];
        }
    });

    // Iterate through all chargers and check which projects they fall into
    // This is O(N*M), which might be slow for very large datasets, but fine for thousands.
    // For optimization, a spatial index (RBush) could be used, but let's start simple.

    // Using a simple nested loop
    for (const charger of chargers) {
        const chargerId = charger.properties?.OBJECTID;
        if (!chargerId) continue;

        // Skip if invalid geometry
        if (!charger.geometry || !charger.geometry.coordinates) continue;

        for (const project of projects) {
            const projectId = project.properties?.OBJECTID;
            if (!projectId) continue;

            // Skip if invalid geometry
            if (!project.geometry || !project.geometry.coordinates) continue;

            try {
                // Check inclusion
                const isInside = turf.booleanPointInPolygon(charger as any, project as any);

                if (isInside) {
                    // Update project -> chargers map
                    if (!projectToChargers[projectId]) projectToChargers[projectId] = [];
                    projectToChargers[projectId].push(chargerId);

                    // Update charger -> projects map
                    if (!chargerToProjects[chargerId]) chargerToProjects[chargerId] = [];
                    chargerToProjects[chargerId].push(projectId);
                }
            } catch (e) {
                console.warn(`Error checking point in polygon for charger ${chargerId} and project ${projectId}`, e);
            }
        }
    }

    return { projectToChargers, chargerToProjects };
}
