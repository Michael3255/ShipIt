import React, { useState } from 'react'

import PageContainer from './PageContainer'
import { Typography, Box, Chip, Container } from '@mui/material'

//Mock Data: Tasks
const MOCK_TASKS=[{id:1,title:"Organize closet",description:"Complete research report",status:"DONE",objective:"Expand market reach",assignee:"clafoy0"},
{id:2,title:"Schedule dentist appointment",description:"Collaborate with team members",status:"DONE",objective:"Enhance brand awareness",assignee:"shartridge1"},
{id:3,title:"Start new book",description:"Update project status",status:"TODO",objective:"Optimize supply chain efficiency",assignee:"hhrihorovich2"},
{id:4,title:"Start new book",description:"Complete research report",status:"TODO",objective:"Increase sales by 10%",assignee:"rmadders3"},
{id:5,title:"Go for a run",description:"Conduct market analysis",status:"IN_PROGRESS",objective:"Increase social media presence",assignee:"asolley4"}]

//Render 3 Columns
const COLUMNS = [ 
    {
        id: 'TODO', label: 'To Do'
    },
    {
        id: 'IN_PROGRESS', label: 'In Progress'
    },
    {
        id: 'DONE', label: 'Done'
    },
]

export const KanbanBoard = ({ project }) => {
    
    //Use State
    const [tasks] = useState(MOCK_TASKS)

    // Group by Tasks
    const STATUS = Object.groupBy(tasks, ({ status }) => status)
    
    return (
        
        <PageContainer>
             <Box sx={{ width: '100%' }}><Typography variant="h5">
  {project?.title ? `${project.title} Kanban Board` : 'Kanban Board'}
</Typography></Box> 
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


