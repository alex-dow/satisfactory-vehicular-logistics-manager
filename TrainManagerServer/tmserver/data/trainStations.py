from typing import List, Optional
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

    inputs: List[TMPlatformItem]
    """List of inputs (items that trains unload to the platform)"""

    outputs: List[TMPlatformItem]
    """List of outputs (items that trains pick up from a platform) """



class TMTrainStation(BaseModel):

    station_name: str
    """Train station name"""

    platforms: List[TMPlatform]
    """Deserialized list of platforms"""



 