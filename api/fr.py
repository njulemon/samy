from api.enum import ReportUserType, ReportCategory1, ReportCategory2, BasicTerm

report_form_fr = {
    # default option
    ReportUserType.NONE_USER_TYPE.name: "Choix type d'usager ?",
    ReportCategory1.NONE_CAT_1.name: "Choix type de problème ?",
    ReportCategory2.NONE_CAT_2.name: "Détail problème",

    # user type
    ReportUserType.CYCLIST.name: "cycliste",
    ReportUserType.PEDESTRIAN.name: "piéton",

    # cat 1
    ReportCategory1.INCIDENT.name: "incident ponctuel",
    ReportCategory1.INFRASTRUCTURE.name: "infrastructure",

    # cat 2
    ReportCategory2.BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED.name: "bordure sur la piste cyclable trop abrupte",
    ReportCategory2.BICYCLE_PATH_HOLE.name: "trou dans la piste cyclable",
    ReportCategory2.BICYCLE_PATH_POOR_CONDITION.name: "piste cyclable en mauvais état",
    ReportCategory2.BICYCLE_PATH_UNCLEAR_SIGNAGE.name: "signalisation sur la piste cyclable pas clair",
    ReportCategory2.BICYCLE_PATH_VANISHED_PAINT.name: "peinture de la piste cyclable effacée",
    ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION.name: "situation dangereuse, piste cyclable nécessaire",
    ReportCategory2.SIGNAGE__BAD_CONDITION.name: "panneau de signalisation en mauvaise condition",
    ReportCategory2.SIGNAGE__MISSING.name: "panneau de signalisation manquant"
}

basic_terms = {
    BasicTerm.PEDESTRIAN.name: 'piéton',
    BasicTerm.CYCLIST.name: "cycliste"
}
