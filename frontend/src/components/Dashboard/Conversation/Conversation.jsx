import React, { useRef, useState, useEffect } from 'react'
import DataBox from './DataBox/DataBox'
import { makeStyles } from '@mui/styles'
import Splash from './Splash/Splash';

const useStyles = makeStyles({
    banner: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
    }
})

const Conversation = ({
    query,
    output,
    isFetching,
    queryId,
    isError,
    errorText,
    showSplash
}) => {
    const classes = useStyles()
    const  waitingMessages = [
        "Fetching data... Just a moment!",
        "Loading information from the database...",
        "Hold on tight while we retrieve the data!",
        "Patience, we're gathering the data for you!",
        "Database connection established. Fetching data...",
        "Processing your request. Sit tight!",
        "Waiting for the database to respond...",
        "Data retrieval in progress. Thank you for your patience!",
        "Counting records... Almost there!",
        "Connecting to the database. Please wait...",
        "Data loading... Enjoy a brief moment of zen!",
        "Fetching results... It'll be worth the wait!",
        "Database magic in progress... Sit back and relax!",
        "Data crunching in action. Hang on!",
        "Fetching the latest updates... Just a few more seconds!",
        "Please wait while we fetch the data you requested...",
        "Querying the database... Fingers crossed for a quick response!",
        "Data on its way! Meanwhile, take a deep breath..."
    ]
    const [message, setMessage] = useState(waitingMessages[
        Math.floor(Math.random() * waitingMessages.length)
    ]);

    useEffect(() => {
      if (isFetching) {
        const interval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * waitingMessages.length);
          setMessage(waitingMessages[randomIndex]);
        }, 3000);  
        return () => {
          clearInterval(interval);
        };
      }
    }, [isFetching]);

    return (
        <div>
            {showSplash && <Splash />}
            
            {query &&  <DataBox
                            data={query}
                            sender={1}
                        />
            }
            {output && <DataBox
                            data={output}
                            sender={2}
                            queryId={queryId}
                            output={true}
                        />
            }
            {isFetching ? <DataBox
                            data={message ?? 
                                "Fetching data... Just a moment!"
                            }
                            loader={true}
                            sender={2}
                            noFeedback
                        /> : null
            }
            {isError ? <DataBox
                            data={errorText ??
                                "Oops! Something went wrong. Please try again."
                            }
                            error={true}
                            errorText={errorText}
                            sender={2}
                            noFeedback
                        /> : null
            }
        </div>
    )
}

export default Conversation