import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useFormik} from "formik";
import {urlServer} from "./def/Definitions";
import {PostCsrf} from "./api/Csrf";
import {denyAccess, giveAccess} from "./app/Login";

function Login() {


    const dispatch = useAppDispatch()
    const isLogged = useAppSelector((state) => state.isLogged.value)

    const url = urlServer + '/api/login/'

    // <Button variant="primary" onClick={() => {dispatch(giveAccess())}}>Login</Button>{' '}

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: values => {
            const data = {'username': values.username, 'password': values.password}

            PostCsrf(url, data)
                .then(
                    (isLogged) => {
                        if (isLogged) {
                            alert(isLogged)
                            dispatch(giveAccess())
                        } else {
                            alert(isLogged)
                            dispatch(denyAccess())
                        }
                    }
                )
                .catch((reason) => alert('Bad e-mail/password combination' + reason))
        },
    });

    return (
        <>
            <div className=" container-fluid fill-height">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col">
                                            <form onSubmit={formik.handleSubmit}>
                                                <div className="mb-3">
                                                    <div className="form-label">Adresse e-mail</div>
                                                    <input className="form-control"
                                                           name="username"
                                                           id="username"
                                                           type="text"
                                                           onChange={formik.handleChange}
                                                           value={formik.values.username}
                                                           placeholder="Enter email"/>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="form-label">Mot de passe</div>
                                                    <input className="form-control"
                                                           name="password"
                                                           id="password"
                                                           type="password"
                                                           onChange={formik.handleChange}
                                                           value={formik.values.password}
                                                           placeholder="Password"/>
                                                </div>
                                                <div className="mb-3 form-check">
                                                    <input className="form-check-input"
                                                           type="checkbox"/>
                                                    <label className="form-check-label">
                                                        Se souvenir de moi
                                                    </label>
                                                </div>
                                                <button className="btn btn-primary form-button" type="submit">
                                                    Se connecter
                                                </button>
                                            </form>
                                            <hr/>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className='col col-xs-6 text-left'>
                                            <a href="#"> Mot de passe oublié ?</a>
                                        </div>
                                        <div className="col col-xs-6 text-right">
                                            <a href='#'>S'enregistrer</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row"></div>
            </div>
        </>
    )
}

export default Login