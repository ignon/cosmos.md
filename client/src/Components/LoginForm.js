// import useField from '../utils/useField.js'
import * as Yup from 'yup';
import { Modal, Button } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik'
import { TextField } from './FormField'
import useLogin from '../useLogin'
import { useHistory } from 'react-router';
import { useApolloClient } from '@apollo/client';



const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
})

const LoginForm = ({ open, setOpen }) => {

  const client = useApolloClient()
  const history = useHistory()

  const { login } = useLogin({
    onCompleted: () => {
      setOpen(false)
      client.clearStore()
      client.resetStore()
      document.note = null // Blocks sendBeacon from saving current note
      history.go(0)
    }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async ({ username, password }) => {
    login({ username, password })
  }

  return (
    <Modal open={open} onClose={handleClose} closeIcon size='small' >
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={{
            username: '',
            password: '',
            displayName: ''
          }}
          onSubmit={handleSubmit}
          validationSchema={loginSchema}
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
                label='Password'
                placeholder='Password'
                name='password'
                component={TextField}
              />
              <Button
                type='submit'
                disabled={!isValid}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  )
}

export default LoginForm