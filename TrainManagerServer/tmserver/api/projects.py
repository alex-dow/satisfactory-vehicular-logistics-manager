from typing import Annotated, List

from fastapi import APIRouter, Path
from fastapi.params import Depends
from pydantic import BaseModel, Field

from tmserver.data.droneStations import TMDroneStation
from tmserver.data.projects import TMProject, get_projects, create_project, get_project, delete_project, save_project
from tmserver.data.trainStations import TMTrainStation
from tmserver.data.truckStations import TMTruckStation
from tmserver.data.users import TMUser
from tmserver.exc import InvalidProjectError
from tmserver.security.tokens import get_current_user

router = APIRouter()

@router.get("/api/projects")
def api_get_projects(user: Annotated[TMUser, Depends(get_current_user)]):
    return get_projects(user)

class CreateProjectRequest(BaseModel):
    project_name: str
    train_stations: List[TMTrainStation]
    truck_stations: List[TMTruckStation]
    drone_stations: List[TMDroneStation]

@router.post("/api/projects")
def api_create_project(project: TMProject, user: Annotated[TMUser, Depends(get_current_user)]):
    if user.id == None:
        raise InvalidProjectError("There is no user id to assign ownership to the project?")
    
    project = create_project(project=project, owner_id=user.id)
    return project

@router.get("/api/projects/{project_id}")
def api_get_project(project_id: int, user: Annotated[TMUser, Depends(get_current_user)]):
    project = get_project(project_id)
    if project.owner_id != user.id:
        raise InvalidProjectError("Project id %i does not belong to user %s" % (project_id, user.username))
    return project
    

@router.put("/api/projects/{project_id}")
def api_save_project(project: TMProject, 
                     project_id: Annotated[int, Path(title="Project ID")],
                     user: Annotated[TMUser, Depends(get_current_user)]):
    if project.id != project_id:
        raise InvalidProjectError("Project id %i does not match project being saved" % (project_id))
    origProject = get_project(project_id)
    if origProject.owner_id != user.id:
        raise InvalidProjectError("Project id %i does not belong to user %s" % (project_id, user.username))

    newProject = save_project(project)
    return newProject


@router.delete("/api/projects/{project_id}")
def api_delete_project(project_id: int, user: Annotated[TMUser, Depends(get_current_user)]):
    project = get_project(project_id)
    if project.owner_id != user.id:
        raise InvalidProjectError("Project id %i does not belong to user %s" % (project_id, user.username))

    delete_project(project_id)

