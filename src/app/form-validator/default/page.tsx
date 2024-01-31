'use client'
import { useState, useEffect, useRef, useReducer } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, FormValidator, MaskedTextBoxComponent, UploaderComponent, FormValidatorModel } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';


let formObject: FormValidator;
export default function Form() {

    const userNameRef = useRef(null);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const initialState = { email: '', password: '' };
    const reducer = (state: any, action: any) => {
        switch (action.type) {
            case 'update':
                return { ...state, [action.field]: action.value };
            default:
                return initialState;
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const dateChangeHandler = (event: any) => {
        setDateOfBirth(event.value);
    };
    const update = (field: any) => (event: any) => {
        //update action is dispatched to update the email and password state value
        dispatch({ type: 'update', field, value: event.value });
    };

    // checks the length of mask value and returns corresponding boolean value
    const customFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
        const argsLength = (args.element as any).ej2_instances[0].value.length;
        return argsLength >= 10;
    };

    useEffect(() => {
        (userNameRef.current as any).focusIn();
        const options: FormValidatorModel = {
            // validation rules
            rules: {
                name: {
                    required: [true, '* Please enter your full name'],
                },
                email: {
                    required: [true, '* Please enter your email'],
                },
                password: {
                    required: [true, '* Please enter your password'],
                },
                mask_value: {
                    numberValue: [customFn, '* Please enter your phone number']
                },
                date: {
                    required: [true, '* Please enter your date of birth'],
                },
                dropdown: {
                    required: [true, '* Please select your gender']
                },
                Address: {
                    required: [true, '* Please enter your address']
                }

            },
        };
        // Initialize the form validator
        formObject = new FormValidator('#form1', options);
    }, []);
    const onSubmit = () => {
        formObject.validate();
        if (formObject.validate()) {
            formObject.element.reset();
        }
    };

    const genderData: string[] = ['Male', 'Female', 'Others'];

    return <>
        <div id="container">
            <div className="control_wrapper" id="control_wrapper">
                <h3 className="form-title">Personal Details</h3>
                <div className="control_wrapper textbox-form">
                    <form id="form1" method="post">
                        <div className="form-group">
                            <TextBoxComponent ref={userNameRef} name="name" value={state.email} change={update('name')} placeholder="Full Name" floatLabelType="Auto" data-msg-containerid="errorForName" />
                            <div id="errorForName" />
                        </div>
                        <div className="form-group">
                            <TextBoxComponent type="email" name="email" value={state.email} change={update('email')} placeholder="Email" floatLabelType="Auto" data-msg-containerid="errorForEmail" />
                            <div id="errorForEmail" />
                        </div>
                        <div className="form-group">
                            <TextBoxComponent type="password" name="password" value={state.password} change={update('password')} placeholder="Password" floatLabelType="Auto" data-msg-containerid="errorForPassword" />
                            <div id="errorForPassword" />
                        </div>
                        <div className="form-group">
                            <DatePickerComponent name="date" value={dateOfBirth as any} change={dateChangeHandler} placeholder="Date of Birth" floatLabelType="Auto" data-msg-containerid="errorForDateOfBirth" />
                            <div id="errorForDateOfBirth" />
                        </div>
                        <div className="form-group">
                            <DropDownListComponent name='dropdown' placeholder='Choose a gender' floatLabelType='Auto' dataSource={genderData} data-msg-containerid="errorForGender" />
                            <div id="errorForGender" />
                        </div>
                        <div className="form-group">
                            <MaskedTextBoxComponent mask="000-000-0000" id="mask" name="mask_value" placeholder="Phone Number" floatLabelType="Always" data-msg-containerid="errorForPhone" />
                            <label className='e-error' htmlFor='mask_value' />
                        </div>
                        <div className="form-group">
                            <div className="e-float-input">
                                <textarea className="address-field" id="Address" name="Address" />
                                <span className="e-float-line" />
                                <label className="e-float-text e-label-top">Address</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="e-float-text e-custom-label">Upload Photo (optional)</div>
                            <UploaderComponent name="upload" type="file" multiple={false} data-msg-containerid="errorForUpload" />
                        </div>
                    </form>
                    <div className="submitBtn">
                        <ButtonComponent onClick={onSubmit}>Submit</ButtonComponent>
                    </div>
                </div>
            </div>
        </div>
    </>;
}