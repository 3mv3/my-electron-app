import './Styles.css';
import { Button, Form, Input } from 'react-aria-components';

export interface EditAccountModalProps {
  close(): void;
}

const EditAccountModal = ({close}: EditAccountModalProps) => {
  return (
    <div>
        <div className='overlay' onClick={close}></div>
        <div className='modal' id='modal'>
            <div id='form'>
                <Form>
                    <div id='input'>
                        <Input label="Display Name" name="displayName" />
                    </div>
                    <Button text="Submit" />
                </Form>
            </div>
        </div>
    </div>
  );
};

export default EditAccountModal;