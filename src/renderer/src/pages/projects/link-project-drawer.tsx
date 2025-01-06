import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../components/ui/drawer'
import { Button } from '../../components/ui/button'
import XTerminal from '../../components/custom/terminal'

type Props = {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const LinkProjectDrawer: React.FC<Props> = ({ open, onOpenChange }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex justify-between items-start">
            <div className="">
              <DrawerTitle>Link To Remote</DrawerTitle>
              <br />
              <DrawerDescription>
                Link your remote github repository to your project, which will allow cadmium to
                analyze your code and provide suggestions for fixing errors.
              </DrawerDescription>
              <DrawerDescription>
                Steps 1: Run the command{' '}
                <code className="bg-accent text-primary px-2 underline italic">
                  git clone &apos;remote_url&apos;
                </code>
              </DrawerDescription>
              <DrawerDescription>
                Steps 2: Running above command will clone the default branch of your remote
                repository. If you want to change your working branch, run the command{' '}
                <code className="bg-accent text-primary px-2 underline italic">
                  git checkout &apos;branch_name&apos;
                </code>
              </DrawerDescription>
            </div>
            <DrawerClose>
              <Button variant="ghost">x</Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <div className="bg-black p-2 rounded-md">
            <XTerminal />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default LinkProjectDrawer
