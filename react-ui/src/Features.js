import MenuNavAndFooter from "./MenuNavAndFooter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import mapExample from "./images/map-example.png"
import mapFollow from "./images/coorindator-follow-example.png"

const Features = () => {
    return (
        <MenuNavAndFooter>

            <div className="container-fluid container-login-scroll">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-6 col-xl-6 col-lg-8 col-md-8 col-sm-12 col-xs-12 text-white">

                        <h3>
                            Présentation générale
                        </h3>

                        <p>
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/hU-YN_MX9IM"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </p>

                        <hr/>
                        <h3>
                            Compatibilité de l'application
                        </h3>
                        <p>
                            L'application peut être utilisée à partir d'un ordinateur (Windows, Linux, Mac) ou d'un
                            smartphone (Android, iOS).
                        </p>
                        <p>
                            Pour pouvoir utiliser l'application sur votre smartphone de la même façon qu'une application
                            native, il
                            suffit de suivre
                            les instructions données dans la vidéo ci-dessous.
                        </p>

                        <p>
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/hU-YN_MX9IM?start=134"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </p>

                        <hr/>

                        <h3>
                            Fonctionnalités accessibles aux "reporteurs"
                        </h3>
                        <p>
                            Les "reporteurs" sont les usagers qui désirent faire remonter des problèmes qu'ils
                            rencontrent sur leur trajet quotidien à la locale concernée :
                            <ul>
                                <li>Parking sauvage régulier</li>
                                <li>Problème de signalisation</li>
                                <li>Endroits dangereux pour les cyclistes</li>
                                <li>...</li>
                            </ul>
                        </p>

                        <p>
                            <img src={mapExample} className="picture-page-vert rounded"/>
                        </p>

                        <p>
                            L'application prend la forme d'une carte qui permet de visualiser les signalements.
                        </p>

                        <p>
                            L'utilisateur peut :
                            <ul>
                                <li>Ajouter un nouveau signalement (bouton 4)</li>
                                <li>Afficher sa position actuelle sur la carte (bouton 3)</li>
                                <li>Visualiser une liste de tous les incidents (bouton 2)</li>
                                <li>Se déconnecter (bouton 1)</li>
                            </ul>
                        </p>

                        <p>
                            En cliquant sur un signalement (les points rouges), l'utilisateur a accès à :
                            <ul>
                                <li>La date du signalement;</li>
                                <li>Le type de signalement;</li>
                                <li>Les commentaires éventuels;</li>
                                <li>Une photo éventuelle;</li>
                                <li>la possibilité de voter pour la gravité de l'évènement.</li>
                                <li>Les annotations (le suivi) ajoutées par le coordinateur qui gère le signalement.
                                </li>
                            </ul>
                        </p>

                        <p>
                            La façon d'utiliser l'application est expliquée dans cette vidéo. <br/><br/>
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/hU-YN_MX9IM?start=134"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </p>

                        <h4>
                            Ajout d'un signalement
                        </h4>

                        <p>
                            La carte comporte un certain nombre de zones bleutées. Ces zones correspondent aux communes
                            inscrites sur Samy (le coordinateur du GRACQ pour cette commune). Comme personne ne gère
                            les signalements en dehors de ces zones,
                            le "reporteurs" n'ont pas la possibilité de rajouter un signalement en dehors.
                        </p>

                        <hr/>

                        <h3>
                            Fonctionnalités accessibles aux coordinateurs
                        </h3>

                        <p>
                            Si les coordinateurs sont enregistrés en tant que tel. Ils verront un bouton supplémentaire
                            s'afficher sur la carte (une petite malette dans le coin supérieur droit). Cela lui
                            permet d'accéder au menu de gestion des signalements pour les communes dont il
                            est responsable.
                        </p>

                        <h4>Attribution</h4>

                        <p>
                            Pour l'instant, les nouveaux signalement ne sont pas automatiquement assignés à un
                            coordinateur. Il faut les assigner manuellement à une commune. L'onglet "Attribution"
                            permet donc d'assigner les nouveaux signalements à une commune et donc à un coordinateur
                            responsable. Cela changera dans une prochaine mise à jour et cet onglet disparaitra donc à
                            ce moment.
                        </p>

                        <h4>Suvi des signalements</h4>

                        <p>
                            <a href={mapFollow} target={"_blank"}>
                                <img src={mapFollow} className="picture-page-hor rounded"/>
                            </a>
                        </p>

                        <p>
                            Le second onglet "Suivi des signalements" permet au coordinateur de gérer les signalements.
                        </p>

                        <p>
                            Fonctionnalités de suivi :
                            <ul>
                                <li>Choix du statut du signalement :
                                    <ul>
                                        <li><span className="fw-bold">Signalé</span> : statut initial;</li>
                                        <li><span className="fw-bold">Attribué</span> : signalement vient d'être
                                            attribué à une locale;
                                        </li>
                                        <li><span className="fw-bold">Signalé aux autorités</span> : signalement a été
                                            envoyé aux autorités;
                                        </li>
                                        <li><span className="fw-bold">Classé sans suite</span> : signalement n'a pas été
                                            jugé pertinent;
                                        </li>
                                        <li><span className="fw-bold">Intégration dans un rapport</span> : signalement
                                            qui s'intègre dans une problématique plus large sur le long terme;
                                        </li>
                                        <li><span className="fw-bold">Solutionné</span> : problème résolu.</li>
                                    </ul>
                                </li>
                                <li>Choix de l'interlocuteur :
                                    <ul>
                                        <li>Commune</li>
                                        <li>Région</li>
                                    </ul>
                                </li>
                                <li>Ajout d'annotations qui permettent d'effectuer le suivi du dossier. L'heure et
                                    la date sont enregistrées.
                                </li>
                            </ul>
                        </p>

                        <p className="fw-bold">
                            Les utilisateurs ont accès à toutes les informations encodées par le coordinateur sur la
                            carte principale.
                        </p>

                    </div>
                    <div className="col"></div>
                </div>
            </div>

        </MenuNavAndFooter>
    )
}

export default Features
