import React from 'react'
import { makeStyles } from '@mui/styles'
import { Button, Typography } from '@mui/material'
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

// const steps = [
//     'Setup a database',
//     'Select a table',
//     'Talk to the database'
// ];

const examples = [  
    'What were the top 5 most popular products last month?',
    'How many orders were placed in the last 30 days?',
    'What is the average order value?',
]


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: theme.spacing(10),
        // color: theme.palette.text.secondary,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            paddingTop: theme.spacing(5),
            paddingBottom: theme.spacing(10),
        }
    },
    // steps: {
    //     padding: theme.spacing(5),
    //     [theme.breakpoints.down('sm')]: {
    //         padding: theme.spacing(2),
    //         paddingTop: theme.spacing(5),
    //         paddingBottom: theme.spacing(3),
    //     }

    // },
    examples: {
        padding: theme.spacing(5),
        
    },
    box: {
        width: "100%",
    },
    exampleText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: theme.palette.text.secondary,
        padding: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            gap: '0.5rem',
        }
    },
    query: {

    }
}))

const Splash = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography variant="body2" align="center">
                Welcome to the
            </Typography>
            <Typography variant="body1" align="center">
                Analytics GPT Dashboard
            </Typography>

            {/* <div className={classes.steps}>
                <Box className={classes.box}>
                    <Stepper alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            color: 'var(--color-text-secondary)',
                                        },
                                    }}
                                >{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </div> */}

            <div className={classes.examples}>
                <Typography variant="body2" align="center"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <WbSunnyIcon fontSize="medium" />
                    Examples
                </Typography>

                <div
                    className={classes.exampleText}
                >

                {examples.map((example, index) => (
                    <Typography variant='body2' key={index} className={classes.query} >
                        {example}
                    </Typography>
                ))}
                </div>


            </div>
        </div>
    )
}



export default Splash
