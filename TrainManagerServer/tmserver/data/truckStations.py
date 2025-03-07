from typing import List
from pydantic import BaseModel

from tmserver.data.trainStations import TMPlatformItem


class TMTruckStation(BaseModel):

    station_name: str
    """Train station name"""

    inputs: List[TMPlatformItem]
    outputs: List[TMPlatformItem]
