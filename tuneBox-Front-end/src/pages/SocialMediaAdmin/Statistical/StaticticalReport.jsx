import React, { useState, useEffect, useCallback } from "react";

import { 
  LoadAllTrackReport,
  LoadAllUserReport,
  LoadAllAlbumReport,
  LoadAllPostReport
 } from "../../../service/SocialMediaAdminService";

function StaticticalReport() {
  const today = new Date();
  const sevenDaysAgo = new Date(); 
  sevenDaysAgo.setDate(today.getDate() - 7); 
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); 
    }
    return dates;
  };
  const fetchData = async () => {
    //rp Album
    const responseLoadAllAlbumReport = await LoadAllAlbumReport(
    );
    if (responseLoadAllAlbumReport.status) {
      setReportAlbum(responseLoadAllAlbumReport.data);
    }
    //rp user
    const responseLoadAllUserReport = await LoadAllUserReport();
    if (responseLoadAllUserReport.status) {
      setReportUser(responseLoadAllUserReport.data);
    }

    //rp Track
    const responseLoadAllTrackReport = await LoadAllTrackReport(
    );
    if (responseLoadAllTrackReport.status) {
      setReportTrack(responseLoadAllTrackReport.data);
    }
  };
  // goi Api
  useEffect(() => {
    fetchData();
  }, []);
  return (
<div>Hello Rp ne</div>
  );
}

export default StaticticalReport;
