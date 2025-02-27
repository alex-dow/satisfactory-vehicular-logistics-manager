from fastapi import APIRouter

from pydantic import BaseModel, Field

router = APIRouter()
"""
@router.get("/projects/{project_id}/train-stations")
def api_get_train_stations(
    project_id: Annotated[int, Path(title="Project ID")],
    user: Annotated[TMUser, Depends(get_oauth2_user)]
):
    return get_train_stations(project_id=project_id, owner=user)

class CreateTrainStationRequest(BaseModel):
    station_name: str = Field(min_length=4)
    platforms: int = Field(ge=0)

@router.post("/projects/{project_id}/train-stations")
def create_trainstation(
    req: CreateTrainStationRequest,
    project_id: Annotated[int, Path(title="Project ID")],
    user: Annotated[TMUser, Depends(get_oauth2_user)]
):
    return create_train_station(req.station_name, req.platforms, project_id, user)

@router.put("/projects/{projectId}/train-stations/{stationId}")
def api_update_train_station(
    req: TMTrainStation,
    station_id: Annotated[int, Path(title="Station ID")],
    project_id: Annotated[int, Path(title="Project ID")],
    user: Annotated[TMUser, Depends(get_oauth2_user)]
):
    orig_trainstation = get_train_station(station_id)
    if orig_trainstation.owned_by != user.id:
        raise InvalidTrainStationError("Station %i is not owned by %s" % (station_id, user.username))

    if orig_trainstation.project_id != project_id:
        raise InvalidTrainStationError("Station %i is not in the project %i" % (station_id, project_id))


    if req.owned_by != user.id:
        raise InvalidTrainStationError("Changing ownership of train stations is not supported at this time.")

    if req.project_id != orig_trainstation.project_id:
        raise InvalidTrainStationError("Moving a train station to a different project is not supported at this time.")

    return update_train_station(req)


@router.delete("/projects/{project_id}/train-stations/{station_id}")
def api_delete_train_station(
    station_id: Annotated[int, Path(title="Station ID")],
    project_id: Annotated[int, Path(title="Project ID")],
    user: Annotated[TMUser, Depends(get_oauth2_user)]
):
    orig_trainstation = get_train_station(station_id)
    if orig_trainstation.owned_by != user.id:
        raise InvalidTrainStationError("Station %i is not owned by %s" % (station_id, user.username))

    if orig_trainstation.project_id != project_id:
        raise InvalidTrainStationError("Station %i is not in project %i" % (station_id, project_id))


    delete_train_station(station_id)
"""