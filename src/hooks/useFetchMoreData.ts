import React from "react";
import uniqBy from "lodash/uniqBy";

function useFetchMoreData<T>({
  uniqKey = "_id",
  dataSet,
  isSuccess
}: {
  dataSet?: T[];
  isSuccess: boolean;
  uniqKey: string | number;
}): {
  data: T[];
} {
  const [data, setData] = React.useState<T[] | undefined>(dataSet);

  React.useEffect(() => {
    if (isSuccess) {
      setData((prev) => {
        if (dataSet && prev) {
          return uniqBy([...prev, ...dataSet], uniqKey);
        } else if (!prev && dataSet) {
          return dataSet;
        }
        return prev;
      });
    }
     
  }, [isSuccess, dataSet]);

  return { data: (data as T[]) || (dataSet as T[]) };
}

export default useFetchMoreData;
