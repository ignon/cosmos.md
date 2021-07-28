import * as Yup from 'yup'
import { Modal, Button } from 'semantic-ui-react'
import { Formik, Form, Field } from 'formik'
import { TextField } from './FormField'
import useLogin from '../useLogin'
import { useHistory } from 'react-router'
import { useApolloClient } from '@apollo/client'


const registerSchema = Yup.object().shape({
  username: Yup.string()
    .label('Username')
    .min(4)
    .max(15)
    .required(),
  displayName: Yup.string()
    .label('Display name')
    .min(4)
    .max(15)
    .required(),
  password: Yup.string()
    .label('Password')
    .min(6)
    .max(50)
    .required(),
})

const RegisterForm = ({ setOpen, open }) => {
  const client = useApolloClient()
  const history = useHistory()

  const { register } = useLogin({
    onCompleted: () => {
      setOpen(false)
      client.clearStore()
      client.resetStore()
      document.note = null
      history.go(0)
    }
  })

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Modal open={open}  onClose={handleClose} closeIcon size='small' >
      <Modal.Header>Register</Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={{
            username: '',
            displayName: '',
            password: '',
          }}
          onSubmit={values => {
            register(values)
          }}
          validationSchema={registerSchema}
        >
          {({ isValid }) => ( 
            <Form className='form ui'>
              <Field
                label='Username'
                placeholder='Username'
                name='username'
                component={TextField}
              />
              <Field
                label='Display Name'
                placeholder='Display Name'
                name='displayName'
                component={TextField}
              />
              <Field
                label='Password'
                placeholder='Password'
                name='password'
                component={TextField}
              />
              <Button
                type='submit'
                disabled={!isValid}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  )
}

export default RegisterForm


// import React from 'react';
// import { Modal, Segment } from 'semantic-ui-react';
// import AddPatientForm, { PatientFormValues } from './AddPatientForm';

// interface Props {
//   modalOpen: boolean;
//   onClose: () => void;
//   onSubmit: (values: PatientFormValues) => void;
//   error?: string;
// }

// const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
//   <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
//     <Modal.Header>Add a new patient</Modal.Header>
//     <Modal.Content>
//       {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
//       <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
//     </Modal.Content>
//   </Modal>
// );

// export default AddPatientModal;