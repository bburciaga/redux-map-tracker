import { center, distance, multiPolygon, polygon } from "@turf/turf";
import L, { LatLngBounds } from "leaflet";

const length = 0.745201235056549;
const width = 1.135711669921875;

/**
 * Turns array of features into feature collection object
 * @param features array of geojson objects
 * @returns feature collection object
 */
function createFeatureCollection(features: any[]) {
  return {
    type: "FeatureCollection",
    features: features,
  };
}

/**
 * Turns array of features into multi polygon
 * @param features array of geojson object
 * @returns multi polygon
 */
function createMultiPoly(features: any[]) {
  return multiPolygon(
    features.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );
}

/**
 * Used to generate array of numbers to be used for rectangle GeoJSON object
 * @param center position of map or GeoJSON object
 * @returns number [][][]
 */
function createBoundFromCenter(aCenter: { lat: number; lng: number }) {
  return [
    [
      [aCenter.lng + width, aCenter.lat + length],
      [aCenter.lng + width, aCenter.lat - length],
      [aCenter.lng - width, aCenter.lat - length],
      [aCenter.lng - width, aCenter.lat + length],
      [aCenter.lng + width, aCenter.lat + length],
    ],
  ];
}

/**
 * Purpose to be used for user geometry to contain properties as well
 * @param latLngBounds object generated from React Leaflet map.getBounds()
 * @returns geojson
 */
function createUserGeo(latLngBounds: LatLngBounds) {
  const latlngs = [];

  latlngs.push(latLngBounds.getSouthWest());
  latlngs.push(latLngBounds.getSouthEast());
  latlngs.push(latLngBounds.getNorthEast());
  latlngs.push(latLngBounds.getNorthWest());

  const tempGeo = L.polygon(latlngs).toGeoJSON();

  tempGeo.properties.center = latLngBounds.getCenter();
  tempGeo.properties.northEast = latLngBounds.getNorthEast();
  tempGeo.properties.southWest = latLngBounds.getSouthWest();

  return tempGeo;
}

/**
 * creates extent with properties
 * @param coordArr coordinate array
 * @param center center of new object
 * @returns geojson
 */
function createPolygonFromArray(
  coordArr: number[][][],
  aCenter: { lat: number; lng: number }
) {
  const aGeo: any = polygon(coordArr);
  aGeo.properties.center = aCenter;

  aGeo.properties.center = aCenter;
  aGeo.properties.northEast = {
    lat: aCenter.lat + length,
    lng: aCenter.lng + width,
  };
  aGeo.properties.southWest = {
    lat: aCenter.lat - length,
    lng: aCenter.lng - width,
  };
  aGeo.properties.timestamp = Date.now();

  return aGeo;
}

/**
 * Creates new center based on inputed center and direction
 * @param aCenter center object as a reference for the new center
 * @param direction
 * @returns center object { lat: number, lng: number }
 */
function getNewCenter(
  aCenter: { lat: number; lng: number },
  direction: string
) {
  switch (direction[0]) {
    case "n":
      return { lat: aCenter.lat + 2 * length, lng: aCenter.lng };
    case "s":
      return { lat: aCenter.lat - 2 * length, lng: aCenter.lng };
    case "e":
      return { lat: aCenter.lat, lng: aCenter.lng + 2 * width };
    case "w":
      return { lat: aCenter.lat, lng: aCenter.lng - 2 * width };
  }
  return aCenter;
}

/**
 * Creates a new extent for the bufferedExtents
 * @param center position to base next extent off of
 * @param direction (optional) to indicate where to put next extent
 * @returns geojson
 */
function createExtent(
  aCenter: { lat: number; lng: number },
  direction?: string
) {
  let newCenter: { lat: number; lng: number } = aCenter;
  if (direction) {
    newCenter = getNewCenter(aCenter, direction);
    if (direction.length > 1)
      newCenter = getNewCenter(newCenter, direction.charAt(1));
  }

  const tempBound: any = createBoundFromCenter(newCenter);

  return createPolygonFromArray(tempBound, newCenter);
}

/**
 * Gets next extent by comparing users location and the extents location
 * @param userGeo used as refernce for next extent
 * @param extentGeo used as reference for user geo
 * @returns geojson object
 */
function getNextExtent(userGeo: any, extentGeo: any) {
  const tempArr = [];
  if (extentGeo.properties.northEast.lat < userGeo.properties.northEast.lat) {
    tempArr.push(createExtent(extentGeo.properties.center, "n"));
  }
  if (extentGeo.properties.southWest.lat > userGeo.properties.southWest.lat) {
    tempArr.push(createExtent(extentGeo.properties.center, "s"));
  }
  if (extentGeo.properties.northEast.lng < userGeo.properties.northEast.lng) {
    tempArr.push(createExtent(extentGeo.properties.center, "e"));
  }
  if (extentGeo.properties.southWest.lng > userGeo.properties.southWest.lng) {
    tempArr.push(createExtent(extentGeo.properties.center, "w"));
  }
  if (tempArr.length > 1) {
    const d1 = distance(
      [userGeo.properties.center.lng, userGeo.properties.center.lat],
      [tempArr[0].properties.center.lng, tempArr[0].properties.center.lat]
    );
    const d2 = distance(
      [userGeo.properties.center.lng, userGeo.properties.center.lat],
      [tempArr[1].properties.center.lng, tempArr[1].properties.center.lat]
    );
    if (d1 > d2) return tempArr[1];
  }
  return tempArr[0];
}

/**
 * Checks the distance of all extents in regards to the users center location and
 * finding the extent with the closest distance
 * @param userCenter users geojson object used to compare with all extents
 * @param extents all extents passed for comparison
 * @returns geojson object of closest extent
 */
function getClosestExtent(
  userCenter: { lat: number; lng: number },
  extents: any[]
) {
  let closestDistance: number = -1;
  let closestFeature: any;

  extents.forEach((extent: any) => {
    const eCenter = extent.properties.center;
    if (!closestFeature) {
      closestDistance = distance(
        [eCenter.lng, eCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      closestFeature = extent;
    }
    if (closestFeature) {
      const tempDistance = distance(
        [eCenter.lng, eCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      if (tempDistance < closestDistance) {
        closestDistance = tempDistance;
        closestFeature = extent;
      }
    }
  });

  return closestFeature;
}

/**
 * Gets the direction of the specified center based on the center of
 * the extents array
 * @param aCenter specified lat lng object
 * @param extents array of geojson objects
 * @returns string direction (E.g. "ne")
 */
function getDirectionFromCenter(
  aCenter: { lat: number; lng: number },
  extents: any[]
) {
  const multiPoly: any = createMultiPoly(extents);
  const tempCenter: any = center(multiPoly).geometry.coordinates;
  const mpCenter = { lat: tempCenter[1], lng: tempCenter[0] };

  let direction: string = "";

  if (aCenter.lat > mpCenter.lat) {
    direction += "n";
  }
  if (aCenter.lat < mpCenter.lat) {
    direction += "s";
  }
  if (aCenter.lng > mpCenter.lng) {
    direction += "e";
  }
  if (aCenter.lng < mpCenter.lng) {
    direction += "w";
  }

  return direction;
}

/**
 * Compares a center object with the NE property
 * and the SE property of the geojson object
 * @param aCenter specified lat lng object for comparison
 * @param aGeo geojson object used to compare with the center object
 * @returns string direction (E.g. "ne")
 */
function getDirectionFromBound(
  aCenter: { lat: number; lng: number },
  aGeo: any
) {
  const cbNE = aGeo.properties.northEast;
  const cbSW = aGeo.properties.southWest;

  let direction = "";

  if (aCenter.lat > cbNE.lat) {
    direction += "n";
  }
  if (aCenter.lat < cbSW.lat) {
    direction += "s";
  }
  if (aCenter.lng > cbNE.lng) {
    direction += "e";
  }
  if (aCenter.lng < cbSW.lng) {
    direction += "w";
  }

  return direction;
}

/**
 * Checks the distance of all extents in regards to the users center location and
 * finding the extent with the furthest distance
 * @param userCenter users geojson object used to compare with all extents
 * @param extents all extents passed for comparison
 * @returns geojson object of closest extent
 */
function removeFurthestExtent(
  aCenter: { lat: number; lng: number },
  extents: any[]
) {
  const tempExtents = extents;
  const timestamps = tempExtents.map((e) => {
    return e.properties.timestamp;
  });
  let update_cached: boolean = false;

  if (tempExtents.length > 5) {
    let furthestDistance = -1;
    let index = -1;
    update_cached = true;

    for (let i = 0; i < tempExtents.length; i++) {
      const tempCenter = tempExtents[i].properties.center;
      const tempDistance = distance(
        [tempCenter.lng, tempCenter.lat],
        [aCenter.lng, aCenter.lat]
      );
      if (furthestDistance < tempDistance) {
        furthestDistance = tempDistance;
        index = i;
      }
    }

    if (index > -1) {
      const _temp: any = tempExtents.splice(index, 1);
      timestamps.splice(index, 1);
    }
  }
  return {
    updated_extents: tempExtents,
    update_cached: update_cached,
    timestamps: timestamps,
  };
}

export {
  createUserGeo,
  createExtent,
  createFeatureCollection,
  createMultiPoly,
  getNextExtent,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNewCenter,
  removeFurthestExtent,
};
