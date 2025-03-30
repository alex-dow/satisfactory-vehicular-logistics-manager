from typing import List, Optional
from pydantic import BaseModel
from pydantic.json import pydantic_encoder
from sqlmodel import Field, SQLModel, select
import json

from tmserver.data.droneStations import TMDroneStation
from tmserver.data.trainStations import TMTrainStation
from tmserver.data.truckStations import TMTruckStation
from tmserver.data.users import TMUser
from tmserver.db.conn import engine, Session
from tmserver.exc import InvalidProjectError


class TMProject(BaseModel):
    id: int | None = None
    owner_id: int | None = None
    project_name: str
    train_stations: List[TMTrainStation]
    truck_stations: List[TMTruckStation]
    drone_stations: List[TMDroneStation]

class ProjectEntry(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int
    project_name: str
    train_stations: str
    truck_stations: str
    drone_stations: str

    def toProject(self) -> TMProject:
        train_stations = []
        truck_stations = []
        drone_stations = []
        
        if self.train_stations != None:
            res_train_stations = json.loads(self.train_stations)

            if (type(res_train_stations) is not list):
                raise RuntimeError("Project #%i has invalid train stations" % id)
            
            train_stations = [TMTrainStation(**train_station) for train_station in res_train_stations]

        if self.truck_stations != None:
            res_truck_stations = json.loads(self.truck_stations)

            if (type(res_truck_stations) is not list):
                raise RuntimeError("Project #%i has invalid truck stations" % id)
            
            truck_stations = [TMTruckStation(**truck_station) for truck_station in res_truck_stations]

        if self.drone_stations != None:
            res_drone_stations = json.loads(self.drone_stations)

            if (type(res_drone_stations) is not list):
                raise RuntimeError("Project #%i has invalid drone stations" % id)
            
            drone_stations = [TMDroneStation(**drone_station) for drone_station in res_drone_stations]

        project = TMProject(id=self.id, project_name=self.project_name, drone_stations=drone_stations, truck_stations=truck_stations, train_stations=train_stations, owner_id=self.owner_id)
        return project
        




class TMPartialProject(BaseModel):
    id: int
    project_name: str





def get_project(project_id: int) -> TMProject:
    with Session() as session:
        stmt = select(ProjectEntry).where(ProjectEntry.id == project_id)
        res = session.execute(stmt).first()

        if res != None:
            return res.tuple()[0].toProject()

           
    raise RuntimeError("Project id %i not found" % project_id)


def save_project(project: TMProject) -> TMProject:
    with Session() as session:
        train_station_json = json.dumps(project.train_stations, default=pydantic_encoder)
        truck_station_json = json.dumps(project.truck_stations, default=pydantic_encoder)
        drone_station_json = json.dumps(project.drone_stations, default=pydantic_encoder)
        
        if project.id:
            entry = session.get(ProjectEntry, project.id)
            if entry == None:
                raise InvalidProjectError("Project #%i does not exist", project.id)
        else:
            entry = ProjectEntry(
                owner_id=project.owner_id, # type: ignore
                project_name=project.project_name,
                drone_stations=drone_station_json,
                train_stations=train_station_json,
                truck_stations=truck_station_json
            )

        session.add(entry)
        session.commit()
        session.refresh(entry)

        return get_project(entry.id) # type: ignore



def create_project(project: TMProject, owner_id: int) -> TMProject:

    newProject: TMProject = TMProject(
        id=None,
        owner_id=owner_id,
        project_name=project.project_name,
        drone_stations=project.drone_stations,
        truck_stations=project.truck_stations,
        train_stations=project.train_stations
    )

    return save_project(newProject)


def delete_project(project_id: int):
    with Session() as session:
        project = session.get(ProjectEntry, project_id)
        if (project != None):
            session.delete(project)
            session.commit()
        else:
            raise RuntimeError("Project id %i does not exist" % project_id)


def get_projects(owner: TMUser | None = None, owner_id: int | None = None) -> List[TMProject]:
    stmt = select(ProjectEntry)
    if owner is not None:
        stmt = stmt.where(ProjectEntry.owner_id == owner.id)
    elif owner_id is not None:
        stmt = stmt.where(ProjectEntry.owner_id == owner_id)

    with Session() as session:

        results = session.execute(stmt).fetchall()


        return [row.tuple()[0].toProject() for row in results]
        



