import { useEffect, useState } from "react";
import { Coordinates } from "@/types/global.type";
import showAlert from "./useAlert";

/* eslint-disable @typescript-eslint/no-explicit-any */

const distanceBetweenTwoCoordinates = (
  deviceCoordinates: Coordinates,
  campusCoordinates: Coordinates
) => {
  let { latitude: deviceLatitude, longitude: deviceLongitude } =
    deviceCoordinates;
  let { latitude: campusLatitude, longitude: campusLongitude } =
    campusCoordinates;

  deviceLongitude = (deviceLongitude * Math.PI) / 180;
  campusLongitude = (campusLongitude * Math.PI) / 180;
  deviceLatitude = (deviceLatitude * Math.PI) / 180;
  campusLatitude = (campusLatitude * Math.PI) / 180;

  // Haversine formula
  const longitudeDifference = Math.abs(campusLongitude - deviceLongitude);
  const latitudeDifference = Math.abs(campusLatitude - deviceLatitude);
  const arc =
    Math.pow(Math.sin(latitudeDifference / 2), 2) +
    Math.cos(deviceLatitude) *
      Math.cos(campusLatitude) *
      Math.pow(Math.sin(longitudeDifference / 2), 2);

  const curve = 2 * Math.asin(Math.sqrt(arc));

  // Radius of earth in kilometers. Use 3956 for miles
  const EARTH_RADIUS = 6371;

  return curve * EARTH_RADIUS * 1000; // Distance in meters.
};

type Props = {
  rangeToClockIn: number;
  campusCoordinates: Coordinates;
};
const useGeolocation = (props: Props) => {
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  }>({
    longitude: 0,
    latitude: 0,
  });

  const { rangeToClockIn, campusCoordinates } = props;

  let distance = Infinity;

  const isInRange = (
    deviceCoordinatesArg: Coordinates = userLocation,
    campusCoordinatesArg: Coordinates = campusCoordinates
  ) => {
    if (deviceCoordinatesArg && campusCoordinatesArg) {
      try {
        distance = distanceBetweenTwoCoordinates(
          deviceCoordinatesArg,
          campusCoordinatesArg
        );
        if (distance <= +rangeToClockIn) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    }
  };

  const verifyRangeBeforeAction = (
    successCallback: () => any,
    errorCallback: () => any,
    closestCampusCoordinates: Coordinates = campusCoordinates
  ) => {
    if (isInRange(userLocation, closestCampusCoordinates)) {
      successCallback();
    } else {
      errorCallback();
    }
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 10000,
  };

  function success(pos: { coords: GeolocationCoordinates }) {
    const crd = pos.coords;
    setUserLocation((vals) => ({
      ...vals,
      longitude: crd.longitude,
      latitude: crd.latitude,
    }));
  }

  function errors(err: { code: any; message: any }) {
    showAlert(
      "warning",
      "Unable to ascertain your location. Please check is location is enabled",
      {
        seconds: 10,
      }
    );
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state !== "denied") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else {
            showAlert(
              "warning",
              "Your location is currently disabled. Enable location in your settings to clock in and out.",
              { seconds: 10 }
            );
          }
        });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, errors, options);
    } else {
      showAlert(
        "warning",
        "Geolocation is not supported by this browser or we are unable to verify if geolocation is supported. Please check your settings to enable geolocation manually.",
        {
          seconds: 20,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isInRange: !!isInRange(),
    verifyRangeBeforeAction,
    deviceCoordinates: userLocation,
    distance,
    refresh: () => window.location.reload(),
  };
};

export default useGeolocation;
