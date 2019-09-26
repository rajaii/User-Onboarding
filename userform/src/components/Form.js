import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, withFormik, Field, setNestedObjectValues } from 'formik';
import axios from 'axios';

function UserForm ({values, errors, touched, isSubmitting}) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
          .post("https://reqres.in/api/users", values)
          .then(res => {
            console.log(res); // Data was created successfully and logs to console
            setUsers([...users, res.data]);
          })
          .catch(err => {
            console.log(err); // There was an error creating the data and logs to console
            setError(err.message);
          });
    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <div>
                    <Field name='name' placeholder='name'></Field>
                </div>
                <div>
                    {touched.email && errors.email && <p>{errors.email}</p>}
                    <Field type='email' name='email' placeholder='email'></Field>
                </div>
                <div>
                    {touched.password && errors.password && <p>{errors.password}</p>}
                    <Field type='password' name='password' placeholder='password'></Field>
                </div>
                <label>
                    <Field type='checkbox' value={values.tos} placeholder='terms of service'></Field>
                </label>
                <button disabled={isSubmitting}>Submit</button>
            </Form>
            <div>
                {error ? <p>{error}</p> : users.map(u => {
                return (
                    <div>
                        <p>{u.name}</p>
                        <p>{u.email}</p>
                        <p>{u.password}</p>
                    </div>
                )}
                )}
            </div>
        </div>
    );
}

const FormikUserForm = withFormik({
    
    mapPropsToValues({ name, email, password, tos, meal }) {
      return {
        name: name || "",
        email: email || "",
        password: password || "",
        tos: tos || false,
      };
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('name is required'),
      email: Yup.string()
        .email("Email not valid")
        .required("Email is required"),
      password: Yup.string()
        .min(16, "Password must be 16 characters or longer")
        .required("Password is required")
    }),///////////////
    handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
      if (values.email === "alreadytaken@atb.dev") {
        setErrors({ email: "That email is already taken" });
      } else {
        axios
          .post("https://reqres.in/api/users", values)
          .then(res => {
            console.log(res); // Data was created successfully and logs to console
            resetForm();
            setSubmitting(false);
          })
          .catch(err => {
            console.log(err); // There was an error creating the data and logs to console
            setSubmitting(false);
          });
      }
    }
  })(UserForm);

  

export default FormikUserForm;