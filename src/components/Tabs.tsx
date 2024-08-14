import {Tabs, TabList, Tab, TabPanel} from 'react-aria-components';
import { Modal, Dialog, ProgressBar, Button, Checkbox, CheckboxGroup, Text, Label } from 'react-aria-components';
import { useEffect, useState } from 'react';
import { Heading, DialogTrigger, TextField, Input } from 'react-aria-components'
import ITab from '../db/ITab';
import IStep from '../types/IStep';
import IProgress from '../types/IProgress';
import MyCheckbox from './MyCheckbox';

export default function MyTab(props: {isAdmin?: boolean}) {
    const [tabProgress, setTabProgress] = useState<IProgress>()
    const [curTab, setCurTab] = useState<ITab>()
    const [curSteps, setCurSteps] = useState<IStep[]>()
    const [checkboxes, setCheckboxState] = useState<string[]>([])
    const [tabs, setTabs] = useState<ITab[]>([])
    const [loadingProgress, setLoadingProgress] = useState(true)
    const [savingProgress, setSavingProgress] = useState(false)

    useEffect(() => {
        const ping = async () => {
            // window.electron.ipcRenderer.once('ipc-example', (arg) => {
            //   // eslint-disable-next-line no-console
            //   console.log(arg);
            // });
            // window.electron.ipcRenderer.myPing();
            // console.log(await window.electron.nodeV());
            // const filePath = await window.electron.openFile()
            // setFile(filePath)
        
            let res = await window.electron.queryDb<ITab>('onboarding', 'tabs', {})

            setTabs(res)

            let firstTab = res[0]
            setCurTab(firstTab)

            if (!props.isAdmin) {
                let progress = await window.electron.queryDb<IProgress>('onboarding', 'progress', {
                    tab: firstTab.name
                })
                setTabProgress(progress[0])

                if (progress[0]) {
                    setCurSteps(progress[0].steps)
                    setCheckboxState(progress[0].steps.filter(x => x.value == true).map(x => x.name))
                }
                else {
                    setCurSteps(firstTab.steps.map(x => {
                                        return {
                                            name: x,
                                            value: false
                                        } as IStep
                                    }))
                }
            }
            else {
            setCurSteps(firstTab.steps.map(x => {
                                        return {
                                            name: x,
                                            value: false
                                        } as IStep
                                    }))
                
            }

            setLoadingProgress(false)
          };

          ping()
    }, [])

    function updateProgress(e: boolean, stepName: string) {

        if (tabProgress) {
            setTabProgress(r => {
                return {
                    ...r,
                    steps: r!.steps.map(x => {
                        if (x.name == stepName) {
                            x.value = e
                        }
    
                        return x
                    })
                } as IProgress
            })
        }
        else {
            setTabProgress({
                tab: curTab!.name,
                steps: curTab!.steps.map(x => {
                    let res = {
                        name: x,
                        value: false
                    } as IStep
                    
                    if (x == stepName) {
                        res.value = e
                    }

                    return res
                })
            } as IProgress)
        }
        
    }

 function getStateProgress() {
    if (tabProgress) {
        let vals = tabProgress?.steps.filter(x => x.value==true).length!
        return (vals / tabProgress?.steps.length!) * 100
    }
    else {
        return 0
    }
 }

 async function saveProgress() {
    if (tabProgress) {
        setSavingProgress(true)

        await window.electron.insertOneDb('onboarding', 'progress', { tab: tabProgress.tab }, {
            ...tabProgress
        })

        const NOTIFICATION_TITLE = 'Title'
const NOTIFICATION_BODY = 'Saved your progress!'

new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    
        setSavingProgress(false)
    }
 }

 async function tabChange(key: string) {
    if (tabProgress) {
        // push up state
        await window.electron.insertOneDb('onboarding', 'progress', { tab: tabProgress.tab }, {
            ...tabProgress
        })

        // pull next state
        let progress = await window.electron.queryDb<IProgress>('onboarding', 'progress', {tab: key})

        setTabProgress(progress[0])
        setCurTab(tabs.filter(x => x.name == key)[0])
    }
 }

 async function addTab() {
    await window.electron.launchModal('https://github.com')
 }

 function removeStep(name: string) {
    setCurSteps(r => {
        return r?.filter(x => x.name != name)
    })
 }

    return (
        <div>
            <Tabs onSelectionChange={tabChange}>
                <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                    <TabList aria-label="Onboarding Material">
                        {tabs.map(x => <Tab key={`${x.name}_tab`} id={`${x.name}`}>{x.name}</Tab>)}
                    </TabList>
                    <Button onClick={props.isAdmin ? addTab : saveProgress}>{props.isAdmin ? 'Add Tab' : 'Save'}</Button>
                    
                </div>
                { savingProgress && <Text>Saving progress...</Text> }
                {!savingProgress && tabs.map(x => 
                    <TabPanel key={`${x.name}_panel`} id={`${x.name}`}>
                        <CheckboxGroup value={checkboxes} onChange={setCheckboxState}>
                            <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                <Label>{x.description}</Label>
                                {!props.isAdmin && <ProgressBar value={getStateProgress()}></ProgressBar>}
                                {props.isAdmin && <Button>Change description</Button>}
                            </div>
                            {
                                curSteps && curSteps.map(step => 
                                    <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                        <MyCheckbox 
                                            name={`${step.name}_cb`}
                                            value={step.name}
                                            key={step.name}
                                            onChange={(e: boolean) => updateProgress(e, step.name)}>
                                            {step.name}
                                        </MyCheckbox>
                                        {props.isAdmin && <Button onClick={(e: any) => removeStep(step.name)}>Delete step</Button>}
                                    </div>
                                )
                            }
                            {
                                !curSteps && <Text>Loading steps...</Text>
                            }
                        </CheckboxGroup>
                    </TabPanel>
                )}
            </Tabs>
        </div>
    )
}