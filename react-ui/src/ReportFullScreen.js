import useAnnotationHook from "./hooks/useAnnotationHook";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {uriReport, uriVotes, urlServer} from "./def/Definitions";
import {updateNotes} from "./app/States";
import {PatchCsrf, PostCsrf} from "./api/Csrf";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBiking, faWalking} from "@fortawesome/free-solid-svg-icons";
import {capitalize} from "./Tools/String";
import {Accordion, Card} from "react-bootstrap";
import {Rating} from "@mui/material";
import {urlify} from "./Tools/Urlify";
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