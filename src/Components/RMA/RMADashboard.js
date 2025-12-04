// src/Components/RMA/RMADashboard.js
import React from "react";
import HomeForAdmin from "../UserProfile/HomeForAdmin";
import RmaLayout from "./RmaLayout";

function RmaDashboard() {
  return (
    <RmaLayout>
      <HomeForAdmin title="RMA Dashboard" />
    </RmaLayout>
  );
}

export default RmaDashboard;
