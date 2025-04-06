from typing import List, Optional, Literal
from pydantic import BaseModel




class TMPlatformItem(BaseModel):
    """
    Class that represents an item transferring in or out of a platform
    """

    item_id: str
    """ Item ID """

    rate: float
    """Rate of input or output in items per minute"""



class TMPlatform(BaseModel):
    """Class that represents a platform of a station"""

    mode: Literal['load', 'unload']
    """ Denotes whether the platform is loading or unloading trains."""

    items: List[TMPlatformItem]
    """ List of items that are loaded or unloaded by this platform """



class TMTrainStation(BaseModel):

    station_name: str
    """Train station name"""

    platforms: List[TMPlatform]
    """Deserialized list of platforms"""


class TMRailcar(BaseModel):
    items: List[TMPlatformItem]

class TMTrainConsist(BaseModel):
    consist_name: str
    railcars: List[TMRailcar]






 