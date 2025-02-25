from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from typing import Dict, Any, AsyncGenerator
import asyncio
import json
from ..crew.workflow_crew import WorkflowCrew
from ..config.settings import settings

app = FastAPI(title="CrewAI Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active workflow executions
active_executions: Dict[str, Dict[str, Any]] = {}

async def workflow_progress_stream(workflow_id: str) -> AsyncGenerator[str, None]:
    """Stream workflow execution progress."""
    while workflow_id in active_executions:
        if active_executions[workflow_id].get("error"):
            yield json.dumps({
                "event": "error",
                "data": active_executions[workflow_id]["error"]
            })
            break
            
        yield json.dumps({
            "event": "progress",
            "data": {
                "status": active_executions[workflow_id]["status"],
                "current_phase": active_executions[workflow_id]["current_phase"],
                "progress": active_executions[workflow_id]["progress"],
                "message": active_executions[workflow_id]["message"]
            }
        })
        
        if active_executions[workflow_id]["status"] == "completed":
            yield json.dumps({
                "event": "complete",
                "data": active_executions[workflow_id]["result"]
            })
            break
            
        await asyncio.sleep(1)

async def execute_workflow_task(workflow_id: str, workflow_data: Dict[str, Any]):
    """Execute workflow in background and update progress."""
    try:
        crew = WorkflowCrew()
        
        # Register progress callback
        def update_progress(phase: str, progress: float, message: str):
            active_executions[workflow_id].update({
                "current_phase": phase,
                "progress": progress,
                "message": message
            })
        
        crew.register_progress_callback(update_progress)
        
        # Execute workflow
        result = await crew.execute_workflow(workflow_data)
        
        # Update final status
        active_executions[workflow_id].update({
            "status": "completed",
            "result": result
        })
        
    except Exception as e:
        active_executions[workflow_id].update({
            "status": "failed",
            "error": str(e)
        })
    finally:
        # Cleanup after delay to allow final status to be read
        await asyncio.sleep(5)
        if workflow_id in active_executions:
            del active_executions[workflow_id]

@app.post("/workflows/{workflow_id}/execute")
async def execute_workflow(
    workflow_id: str,
    workflow_data: Dict[str, Any],
    background_tasks: BackgroundTasks
):
    """Start workflow execution."""
    active_executions[workflow_id] = {
        "status": "running",
        "current_phase": "initializing",
        "progress": 0.0,
        "message": "Starting workflow execution"
    }
    
    background_tasks.add_task(
        execute_workflow_task,
        workflow_id,
        workflow_data
    )
    
    return {"workflow_id": workflow_id, "status": "accepted"}

@app.get("/workflows/{workflow_id}/status")
async def get_workflow_status(workflow_id: str):
    """Get SSE stream of workflow execution status."""
    if workflow_id not in active_executions:
        return {"status": "not_found"}
    
    return EventSourceResponse(
        workflow_progress_stream(workflow_id),
        media_type="text/event-stream"
    )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
