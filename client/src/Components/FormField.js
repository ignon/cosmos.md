import { Form } from 'semantic-ui-react'
import { Field, ErrorMessage } from 'formik'

export const TextField = ({ field, label, placeholder }) => (
  console.log({ field, label, placeholder }) ||
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color:'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
)