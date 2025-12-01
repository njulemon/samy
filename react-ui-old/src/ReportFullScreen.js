import React from "react";

import FooterSamy from "./FooterSamy";
import ReportCard from "./ReportCard";

const ReportFullScreen = () => {


    return (
        <div className="container-fluid m-0 p-0 main-page-footer-header">
            {
                <ReportCard/>
            }
            <FooterSamy/>
        </div>
    )
}

export default ReportFullScreen