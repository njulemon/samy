import logo_wb from "./images/gracq-wb.jpg"

const FooterSamy = () => {

    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="row mt-3 mb-2">
                    <div className="col">
                    </div>
                    <div className="col-auto text-center">
                        <img src={logo_wb} className="logo-gracq-footer d-none d-sm-block shadow-lg" alt="logo gracq"/>
                    </div>
                    <div className="col">
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center mb-2">
                        Samy permet de signaler les problèmes sur votre trajet quotidien et est accessible à toutes les
                        locales du GRACQ sur simple demande à <a className="link-white" href="mailto:watermael-boitsfort@gracq.org">watermael-boitsfort@gracq.org</a>.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterSamy