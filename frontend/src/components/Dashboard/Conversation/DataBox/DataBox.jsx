import { Button, Container, IconButton, Snackbar, Typography } from '@mui/material'
import cx from 'classnames'
import { makeStyles } from '@mui/styles'
import React from 'react'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import MuiDialog from '../../../../common/MuiDialog';
import ReportIcon from '@mui/icons-material/Report';
import { getLocal } from '../../../../common/localStorageAccess'
import { Post } from '../../../../common/common';
import { showToast } from '../../../../common/Alert';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        fontWeight: "400",
        padding: " 2rem 1rem",
        [theme.breakpoints.up("md")]: {
            fontSize: "1.15rem",
        },
        [theme.breakpoints.down("md")]: {
            fontSize: "1rem",
            padding: " 1.5rem 1rem",
        }
    },
    user: {
        background: "#f7f7f8",
        color: "var(--color5)",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
    },
    be: {
        color: "var(--color6)",
    },
    attrArea: {
        display: "flex",
        gap: "1rem",
        justifyContent: "flex-end",
        paddingTop: "1rem",
    },
    textBox: {
        width: "100%",
        resize: "none",
        border: "none",
        margin: "8px 0px",
        borderRadius: "4px",
        outline: "1px solid var(--color1)",
        padding: "1rem",
        boxSizing: "border-box",
        fontSize: "1rem",
        height: "180px",
        [theme.breakpoints.down("md")]: {
            height: "136px",
        },

    },
    loader: {
        animation: "$fadeIn 1.5s linear infinite",
    },
    "@keyframes fadeIn": {
        "0%": {
            opacity: 0.4,
        },
        "50%": {
            opacity: 1,
        },
        "100%": {
            opacity: 0.4,
        }
    }

}))

const DataBox = ({
    data,
    sender,
    output,
    queryId,
    loader = false,
    noFeedback,
    error = false,
    errorText,

}) => {
    const classes = useStyles();
    const [feedback, setFeedback] = React.useState(0);
    const [feedbackText, setFeedbackText] = React.useState("")
    const [open, setOpen] = React.useState(false);

    const handleFeedback = async (type) => {
        setFeedback(type);
        setOpen(true);
        let newForm = new FormData()
        newForm.append("db_id", getLocal("database_id"))
        newForm.append("response", type)
        newForm.append("query_id", queryId)
        let res = await Post(1, "feedback", newForm)
        if (res.status === 200) {
            showToast("success", res.data, "feedback")
        }
    }

    const handleDescriptiveFeedback = async () => {
        console.log(feedbackText)
        if (feedbackText.length === 0) {
            showToast("info", "Please enter some text.", "descriptive_feedback")
            return
        }
        let newForm = new FormData()
        newForm.append("query_id", queryId)
        newForm.append("prompt", feedbackText)
        let res = await Post(1, 'descriptive_feedback', newForm)
        if (res.status === 200) {
            showToast("success", res.data)
            setFeedbackText("")
            setOpen(false)
            return
        }
        showToast("error", "Something went wrong.", "descriptive_feedback")
    }

    return (
        <>
            <div
                className={cx(classes.container, {
                    [classes.user]: sender === 1,
                    [classes.be]: sender === 2,
                })}

            >
                <Container
                    maxWidth="md"
                    className={cx({
                        [classes.loader]: loader,
                    })}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        color: error ? "var(--color4)" : output ? "var(--color5)" : "",
                        opacity: error ? 0.8 : output ? 0.9 : ""

                    }}
                >
                    {/* <Typography
                    component="p"
                    variant="body1"
                    > */}

                    {data}
                    {/* </Typography> */}

                    {sender === 2 && !noFeedback && (
                        <div
                            classname={classes.attrArea}
                        >
                            <IconButton
                                onClick={() => handleFeedback(1)}
                                active={feedback === 1}
                            >
                                {feedback === 1 ? <ThumbUpIcon fontSize='small' color="primary" />
                                    : <ThumbUpAltOutlinedIcon fontSize='small' />}
                            </IconButton>
                            <IconButton
                                onClick={() => handleFeedback(-1)}
                            >
                                {feedback === -1 ? <ThumbDownIcon fontSize='small' color="primary" />
                                    : <ThumbDownAltOutlinedIcon fontSize='small' />}
                            </IconButton>
                        </div>
                    )
                    }
                    {sender === 2 && error && (
                        <div
                            classname={classes.attrArea}
                        >
                            <Button

                                onClick={() => {
                                    setOpen(true);
                                    setFeedback(-1);
                                    setFeedbackText(errorText)
                                }}
                                startIcon={<ReportIcon />}
                            >
                                Report

                            </Button>
                        </div>

                    )}
                </Container>


                <MuiDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Feedback"
                    onSubmit={() => handleDescriptiveFeedback()}
                >
                    <textarea className={classes.textBox}
                        placeholder="Write yout thoughts about the response."
                        onChange={(e) => setFeedbackText(e.target.value)}
                    ></textarea>
                </MuiDialog>
            </div>
        </>
    )
}

export default DataBox
