import electronLogo from './assets/electron.svg'
import { ModeToggle } from './components/theme/toggle-theme'
import { Button } from './components/ui/button'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="">
      <img alt="logo" className="logo" src={electronLogo} />
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
      <Button variant={'destructive'}>Click meee</Button>
    </div>
  )
}

export default App
