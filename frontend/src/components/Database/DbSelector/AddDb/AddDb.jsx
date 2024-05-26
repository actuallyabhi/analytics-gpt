import React, { useState } from 'react'
import { TextField, Button, Container, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getLocal } from '../../../../common/localStorageAccess'
import { Post } from '../../../../common/common'
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    container: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: "36px",
        gap: "40px",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
}))



const AddDb = () => {
    const classes = useStyles()
    const history = useHistory()
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [name, setName] = useState("");
    const [host, setHost] = useState("");
    const [port, setPort] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleAddDb = async (e) => {
        e.preventDefault();
        if (getLocal("user_id") == null && getLocal("access_token") == null) {
            history.push("/login");
            return;
        }
        // if (name.length === 0 || host.length === 0 || port.length === 0 || username.length === 0 || password.length === 0) {
        //     setIsError(true);
        //     return;
        // }
        switch (true) {
            case name.length === 0: 
                setIsError(true)
                setErrorText("Database name cannot be empty")
                return;
            
            case host.length === 0:
                setIsError(true)
                setErrorText("Host cannot be empty")
                return;

            case /^\d+$/.test(port) === false:
                setIsError(true)
                setErrorText(port.length === 0 ? "Port cannot be empty" : "Port must be a number")
                return;


            case username.length === 0:
                setIsError(true)
                setErrorText("Username cannot be empty")
                return;

            case password.length === 0:
                setIsError(true)
                setErrorText("Password cannot be empty")
                return;

        }
        setIsError(false);
        const formData = new FormData()
        formData.append("database", name)
        formData.append("host", host)
        formData.append("port", port)
        formData.append("user", username)
        formData.append("password", password)
        formData.append("user_id", getLocal("user_id"))

        try {
            let res = await Post(1, "databases", formData);
            if (res.status === 200) {
                history.push("/database");
                return;
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                setIsError(true);
                setErrorText(error?.response?.data);
                return;
            }
            setErrorText("Something went wrong");
        }

    }

    return (
        <div className={classes.container}>
            <Typography
                variant="h2"
                style={{
                    textAlign: "center",
                    marginTop: "16px"
                }}
            >
                Add Database
            </Typography>
            <Container component="main" maxWidth="xs">
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Database Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value.trim());
                            setIsError(false);
                        }}
                        error={isError && name.length === 0}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="host"
                        label="Host"
                        name="host"
                        autoComplete="host"
                        value={host}
                        onChange={(e) => {
                            setHost(e.target.value.trim());
                            setIsError(false);
                        }}
                        error={isError && host.length === 0}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="port"
                        label="Port"
                        name="port"
                        autoComplete="port"
                        value={port}
                        onChange={(e) => {
                            setPort(e.target.value.trim());
                            setIsError(false);
                        }}
                        error={isError && port.length === 0}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value.trim());
                            setIsError(false);
                        }}
                        error={isError && username.length === 0}
                    />


                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value.trim());
                            setIsError(false);
                        }}
                        error={isError}
                    />

                    <Grid item xs={12} sx={{
                        marginTop: "6px",
                    }}>
							{isError && (
								<Typography
									variant="body1"
									color="error"
								>

									{errorText}
								</Typography>
							)}
					</Grid>

                    <Button
                        onClick={handleAddDb}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        // className={classes.submit}
                        style={{
                            margin: "20px 0px",
                        }}
                    >
                        Add Database
                    </Button>

                </form>

            </Container>
        </div>
    )
}

export default AddDb