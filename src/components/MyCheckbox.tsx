import {Checkbox as AriaCheckbox, CheckboxProps} from 'react-aria-components';
import './Checkbox.css';

export default function MyCheckbox({ children, ...props }: CheckboxProps) {
  return (
    (
      <AriaCheckbox {...props}>
        {(props: { isIndeterminate: boolean }) => (
          <>
            <div className="checkbox">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                {props.isIndeterminate
                  ? <rect x={1} y={7.5} width={15} height={3} />
                  : <polyline points="1 9 7 14 15 4" />}
              </svg>
            </div>
            {children}
          </>
        )}
      </AriaCheckbox>
    )
  );
}