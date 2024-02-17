import React, { useState } from "react";

export default function useCheckBoxExport (): [string[], (e: boolean, id: string) => void]{
  const [arrCheckBox, setArrCheckBox] = useState<string[]>([]);
  const onChangeCheckBox   = (e: boolean, id: string) => {
    if (e) {
      setArrCheckBox([...arrCheckBox, id])
    } else {
      const newArr = arrCheckBox?.filter((itemId, index) => itemId !== id);
      setArrCheckBox(newArr)
    };
  };
  return [arrCheckBox, onChangeCheckBox];
};