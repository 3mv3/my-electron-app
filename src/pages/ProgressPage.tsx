import { Tabs, TabList, Tab, TabPanel, ProgressBar, Button, Checkbox, CheckboxGroup, Text, Label } from 'react-aria-components';
import { useEffect, useState } from 'react';
import ITab from '../db/ITab';
import IStep from '../types/IStep';
import IProgress from '../types/IProgress';
import MyCheckbox from '../components/MyCheckbox';

export default function ProgressPage() {
    const [tabProgress, setTabProgress] = useState<IProgress>()
    const [curTab, setCurTab] = useState<ITab>()
    const [curSteps, setCurSteps] = useState<IStep[]>()
    const [checkboxes, setCheckboxState] = useState<string[]>([])
    const [tabs, setTabs] = useState<ITab[]>([])
    const [loadingProgress, setLoadingProgress] = useState(true)
    const [savingProgress, setSavingProgress] = useState(false)

    useEffect(() => {
        const ping = async () => {
            let res = await window.electron.queryDb<ITab>('onboarding', 'tabs', {})

            setTabs(res)

            let firstTab = res[0]
            setCurTab(firstTab)

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

 async function testCli() {
    console.log(await window.electron.getNodeVersion())
 }

    return (
        <div>
            <Tabs onSelectionChange={tabChange}>
                <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                    <TabList aria-label="Onboarding Material">
                        {tabs.map(x => <Tab key={`${x.name}_tab`} id={`${x.name}`}>{x.name}</Tab>)}
                    </TabList>
                    <Button onPress={saveProgress}>Save</Button>
                    <Button onPress={testCli}>Test CLI</Button>
                </div>
                { savingProgress && <Text> Saving progress... </Text> }
                { !savingProgress && tabs.map(x => 
                    <TabPanel key={`${x.name}_panel`} id={`${x.name}`}>
                        <CheckboxGroup value={checkboxes} onChange={setCheckboxState}>
                            <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                <Label>{x.description}</Label>
                                <ProgressBar value={getStateProgress()}></ProgressBar>
                            </div>
                            {
                                curSteps && curSteps.map(step => 
                                    <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                        <MyCheckbox 
                                            value={step.name}
                                            key={step.name}
                                            onChange={(e: boolean) => updateProgress(e, step.name)}>
                                            {step.name}
                                        </MyCheckbox>
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