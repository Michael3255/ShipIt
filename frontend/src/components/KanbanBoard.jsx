import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import PageContainer from './PageContainer'
import { Typography, Box, Chip, Container } from '@mui/material'

//Mock Data: Tasks
const MOCK_TASKS=[{id:1,title:"Organize closet",description:"Complete research report",status:"Done",objective:"Expand market reach",assignee:"clafoy0", objective_id: 2},
{id:2,title:"Schedule dentist appointment",description:"Collaborate with team members",status:"Done",objective:"Enhance brand awareness",assignee:"shartridge1", objective_id: 2},
{id:3,title:"Start new book",description:"Update project status",status:"To Do",objective:"Optimize supply chain efficiency",assignee:"hhrihorovich2", objective_id: 2},
{id:4,title:"Start new book",description:"Complete research report",status:"To Do",objective:"Increase sales by 10%",assignee:"rmadders3", objective_id: 1},
{id:5,title:"Go for a run",description:"Conduct market analysis",status:"In Progress",objective:"Increase social media presence",assignee:"asolley4", objective_id: 1}]

//Render 3 Columns
const COLUMNS = [ 
    {
        id: 'To Do', label: 'To Do'
    },
    {
        id: 'In Progress', label: 'In Progress'
    },
    {
        id: 'Done', label: 'Done'
    },
]

export const KanbanBoard = () => {
    
    const { projectId } = useParams()
    const [searchParams] = useSearchParams()
    const objectiveFilter = searchParams.get('objective')

    //Use State
    const [tasks] = useState(MOCK_TASKS)

    const displayTasks = objectiveFilter ? tasks.filter((task) => task.objective_id === Number(objectiveFilter)) : tasks

    // Group by Tasks
    const STATUS = Object.groupBy(displayTasks, ({ status }) => status)
    
    

    return (
        
        <PageContainer>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h5">
                {projectId.title ? `${projectId.title} Kanban Board` : 'Kanban Board'}</Typography>
            </Box>
            <Container sx={{ display: 'flex', flexDirection: 'row',  gap: 2, overflowX: 'auto', bgcolor: 'white', borderRadius: 2}}>
          
            {COLUMNS.map((column) => (
                <Box key={column.id} sx={{ display: 'flex', flexDirection: 'column', width: 200, minWidth: 280, flexShrink: 0, borderRadius: 2, p: 2, gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', borderRadius: 2, p: 2, gap: 2}}>
                        <Typography>{column.label}</Typography>
                        <Chip label={STATUS[column.id]?.length ?? 0} /> 
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                       {(STATUS[column.id] ?? []).map((task) => (
                        <Typography key={task.id}>{task.title}</Typography>
                       ))}
                    </Box>
                </Box>
              ))} 
            </Container>
        </PageContainer>
        //board wrapper - flex row
        //map over Columns
        )
}


