import enum
from enum import Enum
from typing import List, Tuple


# ----------------------------------------------------------------------------------------------------------------------
class ModelEnum(Enum):
    """
    Gives method in order to :
    - retrieve the list of choices for integers model fields in the right format.
    - give the correspondence name of the int enum item.
    """

    @classmethod
    def get_model_choices(cls) -> List[Tuple[int, str]]:
        return [(item.value, item.name) for item in cls]

    @classmethod
    def get_model_choices_same(cls) -> List[Tuple[int, str]]:
        return [(item.name, item.name) for item in cls]

    @classmethod
    def get_name(cls, value: int) -> str:
        return cls(value)

    @classmethod
    def get_enum(cls, name: str):
        for item in cls:
            if item.name == name:
                return item

    @staticmethod
    def get_category_1(operation: 'ReportOperation'):
        return map_category_1[operation]

    @staticmethod
    def get_category_2(operation: 'ReportOperation', category_1: 'ReportCategory1'):
        return map_category_2[operation][category_1]


# ----------------------------------------------------------------------------------------------------------------------
# BASE
@enum.unique
class BasicTerm(enum.Enum):
    PEDESTRIAN = 0
    CYCLIST = 1


# ----------------------------------------------------------------------------------------------------------------------
# REPORTS (WARNING : DO NOT DELETE THOSE ENUMS EVENT IF NOT NEEDED ANYMORE !)
# Instead, add new ones if needed !
class ReportUserType(ModelEnum):
    NONE_USER_TYPE = 0
    PEDESTRIAN = 1
    CYCLIST = 2


class ReportOperation(ModelEnum):
    NONE_OPERATION = 0
    LOCALE = 1
    # set other type of operations.
    BLACK_DOT_WALLONIA = 2

    PEDESTRIAN_ISSUES = 3


class ReportCategory1(ModelEnum):
    NONE_CAT_1 = 0
    INFRASTRUCTURE = 1
    INCIDENT = 2


class ReportCategory2(ModelEnum):
    NONE_CAT_2 = 0
    # subset items of the items of cat 1.

    LANE_HOLE = 1
    LANE_POOR_CONDITION = 2
    LANE_VANISHED_PAINT = 3
    LANE_UNCLEAR_SIGNAGE = 4
    LANE_BORDER_NEED_TO_BE_LOWERED = 5
    LANE_SLIPPERY = 6
    LANE_TOO_THIN = 7
    LANE_CROSSING_DANGEROUS = 8
    LANE_PRIORITY_NOT_RESPECTED_DANGEROUS = 9

    LANE_CROSSWALK_MISSING = 10

    RACK_DAMAGED = 11

    NO_BICYCLE_PATH_DANGEROUS_SITUATION = 12

    SIGNAGE__MISSING = 13
    SIGNAGE__BAD_CONDITION = 14

    INCIDENT_GLASS_ON_LANE = 15
    INCIDENT_NAILS_ON_LANE = 16

    ILLEGAL_PARKING = 17
    OBSTACLE_ON_THE_CYLEWAY = 29

    # Wallonia black dot
    WAL_DANGEROUS_CROSSING = 18
    WAL_CROWDED_PLACE = 19
    WAL_DEGRADED_ROAD = 20
    WAL_PUDDLE_WATER = 21
    WAL_LACK_PUBLIC_LIGHTING = 22
    WAL_SIGNIFICANT_DROP_ELEVATION = 23
    WAL_HIGH_SPEED = 24

    OTHER_IN_COMMENT = 25

    # add for pedestrians
    OBSTACLE_ON_THE_SIDEWALK = 26
    CURB_PEDESTRIAN_CROSSING_TOO_HIGH = 27
    MISSING_PEDESTRIAN_CROSSING = 28


# ----------------------------------------------------------------------------------------------------------------------
# CATEGORIES TREE
map_category_1 = {
    ReportOperation.LOCALE: [
        ReportCategory1.NONE_CAT_1,
        ReportCategory1.INFRASTRUCTURE,
        ReportCategory1.INCIDENT],
    # set options for other operations here...
    ReportOperation.BLACK_DOT_WALLONIA: [
        ReportCategory1.NONE_CAT_1,
        ReportCategory1.INFRASTRUCTURE],
    # set options for other operations here...
    ReportOperation.PEDESTRIAN_ISSUES: [
        ReportCategory1.NONE_CAT_1,
        ReportCategory1.INFRASTRUCTURE]
}

map_category_2 = {
    ReportOperation.LOCALE:
        {
            ReportCategory1.INFRASTRUCTURE: [
                ReportCategory2.LANE_HOLE,
                ReportCategory2.LANE_POOR_CONDITION,
                ReportCategory2.LANE_VANISHED_PAINT,
                ReportCategory2.LANE_UNCLEAR_SIGNAGE,
                ReportCategory2.LANE_BORDER_NEED_TO_BE_LOWERED,
                ReportCategory2.LANE_SLIPPERY,
                ReportCategory2.LANE_TOO_THIN,
                ReportCategory2.LANE_CROSSING_DANGEROUS,
                ReportCategory2.LANE_PRIORITY_NOT_RESPECTED_DANGEROUS,
                ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION,
                ReportCategory2.RACK_DAMAGED,
                ReportCategory2.SIGNAGE__MISSING,
                ReportCategory2.SIGNAGE__BAD_CONDITION
                ReportCategory2.OBSTACLE_ON_THE_CYLEWAY
            ],
            ReportCategory1.INCIDENT: [
                ReportCategory2.ILLEGAL_PARKING,
                ReportCategory2.INCIDENT_GLASS_ON_LANE,
                ReportCategory2.INCIDENT_NAILS_ON_LANE
            ]
        },
    ReportOperation.BLACK_DOT_WALLONIA:
        {
            ReportCategory1.INFRASTRUCTURE: [
                ReportCategory2.WAL_DANGEROUS_CROSSING,
                ReportCategory2.WAL_CROWDED_PLACE,
                ReportCategory2.WAL_DEGRADED_ROAD,
                ReportCategory2.WAL_PUDDLE_WATER,
                ReportCategory2.SIGNAGE__MISSING,
                ReportCategory2.WAL_LACK_PUBLIC_LIGHTING,
                ReportCategory2.WAL_SIGNIFICANT_DROP_ELEVATION,
                ReportCategory2.WAL_HIGH_SPEED,
                ReportCategory2.OTHER_IN_COMMENT
            ]
        },
    ReportOperation.PEDESTRIAN_ISSUES:
        {
            ReportCategory1.INFRASTRUCTURE: [
                ReportCategory2.CURB_PEDESTRIAN_CROSSING_TOO_HIGH,
                ReportCategory2.OBSTACLE_ON_THE_SIDEWALK,
                ReportCategory2.LANE_CROSSING_DANGEROUS,
                ReportCategory2.ILLEGAL_PARKING,
                ReportCategory2.MISSING_PEDESTRIAN_CROSSING,
            ]
        }
}


# ----------------------------------------------------------------------------------------------------------------------
# IN CHARGE
class InCharge(ModelEnum):
    IC_IN_CHARGE_NONE = 0
    IC_MUNICIPALITY = 1
    IC_REGION = 2


# ----------------------------------------------------------------------------------------------------------------------
# STATUS REPORT
class ReportStatus(ModelEnum):
    RS_STATUS_NONE = 0
    RS_REPORTED = 1
    RS_CLASSIFIED = 2
    RS_REPORTED_TO_AUTHORITIES = 3
    RS_NOT_RELEVANT = 4
    RS_REPORT_IN_PROGRESS = 5
    RS_SOLVED = 6
    RS_CHECK_ON_THE_FIELD = 7


# ----------------------------------------------------------------------------------------------------------------------
# NOTIFICATIONS (EMAIL)
class Notifications(ModelEnum):
    NOT_NEWSLETTER = 0
    NOT_NEW_REPORT = 1
    NOT_NEW_ANNOTATION = 2
