from typing import List, Optional
from pydantic import BaseModel
from pydantic.json import pydantic_encoder
from sqlmodel import Field, SQLModel, Session, select
import json

from tmserver.data.trainStations import TMTrainStation
from tmserver.data.users import TMUser
from tmserver.db.conn import engine
from tmserver.exc import InvalidProjectError


class ProjectEntry(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int
    project_name: str
    train_stations: str


class TMProject(BaseModel):
    id: int | None = None
    owner_id: int
    project_name: str
    train_stations: List[TMTrainStation]


class TMPartialProject(BaseModel):
    id: int
    project_name: str


def get_project(project_id: int) -> TMProject:
    with Session(engine) as session:
        stmt = select(ProjectEntry).where(ProjectEntry.id == project_id)
        res = session.exec(stmt).first()

        if res != None:

            train_stations = []
            
            if res.train_stations != None:
                res_train_stations = json.loads(res.train_stations)
                print("RAW TRAIN STATION LIST?")
                print(res_train_stations)

                if (type(res_train_stations) is not list):
                    raise RuntimeError("Project #%i has invalid train stations" % project_id)
                
                train_stations = [TMTrainStation(**train_station) for train_station in res_train_stations]

            project = TMProject(id=res.id, project_name=res.project_name, train_stations=train_stations, owner_id=res.owner_id)
            return project
    raise RuntimeError("Project id %i not found" % project_id)


def save_project(project: TMProject) -> TMProject:
    with Session(engine) as session:
        train_station_json = json.dumps(project.train_stations, default=pydantic_encoder)
        
        entry = session.get(ProjectEntry, project.id)
        if entry == None:
            raise InvalidProjectError("Project #%i does not exist", project.id)
        
        entry.project_name = project.project_name
        entry.train_stations = train_station_json

        
        session.add(entry)
        session.commit()
        session.refresh(entry)

        return get_project(project.id) # type: ignore



def create_project(project_name: str, owner_id: int) -> TMProject:

    with Session(engine) as session:

        project_entry = ProjectEntry(
            owner_id=owner_id,
            project_name=project_name,
            train_stations='[]'
        )

        session.add(project_entry)
        session.commit()
        session.refresh(project_entry)

        return get_project(project_entry.id) # type: ignore


def delete_project(project_id: int):
    with Session(engine) as session:
        project = session.get(ProjectEntry, project_id)
        if (project != None):
            session.delete(project)
            session.commit()
        else:
            raise RuntimeError("Project id %i does not exist" % project_id)


def get_projects(owner: TMUser | None = None, owner_id: int | None = None) -> List[TMPartialProject]:
    stmt = select(ProjectEntry.id, ProjectEntry.project_name)
    if owner is not None:
        stmt.where(ProjectEntry.owner_id == owner.id)
    elif owner_id is not None:
        stmt.where(ProjectEntry.owner_id == owner_id)

    with engine.connect() as conn:
        return [TMPartialProject(id=row.id, project_name=row.project_name) for row in conn.execute(stmt)]



