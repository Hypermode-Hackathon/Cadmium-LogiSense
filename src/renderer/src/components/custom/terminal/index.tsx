import React, { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

type Props = {
  projectId: string | null
}

const XTerminal: React.FC<Props> = ({ projectId }) => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const commandBuffer = useRef<string>('') // Buffer to store the user's input

  useEffect(() => {
    const term = new Terminal({
      // cols: 80,
      // rows: 24,
      cursorBlink: true, // Makes the terminal cursor blink
      theme: {
        background: '#000000', // Background color
        foreground: 'gray', // Text color
        cursor: '#FFFFFF' // Cursor color
      }
    })
    const socket = new WebSocket('ws://localhost:6969/ws')
    socketRef.current = socket
    // Open the terminal in the referenced div
    term.open(terminalRef.current as HTMLDivElement)

    // Handle WebSocket events
    socket.onopen = () => {
      term.write('Connected to cadmium terminal.\r\nbash-$ ')
      console.log('WebSocket connection opened')
    }

    socket.onmessage = (event) => {
      // Write data received from the server to the terminal
      term.write(event.data)
    }

    socket.onerror = (error) => {
      term.write('\r\nError connecting to backend server.\r\n')
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      term.write('\r\nConnection closed by the server.\r\n')
      console.log('WebSocket connection closed')
    }

    // Listen for user input and handle commands on Enter key
    term.onData((input) => {
      if (input === '\r') {
        // User pressed Enter, send the command to the backend
        const command = commandBuffer.current.trim()
        if (command && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'command', command, projectId }))
          term.write(`\r\n`) // Move to the next line
        } else if (!command) {
          term.write('\r\n') // Just move to the next line for empty input
        }
        commandBuffer.current = '' // Clear the buffer after sending
      } else if (input === '\u007F') {
        // Handle backspace
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1)
          term.write('\b \b') // Move the cursor back, clear the character, move back again
        }
      } else {
        // Add input to the command buffer and display it on the terminal
        commandBuffer.current += input
        term.write(input)
      }
    })

    // Cleanup on unmount
    return () => {
      socket.close()
      term.dispose()
    }
  }, [])

  return <div ref={terminalRef} style={{ textAlign: 'left', width: '100%', height: '100%' }}></div>
}

export default XTerminal
