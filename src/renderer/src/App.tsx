import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { addMessageListener, disconnectWebSocket, removeMessageListener } from './socket/socket'
import { LogTableEntry } from './types/type'
import { useLogStore } from './stores/useLogStore'
import { router } from './routes'

function App(): JSX.Element {
  // ! TEST CONNECTION TO MAIN PROCESS
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const { appendTableDataToTop, setLogDataToStream } = useLogStore()
  /*
	WebSocket message handling for new logs

	This logic is part of the Log Analysis page under the Explorer tab.
	The WebSocket connection and its message handling must be initialized at the root level of the app (in App.tsx).
	This ensures the WebSocket listener is active as soon as the app starts, regardless of whether the Log Analysis -> Explorer tab has been rendered.

	If the WebSocket logic were placed in log-analysis.tsx, it would only listen for messages when the Log Analysis page is rendered,
	which is not desirable for real-time log updates.

	By placing the WebSocket handling here, the app can start listening for WebSocket messages immediately after initialization.
	*/
  useEffect(() => {
    // Define a listener to handle chunks
    const handleChunk = (chunk: any) => {
      if (chunk.action === 'new_log') {
        const logTableData: LogTableEntry = {
          id: chunk.data.log_id,
          applicationId: chunk.data.application_id,
          organizationId: chunk.data.raw_log.organization_id.$oid,
          error: chunk.data.raw_log.error,
          url: chunk.data.raw_log.url,
          method: chunk.data.raw_log.method,
          createdAt: chunk.data.raw_log.created_at,
          updatedAt: chunk.data.raw_log.updated_at,
          ragInference: {
            rag_response: {
              formatted_rag_response: [],
              rag_response: {
                application_id: '',
                created_at: '',
                processed_at: '',
                query: '',
                rag_response: ''
              },
              application_id: '',
              created_at: '',
              query: ''
            }
          },
          traceback: chunk.data.raw_log.traceback,
          isStreaming: true
        }
        appendTableDataToTop([logTableData])
        // Show notification in Electron
        if (window.electronAPI) {
          window.electronAPI.sendMessage('toMain', {
            message: `New log received: ${chunk.data.raw_log.error}`
          })
        }
      } else if (chunk.action === 'stream_log_response') {
        setLogDataToStream({
          isStreaming: true,
          application_id: chunk.data.application_id,
          chunk: chunk.data.chunk,
          log_id: chunk.data.log_id
        })
      } else if (chunk.action === 'stream_complete') {
        // const log_id = chunk.data.log_id;
        // setLogStreamingComplete(log_id);
        setLogDataToStream({
          isStreaming: false,
          application_id: chunk.data.application_id,
          chunk: chunk.data.chunk,
          log_id: chunk.data.log_id
        })
      } else {
        console.log('Received message from WebSocket:', chunk)
      }
      // setStreamedMessage((prev) => prev + chunk); // Append each chunk to the current message
    }

    // Add the listener
    addMessageListener(handleChunk)

    // Cleanup on component unmount
    return () => {
      removeMessageListener(handleChunk)
      disconnectWebSocket()
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
