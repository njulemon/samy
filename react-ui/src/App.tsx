import './App.css';
import MapWithMenu from "./MapWithMenu";

import Login from "./Login";
import {useAppSelector} from "./app/hooks";


function App() {

    const selector = useAppSelector((state) => state.isLogged.value)

    return (
        <div className="App">
            {selector ? <MapWithMenu/> : <Login/>}
        </div>
    );
}

export default App;
