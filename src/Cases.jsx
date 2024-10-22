import React, { useEffect, useRef, useState } from "react";

export default function Cases() {
  const [casesData, setCasesData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);
  const [vaccinationData, setVaccinationData] = useState([]);
  const [state, setState] = useState("tamilnadu");
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [editableCaseData, setEditableCaseData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableHospitalData, setEditableHospitalData] = useState({});
  const inputRef = useRef();

  function handleSearch(e) {
    const formattedState = inputRef.current.value
      .toLowerCase()
      .replace(/\s+/g, "");
    setState(formattedState);
  }

  useEffect(() => {
    async function fetchData() {
      const casesResponse = await fetch(
        `http://localhost:8080/covid/cases/${state}`
      );
      const data1 = await casesResponse.json();
      setCasesData(data1);

      const hospitalResponse = await fetch(
        `http://localhost:8080/covid/hospitals/resources/${state}`
      );
      const data2 = await hospitalResponse.json();
      setHospitalData(data2);

      const vaccinationResponse = await fetch(
        `http://localhost:8080/covid/vaccination-status/${state}`
      );
      const data3 = await vaccinationResponse.json();
      setVaccinationData(data3);
    }
    fetchData();
  }, [state]);

  const handleCaseEditClick = (data) => {
    setIsEditingCase(true);
    setEditableCaseData(data);
  };

  const handleEditClick = (data) => {
    setIsEditing(true);
    setEditableHospitalData(data);
  };

  const handleCaseInputChange = (e) => {
    const { name, value } = e.target;
    setEditableCaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableHospitalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCaseUpdateClick = async () => {
    const response = await fetch(`http://localhost:8080/covid/cases/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editableCaseData),
    });
    if (response.ok) {
      setCasesData([editableCaseData]); // Update the case data in the UI
      setIsEditingCase(false); // Exit edit mode
    }
  };

  const handleUpdateClick = async () => {
    const response = await fetch(
      `http://localhost:8080/covid/hospitals/resources/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableHospitalData),
      }
    );
    if (response.ok) {
      setHospitalData([editableHospitalData]);
      setIsEditing(false);
    }
  };

  return (
    <div className="pb-5">
      <div className="text-3xl text-center py-5 bg-slate-700 text-white">
        <h1>INDIA COVID-19 Tracker</h1>
      </div>
      <div>
        <div className="flex justify-center items-center pt-10 pb-5">
          <input
            type="input"
            ref={inputRef}
            placeholder="Enter a State"
            className="px-3 py-2 bg-gray-200 rounded-md outline-none w-[30%]"
          ></input>
          <button
            onClick={handleSearch}
            className="ml-3 px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>
        {casesData.map((data) => (
          <div className="flex flex-col justify-center items-center">
            <div>
              <div>
                <h2 className="text-2xl font-semibold text-center py-5">
                  {data.name.toUpperCase() + " COVID-19 CASES"}
                </h2>
              </div>
            </div>
            <div className="flex flex-col w-[35%] bg-gray-200 py-5 gap-2 rounded-lg text-center">
              {isEditingCase ? (
                <>
                  <div className="text-xl text-left pl-5">
                    <label>Confirmed Cases: </label>
                    <input
                      type="number"
                      name="cases"
                      value={editableCaseData.cases}
                      onChange={handleCaseInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="text-xl text-left pl-5">
                    <label>Recovered Cases: </label>
                    <input
                      type="number"
                      name="recovered"
                      value={editableCaseData.recovered}
                      onChange={handleCaseInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="text-xl text-left pl-5">
                    <label>Deaths: </label>
                    <input
                      type="number"
                      name="deaths"
                      value={editableCaseData.deaths}
                      onChange={handleCaseInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleCaseUpdateClick}
                      className="px-3 py-2 mt-5 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl">
                    <span>Confirmed Cases: {data.cases}</span>
                  </div>
                  <div className="text-xl">
                    <span>Recovered Cases: {data.recovered}</span>
                  </div>
                  <div className="text-xl">
                    <span>Deaths: {data.deaths}</span>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleCaseEditClick(data)}
                      className="px-3 py-2 mt-5 bg-blue-500 text-white rounded-md"
                    >
                      Update Case Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {hospitalData.map((data) => (
          <div
            className="flex flex-col justify-center items-center"
            key={data.id}
          >
            <div>
              <div>
                <h2 className="text-2xl font-semibold text-center py-5">
                  HOSPITALS DATA
                </h2>
              </div>
            </div>
            <div className="flex flex-col w-[35%] bg-gray-200 py-5 gap-2 rounded-lg text-center">
              {isEditing ? (
                <>
                  <div className="text-xl text-left pl-5">
                    <label>Hospitals: </label>
                    <input
                      type="number"
                      name="hospitals"
                      value={editableHospitalData.hospitals}
                      onChange={handleInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="text-xl text-left pl-5">
                    <label>Beds: </label>
                    <input
                      type="number"
                      name="beds"
                      value={editableHospitalData.beds}
                      onChange={handleInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="text-xl text-left pl-5">
                    <label>Ventilators: </label>
                    <input
                      type="number"
                      name="ventilators"
                      value={editableHospitalData.ventilators}
                      onChange={handleInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="text-xl text-left pl-5">
                    <label>ICU Capacity: </label>
                    <input
                      type="number"
                      name="icu_capacity"
                      value={editableHospitalData.icu_capacity}
                      onChange={handleInputChange}
                      className="px-2 py-1 rounded-md"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleUpdateClick}
                      className="px-3 py-2 mt-5 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl">
                    <span>Hospitals: {data.hospitals}</span>
                  </div>
                  <div className="text-xl">
                    <span>Beds: {data.beds}</span>
                  </div>
                  <div className="text-xl">
                    <span>Ventilators: {data.ventilators}</span>
                  </div>
                  <div className="text-xl">
                    <span>ICU Capacity: {data.icu_capacity}</span>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleEditClick(data)}
                      className="px-3 py-2 mt-5 bg-blue-500 text-white rounded-md"
                    >
                      Update Hospital Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {vaccinationData.map((data) => (
          <div className="flex flex-col justify-center items-center">
            <div>
              <div>
                <h2 className="text-2xl font-semibold text-center py-5">
                  VACCINATION DATA
                </h2>
              </div>
            </div>
            <div className="flex flex-col w-[35%] bg-gray-200 py-5 gap-2 rounded-lg text-center">
              <div className="text-xl">
                <span>Total Population: {data.total_population}</span>
              </div>
              <div className="text-xl">
                <span>Partially Vaccinated: {data.partially_vaccinated}</span>
              </div>
              <div className="text-xl">
                <span>Fully Vaccinated: {data.fully_vaccinated}</span>
              </div>
              <div className="text-xl">
                <span>Percentage Vaccinated: {data.percentage_vaccinated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
