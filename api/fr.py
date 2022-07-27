from api.enum import ReportUserType, ReportCategory1, ReportCategory2, BasicTerm, ReportOperation, InCharge, \
    ReportStatus, Notifications

report_form_fr = {
    # TODO : this list should be general, not related to form only. Change the name.

    # default option
    ReportUserType.NONE_USER_TYPE.name: "Usager ?",
    ReportCategory1.NONE_CAT_1.name: "Problème ?",
    ReportCategory2.NONE_CAT_2.name: "Détail ?",

    # user type
    ReportUserType.CYCLIST.name: "cycliste",
    ReportUserType.PEDESTRIAN.name: "piéton",

    # operation
    ReportOperation.NONE_OPERATION.name: "Signaler à",
    ReportOperation.LOCALE.name: "locale du GRACQ",

    # cat 1
    ReportCategory1.INCIDENT.name: "incident",
    ReportCategory1.INFRASTRUCTURE.name: "infrastructure",
    ReportCategory1.CUSHIONS.name: "coussins berlinois",

    # cat 2
    ReportCategory2.LANE_BORDER_NEED_TO_BE_LOWERED.name: "bordure sur piste cyclable trop abrupte",
    ReportCategory2.LANE_HOLE.name: "trou(s)",
    ReportCategory2.LANE_POOR_CONDITION.name: "piste cyclable en mauvais état",
    ReportCategory2.LANE_UNCLEAR_SIGNAGE.name: "signalisation incompréhensible",
    ReportCategory2.LANE_VANISHED_PAINT.name: "peinture effacée",
    ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION.name: "situation dangereuse, piste cyclable nécessaire",
    ReportCategory2.SIGNAGE__BAD_CONDITION.name: "panneau de signalisation en mauvaise état",
    ReportCategory2.SIGNAGE__MISSING.name: "panneau de signalisation manquant",
    ReportCategory2.LANE_SLIPPERY.name: "revêtement glissant",
    ReportCategory2.LANE_TOO_THIN.name: "piste trop étroite",
    ReportCategory2.LANE_CROSSING_DANGEROUS.name: "croisement dangereux car mal aménagé",
    ReportCategory2.LANE_PRIORITY_NOT_RESPECTED_DANGEROUS.name: 'priorité cycliste peu respectée, dangereux',
    ReportCategory2.RACK_DAMAGED.name: 'Arceaux ou box vélo endommagé',
    ReportCategory2.INCIDENT_GLASS_ON_LANE.name: "Présence régulière de verre",
    ReportCategory2.INCIDENT_NAILS_ON_LANE.name: "Présence de clou ou équivalent",
    ReportCategory2.ILLEGAL_PARKING.name: "Parking sauvage régulier",
    ReportCategory2.CUSHION_PARKING_SIDE.name: "Parking possible sur le côté",
    ReportCategory2.CUSHION_DAMAGED.name: "Endommagé",

    # In charge
    InCharge.IC_IN_CHARGE_NONE.name: "Autoritée compétente non-définie",
    InCharge.IC_MUNICIPALITY.name: "Commune",
    InCharge.IC_REGION.name: "Région",

    # status
    ReportStatus.RS_STATUS_NONE.name: "Statut non-défini",
    ReportStatus.RS_REPORTED.name: "Signalé",
    ReportStatus.RS_CLASSIFIED.name: "Attribué",
    ReportStatus.RS_REPORTED_TO_AUTHORITIES.name: "Signalé aux autorités",
    ReportStatus.RS_NOT_RELEVANT.name: "Classé sans suite",
    ReportStatus.RS_REPORT_IN_PROGRESS.name: "Intégration dans un rapport",
    ReportStatus.RS_SOLVED.name: "Solutionné",

    # notifications
    Notifications.NOT_NEWSLETTER.name: "Abonnement Newsletter",
    Notifications.NOT_NEW_REPORT.name: "Ajout d'un signalement (uniquement les vôtres)",
    Notifications.NOT_NEW_ANNOTATION.name: "Mise à jour de vos signalements",

}

basic_terms = {
    BasicTerm.PEDESTRIAN.name: 'piéton',
    BasicTerm.CYCLIST.name: "cycliste"
}
