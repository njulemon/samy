import {LinearProgress} from "@mui/material";

const LoadingAnnex = ({progress}) => {
    return (
        <div className="">
            Chargement des annexes
            <LinearProgress variant="determinate" value={progress} />
        </div>
    )
}

export default LoadingAnnex