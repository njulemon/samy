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
    def get_name(cls, value: int) -> str:
        return cls(value)

    @classmethod
    def get_enum(cls, name: str):
        for item in cls:
            if item.name == name:
                return item

    @staticmethod
    def get_category_1(user_type: 'ReportUserType'):
        return map_category_1[user_type]

    @staticmethod
    def get_category_2(user_type: 'ReportUserType', category_1: 'ReportCategory1'):
        return map_category_2[(user_type, category_1)]


# ----------------------------------------------------------------------------------------------------------------------
# BASE
@enum.unique
class BasicTerm(enum.Enum):
    PEDESTRIAN = 0
    CYCLIST = 1




# ----------------------------------------------------------------------------------------------------------------------
# REPORTS
class ReportUserType(ModelEnum):
    NONE_USER_TYPE = 0
    PEDESTRIAN = 1
    CYCLIST = 2


class ReportCategory1(ModelEnum):
    NONE_CAT_1 = 0
    INFRASTRUCTURE = 1
    INCIDENT = 2


class ReportCategory2(ModelEnum):
    NONE_CAT_2 = 0
    # subset items of the items of cat 1.

    BICYCLE_PATH_HOLE = 1
    BICYCLE_PATH_POOR_CONDITION = 2
    BICYCLE_PATH_VANISHED_PAINT = 3
    BICYCLE_PATH_UNCLEAR_SIGNAGE = 4
    BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED = 5

    NO_BICYCLE_PATH_DANGEROUS_SITUATION = 6

    SIGNAGE__MISSING = 7
    SIGNAGE__BAD_CONDITION = 8


# ----------------------------------------------------------------------------------------------------------------------
# CATEGORIES TREE
map_category_1 = {
    ReportUserType.PEDESTRIAN: [ReportCategory1.NONE_CAT_1, ReportCategory1.INFRASTRUCTURE, ReportCategory1.INCIDENT],
    ReportUserType.CYCLIST: [ReportCategory1.NONE_CAT_1, ReportCategory1.INFRASTRUCTURE, ReportCategory1.INCIDENT]
}

map_category_2 = {
    ReportUserType.PEDESTRIAN:
        {ReportCategory1.INFRASTRUCTURE: [
            ReportCategory2.NONE_CAT_2,
            ReportCategory2.BICYCLE_PATH_HOLE,
            ReportCategory2.BICYCLE_PATH_POOR_CONDITION,
            ReportCategory2.BICYCLE_PATH_VANISHED_PAINT,
            ReportCategory2.BICYCLE_PATH_UNCLEAR_SIGNAGE,
            ReportCategory2.BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED,
            ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION,
            ReportCategory2.SIGNAGE__MISSING,
            ReportCategory2.SIGNAGE__BAD_CONDITION
        ],
            ReportCategory1.INCIDENT: [
                ReportCategory2.NONE_CAT_2,
                ReportCategory2.BICYCLE_PATH_HOLE,
                ReportCategory2.BICYCLE_PATH_POOR_CONDITION,
                ReportCategory2.BICYCLE_PATH_VANISHED_PAINT,
                ReportCategory2.BICYCLE_PATH_UNCLEAR_SIGNAGE,
                ReportCategory2.BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED,
                ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION,
                ReportCategory2.SIGNAGE__MISSING,
                ReportCategory2.SIGNAGE__BAD_CONDITION
            ]
        },
    ReportUserType.CYCLIST:
        {ReportCategory1.INFRASTRUCTURE: [
            ReportCategory2.NONE_CAT_2,
            ReportCategory2.BICYCLE_PATH_HOLE,
            ReportCategory2.BICYCLE_PATH_POOR_CONDITION,
            ReportCategory2.BICYCLE_PATH_VANISHED_PAINT,
            ReportCategory2.BICYCLE_PATH_UNCLEAR_SIGNAGE,
            ReportCategory2.BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED,
            ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION,
            ReportCategory2.SIGNAGE__MISSING,
            ReportCategory2.SIGNAGE__BAD_CONDITION
        ],
            ReportCategory1.INCIDENT: [
                ReportCategory2.NONE_CAT_2,
                ReportCategory2.BICYCLE_PATH_HOLE,
                ReportCategory2.BICYCLE_PATH_POOR_CONDITION,
                ReportCategory2.BICYCLE_PATH_VANISHED_PAINT,
                ReportCategory2.BICYCLE_PATH_UNCLEAR_SIGNAGE,
                ReportCategory2.BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED,
                ReportCategory2.NO_BICYCLE_PATH_DANGEROUS_SITUATION,
                ReportCategory2.SIGNAGE__MISSING,
                ReportCategory2.SIGNAGE__BAD_CONDITION
            ]
        }
}
