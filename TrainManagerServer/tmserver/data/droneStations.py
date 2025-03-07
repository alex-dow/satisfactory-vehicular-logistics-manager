from typing import List
from pydantic import BaseModel

from tmserver.data.trainStations import TMPlatformItem


class TMDroneStation(BaseModel):

    station_name: str
    """Truck station name"""

    inputs: List[TMPlatformItem]
    outputs: List[TMPlatformItem]
