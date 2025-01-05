// import electronLogo from './assets/electron.svg'
import { ModeToggle } from './components/theme/toggle-theme'
import { Button } from './components/ui/button'

import React, { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

// Establish WebSocket connection
// Establish WebSocket connection

const XTerminal: React.FC = () => {
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
      // term.write('Connection established. Start typing commands...\r\n')
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
          socket.send(JSON.stringify({ type: 'command', command }))
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

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="">
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions bg-pink-500">
        <div className="action">
          <a
            href="https://electron-vite.org/"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 text-3xl font-bold underline"
          >
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <ModeToggle />
      <Button variant={'destructive'}>Click me</Button>
      <XTerminal />
      <Button variant={'destructive'}>Click me</Button>
    </div>
  )
}

export default App
