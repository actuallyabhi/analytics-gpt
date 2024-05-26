import React, { useEffect } from 'react'
import InputBox from './InputBox/InputBox';
import Conversation from './Conversation/Conversation';
import { Post } from '../../common/common';
import { getLocal } from '../../common/localStorageAccess';
import { showToast } from '../../common/Alert';

const Dashboard = () => {
	const [query, setQuery] = React.useState(null)
    const [output, setOutput] = React.useState(null)
	const [isError, setIsError] = React.useState(false)
	const [queryId, setQueryId] = React.useState(0)
	const [errorText, setErrorText] = React.useState("")
	const [showSplash, setShowSplash] = React.useState(true)
	const [isFetching, setIsFetching] = React.useState(false)
	const [loading, setLoading] = React.useState(false);

	useEffect(() => {
			(async () => {
				if (query ) {
				try {
					setShowSplash(false)
					setLoading(true)
					setIsError(false)
					setTimeout(() => setIsFetching(true), 300)
					let formData = new FormData()
					formData.append("db_id", getLocal("database_id"))
					formData.append("table", getLocal("selected_tables"))
					formData.append("prompt", query)
					let res = await Post(1, "execute", formData)
					if (res.status === 200) {
						setQueryId(res?.data?.query_id)
						setOutput(res?.data?.response)
					}
				} catch (error) {
					setErrorText(error?.response?.data)
					setIsError(true)
					
				} finally {
					setLoading(false)
					setIsFetching(false)
					
				}
			}
			})()
	}, [query])

	return (
		<>
			<Conversation 
				query={query}
				output={output}
				queryId={queryId}
				isFetching={isFetching}
				isError={isError}
				showSplash={showSplash}
				errorText={errorText}
			/>
			<InputBox 
				setQuery={setQuery}
				loading={loading}
				isFetching={isFetching}
				setLoading={setLoading}
				setOutput={setOutput}
			/>
		</>
	)
}

export default Dashboard;