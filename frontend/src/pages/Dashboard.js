import React, { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    API.get("/doctors")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Doctors</h1>

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px"
          }}
        >
          <h3>{doctor.name}</h3>
          <p>{doctor.specialization}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;