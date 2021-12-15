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


# ----------------------------------------------------------------------------------------------------------------------
# REPORTS
class ReportUserType(ModelEnum):
    PEDESTRIAN = 0
    CYCLIST = 1


class ReportCategory1(ModelEnum):
    INFRASTRUCTURE = 0
    INCIDENT = 1


class ReportCategory2(ModelEnum):
    # subset items of the items of cat 1.

    BICYCLE_PATH_HOLE = 0
    BICYCLE_PATH_POOR_CONDITION = 1
    BICYCLE_PATH_VANISHED_PAINT = 2
    BICYCLE_PATH_UNCLEAR_SIGNAGE = 3
    BICYCLE_PATH_BORDER_NEED_TO_BE_LOWERED = 4

    NO_BICYCLE_PATH_DANGEROUS_SITUATION = 5

    SIGNAGE__MISSING = 6
    SIGNAGE__BAD_CONDITION = 7
