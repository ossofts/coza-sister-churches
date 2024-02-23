import { useGetCampuses } from "@/services/campus";
import { Coordinates } from "@/types/global.type";
import CampusTree from "@/utils/campusTree";
import { useMemo } from "react";

const useClosestCampus = (deviceCoordinates: Coordinates) => {
  const { data } = useGetCampuses();

  const campusCoordinates = useMemo(
    () => data?.data?.map((campus) => Object.values(campus.coordinates)),
    [data]
  );

  const campusTree = campusCoordinates && new CampusTree(campusCoordinates);

  const query = [deviceCoordinates.longitude, deviceCoordinates.latitude];
  const closestCoordinatesArray = campusTree && campusTree.findClosest(query);

  const closestCampusCoordinates: Coordinates = {
    longitude: closestCoordinatesArray ? closestCoordinatesArray[0] : Infinity,
    latitude: closestCoordinatesArray ? closestCoordinatesArray[1] : Infinity
  };

  return closestCampusCoordinates;
};

export default useClosestCampus;
