import React, { useEffect, useState } from "react";

const DynamicSelect = ({ len, setSelectedSampleLen, selectedSampleLen }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let tempOpts = [];
    if (len > 500) {
      let i = 500;
      tempOpts.push(i);
      do {
        i += 500;
        tempOpts.push(i);
      } while (i <= len);
    } else {
      tempOpts.push(500);
    }
    setOptions(tempOpts);
  }, [len, selectedSampleLen]);

  return (
    <div>
      <label htmlFor="item-select">Select Item:</label>
      <select
        id="item-select"
        name="items"
        onChange={(e) => setSelectedSampleLen(e.target.value)}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicSelect;
