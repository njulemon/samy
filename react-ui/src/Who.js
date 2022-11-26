import MenuNavAndFooter from "./MenuNavAndFooter";

const Who = () => {
    return (
        <MenuNavAndFooter>

            <div className="container-fluid container-login-scroll">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div className="card shadow-lg rounded-lg bg-transparent">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col text-white">

                                            <h3>Le GRACQ</h3>

                                            <p>
                                                Pour tout savoir sur le GRACQ : <a className="link-white" rel="noreferrer"
                                                                                   href="https://www.gracq.org/"
                                                                                   target="_blank">https://www.gracq.org/</a>.
                                            </p>

                                            <h3>
                                                Notre locale (Watermael-Boitsfort)
                                            </h3>

                                            <p>
                                                C'est pour la locale du GRACQ de Watermael-Boitsfort qu'a été lancé
                                                cette application. Elle avait été intialement conçue pour notre
                                                usage interne. Mais comme les cyclistes n'ont pas de frontières, on
                                                s'est rapidement rendu compte que
                                                les signalements débordaient sur les autres communes. C'est pourquoi des
                                                outils qui permettent à chaque
                                                locale de gérer ses propres signalements ont été ajoutés.
                                            </p>

                                            <p>
                                                La plateforme est ouverte à tous. Le code sur lequel cette plateforme
                                                est basée est open source et
                                                disponible ici : <a className="link-white" rel="noreferrer"
                                                                    href="https://github.com/njulemon/samy"
                                                                    target="_blank">https://github.com/njulemon/samy</a>
                                            </p>

                                            <h4>
                                                Nous contacter
                                            </h4>

                                            <p>
                                                Mail : <a className="link-white"
                                                          href="mailto:watermael-boitsfort@gracq.org">watermael-boitsfort@gracq.org</a>

                                            <br/>
                                            Facebook : <a className="link-white"
                                                             href="https://www.facebook.com/gracqwb/"
                                                             target="_blank" rel="noreferrer">https://www.facebook.com/gracqwb/</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>

        </MenuNavAndFooter>
    )
}

export default Who