import { Tabs, TabList, Tab, TabPanel, Button, CheckboxGroup, Label, Text } from 'react-aria-components';
import { useEffect, useState } from 'react';
import ITab from '../db/ITab';
import IStep from '../types/IStep';
import IProgress from '../types/IProgress';
import EditAccountModal from '../components/Modal/Modal';
import MyCheckbox from '../components/MyCheckbox';

export default function AdminPage() {
    const [tabProgress, setTabProgress] = useState<IProgress>()
    const [curTab, setCurTab] = useState<ITab>()
    const [curSteps, setCurSteps] = useState<IStep[]>()
    const [checkboxes, setCheckboxState] = useState<string[]>([])
    const [tabs, setTabs] = useState<ITab[]>([])
    const [loadingProgress, setLoadingProgress] = useState(true)
    const [savingProgress, setSavingProgress] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    useEffect(() => {
        const ping = async () => {

            let res = await window.electron.queryDb<ITab>('onboarding', 'tabs', {})

            setTabs(res)

            let firstTab = res[0]
            setCurTab(firstTab)

            setCurSteps(firstTab.steps.map(x => {
                return {
                    name: x,
                    value: false
                } as IStep
            }))

            setLoadingProgress(false)
          };

          ping()
    }, [])

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

 }

 async function addTab() {
    // add tab
    //await window.electron.launchModal('http://localhost:3000/addtab')
    setModalShow(!modalShow)
 }

 function removeStep(name: string) {
    setCurSteps(r => {
        return r?.filter(x => x.name != name)
    })
 }

    return (
        <div>
            {
                modalShow && <EditAccountModal close={() => setModalShow(false)} />
            }
            <Tabs onSelectionChange={tabChange}>
                <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                    <TabList aria-label="Onboarding Material">
                        {tabs.map(x => <Tab key={`${x.name}_tab`} id={`${x.name}`}>{x.name}</Tab>)}
                    </TabList>
                    <Button onPress={addTab}>Add Tab</Button>
                </div>
                {savingProgress && <Text>Saving progress...</Text>}
                {!savingProgress && tabs.map(x => 
                    <TabPanel key={`${x.name}_panel`} id={`${x.name}`}>
                        <CheckboxGroup value={checkboxes} onChange={setCheckboxState}>
                            <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                <Label>{x.description}</Label>
                                <Button>Change description</Button>
                            </div>
                            {
                                curSteps && curSteps.map(step => 
                                    <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
                                        <MyCheckbox 
                                            value={step.name}
                                            key={step.name}
                                            isIndeterminate>
                                            {step.name}
                                        </MyCheckbox>
                                        <Button onPress={removeStep(step.name)}>Delete step</Button>
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