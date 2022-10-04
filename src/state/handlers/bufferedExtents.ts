import { center, difference } from "@turf/turf";
import { put, select } from "redux-saga/effects";
import {
  createExtent,
  createFeatureCollection,
  createMultiPoly,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNextExtent,
  removeFurthestExtent,
} from "../../helpers/geometry";
import {
  BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
  BUFFERED_EXTENTS_UPDATE_FAIL,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
  CACHED_DATA_INITIALIZE_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_REQUEST,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_REQUEST,
} from "../actions";
import { selectBufferedExtents } from "../reducers/bufferedExtents";

/**
 * REQUESTS update for either INITIALIZES or UPDATES the BUFFERED
 * EXTENTS based on no intersecting geometries.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS(action: any) {
  const { aGeo } = action.payload;
  const bufferedExtents = yield select(selectBufferedExtents);

  try {
    // If the extents are initialized
    if (bufferedExtents.initialized) {
      // Grab closest extent
      const closestExtent: any = getClosestExtent(
        aGeo.properties.center,
        bufferedExtents.data.features
      );
      // Needed in case user is in a diagonal direction in regards to the
      // closest geometery
      const direction: string = getDirectionFromBound(
        aGeo.properties.center,
        closestExtent
      );
      // Create Extent based on Center Lat Lng values and closest extent
      const newExtent: any = createExtent(
        closestExtent.properties.center,
        direction
      );

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([
            ...bufferedExtents.data.features,
            newExtent,
          ]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
    // In case the extents have not been initialized
    else {
      // Create Extent based on Center lat lng values
      const newExtent = createExtent(aGeo.properties.center);
      yield put({
        type: BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: error,
    });
  }
}

/**
 * REQUESTS update for BUFFERED EXTENTS if there is one intersecting geometry.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION(action: any) {
  const { aGeo, intersects } = action.payload;
  const bufferedExtents = yield select(selectBufferedExtents);

  try {
    // In case user starts to leave an extent
    if (difference(aGeo, intersects[0])) {
      // Grab closest extent
      const closestExtent = getClosestExtent(
        aGeo.properties.center,
        bufferedExtents.data.features
      );
      // Create Extent based on Closest Extent
      const newExtent = getNextExtent(action.payload.aGeo, closestExtent);

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([
            ...bufferedExtents.data.features,
            newExtent,
          ]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    } else {
      // For logging purposes
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Helper function used for BUFFERD_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS
 * handler.
 * @param diffCenter center of difference for geometry
 * @param multipoly multipolygon used for comparison
 * @param closestExtent closest geojson in regards to user
 * @returns new geojson extent
 */
function createExtentBasedOnDifference(
  diffCenter: { lat: number; lng: number },
  multipoly: any,
  closestExtent: any
) {
  // check north
  if (
    diffCenter.lat > multipoly.properties.center.lat &&
    diffCenter.lat > closestExtent.properties.center.lat
  ) {
    return createExtent(closestExtent.properties.center, "n");
  }
  // check south
  if (
    diffCenter.lat < multipoly.properties.center.lat &&
    diffCenter.lat < closestExtent.properties.center.lat
  ) {
    return createExtent(closestExtent.properties.center, "s");
  }
  // check east
  if (
    diffCenter.lng > multipoly.properties.center.lng &&
    diffCenter.lng > closestExtent.properties.center.lng
  ) {
    return createExtent(closestExtent.properties.center, "e");
  }
  // check west
  if (
    diffCenter.lng < multipoly.properties.center.lng &&
    diffCenter.lng < closestExtent.properties.center.lng
  ) {
    return createExtent(closestExtent.properties.center, "w");
  }
}

/**
 * REQUESTS update for BUFFERED EXTENTS if there is two intersecting geometries.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS(action: any) {
  const { aGeo, intersects } = action.payload;

  try {
    const bufferedExtents = yield select(selectBufferedExtents);

    const intersectsMultiPoly: any = createMultiPoly(intersects);

    if (difference(aGeo, intersectsMultiPoly)) {
      // Get closest geometry
      const closestExtent = getClosestExtent(
        aGeo.properties.center,
        intersects
      );

      // Assign center property to multi poly
      intersectsMultiPoly.properties.center = {
        lat: center(intersectsMultiPoly).geometry.coordinates[1],
        lng: center(intersectsMultiPoly).geometry.coordinates[0],
      };

      // get difference for check
      const diff = difference(aGeo, intersectsMultiPoly);

      // get center of difference
      const diffCenter: any = diff
        ? {
            lat: center(diff).geometry.coordinates[1],
            lng: center(diff).geometry.coordinates[0],
          }
        : null;

      // get new extent based on center of difference
      const newExtent: any = createExtentBasedOnDifference(
        diffCenter,
        intersectsMultiPoly,
        closestExtent
      );

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([
            ...bufferedExtents.data.features,
            newExtent,
          ]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
    // for logging purposes
    else {
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
      });
    }
  } catch (error) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Helper function used for BUFFERD_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS
 * handler.
 * @param directionStrings string array of directions (E.g. "ne", "se", "sw")
 * @param extentsArr geojson array for buffered extents
 * @returns new geojson extent
 */
function createCornerExtent(directionStrings: any[], extentsArr: any[]) {
  let adjacent: any;

  const assignAdjacent = (direction1: string, direction2: string) => {
    extentsArr.forEach((extent: any) => {
      if (
        extent.properties.direction === direction1 ||
        extent.properties.direction === direction2
      ) {
        adjacent = extent;
      }
    });
  };

  const getCornerExtent = (direction: string) => {
    if (adjacent.properties.direction.includes("n")) {
      return createExtent(
        adjacent.properties.center,
        direction[0] === "n" ? direction[1] : direction[0]
      );
    }
    if (adjacent.properties.direction.includes("s")) {
      return createExtent(
        adjacent.properties.center,
        direction[0] === "s" ? direction[1] : direction[0]
      );
    }
  };

  if (!directionStrings.includes("ne")) {
    assignAdjacent("nw", "se");
    return getCornerExtent("ne");
  }
  if (!directionStrings.includes("nw")) {
    assignAdjacent("ne", "sw");
    return getCornerExtent("nw");
  }
  if (!directionStrings.includes("se")) {
    assignAdjacent("ne", "sw");
    return getCornerExtent("se");
  }
  if (!directionStrings.includes("sw")) {
    assignAdjacent("nw", "se");
    return getCornerExtent("sw");
  }
}

/**
 * REQUESTS update for BUFFERED EXTENTS if there is three intersecting
 * geometries.
 * @param action
 */
function* handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS(action: any) {
  const { aGeo, intersects } = action.payload;

  const bufferedExtents = yield select(selectBufferedExtents);
  try {
    // Multi polygon for the intersecting extents in regards to the user
    const intersectsMultiPoly: any = createMultiPoly(intersects);

    if (difference(aGeo, intersectsMultiPoly)) {
      // check where each geo is
      const tempExtents: any[] = [];
      intersects.forEach((feature: any) => {
        feature.properties.direction = getDirectionFromCenter(
          feature.properties.center,
          [aGeo]
        );
        tempExtents.push(feature);
      });

      let adjacent: any;

      const coolstring = tempExtents.map((b: any) => {
        return b.properties.direction;
      });

      // once all geos are obtained check where to put the next geometry
      const newExtent = createCornerExtent(coolstring, tempExtents);

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([
            ...bufferedExtents.data.features,
            newExtent,
          ]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Handler used to dispatch CACHING actions after INITIALIZING the
 * BUFFERED EXTENTS.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS(action: any) {
  const { fetch_geo } = action.payload;

  try {
    yield put({
      type: CACHED_DATA_UPDATE_REQUEST,
      payload: {
        fetch_geo: fetch_geo,
        initialize: true,
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_INITIALIZE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Handler used to dispatch CACHING actions after UPDATING the
 * BUFFERED EXTENTS.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_UPDATE_SUCCESS(action: any) {
  const { fetch_geo } = action.payload;

  try {
    yield put({
      type: CACHED_DATA_UPDATE_REQUEST,
      payload: {
        fetch_geo: fetch_geo,
        initialize: false,
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Updates BUFFERED_EXTENTS by removing the furthest extent.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST(action: any) {
  const { current_extent } = action.payload;
  const bufferedExtents = yield select(selectBufferedExtents);

  const { updated_extents, update_cached, timestamps } = removeFurthestExtent(
    current_extent.properties.center,
    bufferedExtents.data.features
  );

  try {
    if (update_cached) {
      yield put({
        type: BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection(updated_extents),
          update_cached: update_cached,
          timestamps: timestamps,
        },
      });
    } else {
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

/**
 * Handler used to dispatch CACHING actions after REMOVING the
 * furthest extent.
 * @param action data passed through redux action
 */
function* handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS(action: any) {
  const { timestamps, update_cached } = action.payload;

  try {
    if (update_cached) {
      yield put({
        type: CACHED_DATA_REMOVE_FURTHEST_REQUEST,
        payload: {
          timestamps: timestamps,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_REMOVE_FURTHEST_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

export {
  handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION,
  handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_SUCCESS,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
};
