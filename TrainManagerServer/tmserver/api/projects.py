from typing import Annotated

from fastapi import APIRouter, Path
from fastapi.params import Depends
from pydantic import BaseModel, Field

from tmserver.data.projects import TMProject, get_projects, create_project, get_project, delete_project, save_project
from tmserver.data.users import TMUser
from tmserver.exc import InvalidProjectError
from tmserver.security.tokens import get_current_user

router = APIRouter()

@router.get("/projects")
def api_get_projects(user: Annotated[TMUser, Depends(get_current_user)]):
    return get_projects(user)

class CreateProjectRequest(BaseModel):
    projectName: str = Field(min_length=4)

@router.post("/projects")
def api_create_project(req: CreateProjectRequest, user: Annotated[TMUser, Depends(get_current_user)]):
    project = create_project(project_name=req.projectName, owner_id=user.id)
    return project

@router.get("/projects/{project_id}")
def api_get_project(project_id: int, user: Annotated[TMUser, Depends(get_current_user)]):
    project = get_project(project_id)
    if project.owner_id != user.id:
        raise InvalidProjectError("Project id %i does not belong to user %s" % (project_id, user.username))
    return project
    

@router.put("/projects/{project_id}")
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


@router.delete("/projects/{project_id}")
def api_delete_project(project_id: int, user: Annotated[TMUser, Depends(get_current_user)]):
    project = get_project(project_id)
    if project.owner_id != user.id:
        raise InvalidProjectError("Project id %i does not belong to user %s" % (project_id, user.username))

    delete_project(project_id)

