// import useField from '../utils/useField.js'
import * as Yup from 'yup';
import { Modal, Button } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik'
import { TextField } from './FormField'
import useLogin from '../useLogin'
import { useHistory } from 'react-router';



const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
})

const LoginForm = ({ open, setOpen }) => {

  const history = useHistory()

  const { login } = useLogin({
    onCompleted: () => {
      setOpen(false)
      history.go(0) // re-render page
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