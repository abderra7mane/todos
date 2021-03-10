import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Banner, Button, Card, Form, FormLayout, Stack, TextField } from "@shopify/polaris"
import { FormikHelpers, useFormik } from 'formik'
import * as Yup from 'yup'
import { authenticate, isAuthenticated } from '../../services/users'
import styles from '../../styles/auth.module.scss'


const defaultValue = {
  email: '',
  password: '',
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  password: Yup.string()
    .required('Password is required'),
})


export default function Signin() {
  const [error, setError] = useState(null)

  const router = useRouter()

  const formik = useFormik({
    validationSchema,
    initialValues: defaultValue,
    onSubmit: handleSubmit,
  })

  useEffect(tryAutoSignin, [])

  function tryAutoSignin() {
    if ( isAuthenticated() )
      router.push('/tasks')
  }

  function handleSubmit(user: any, actions: FormikHelpers<any>) {
    setError(null)
    
    authenticate(user)
      .then(() => {
        actions.setSubmitting(false)
        router.push('/tasks')
      })
      .catch((error) => {
        setError(error.message)
        actions.setSubmitting(false)
      })
  }

  function handleSignupAction() {
    router.push('/auth/signup')
  }

  const errorBanner = error ? (
    <Banner status="critical">
      <p>{error}</p>
    </Banner>
  ) : null

  return (
    <div className={styles.page}>
      <Head>
        <title>Todo App - Sign in</title>
      </Head>

      <div className={styles.content}>
        <Stack vertical>
          {errorBanner}

          <Card title="Sign in" sectioned>
            <Card.Section>
              <Stack vertical>
                <Form noValidate onSubmit={formik.handleSubmit}>
                  <FormLayout>
                    <TextField
                      label="Email"
                      type="email"
                      value={formik.values.email}
                      onChange={(value) => formik.setFieldValue('email', value)}
                      error={formik.submitCount ? formik.errors.email as string : undefined}
                      disabled={formik.isSubmitting}
                    />

                    <TextField
                      label="Password"
                      type="password"
                      value={formik.values.password}
                      onChange={(value) => formik.setFieldValue('password', value)}
                      error={formik.submitCount ? formik.errors.password as string : undefined}
                      disabled={formik.isSubmitting}
                    />
                  </FormLayout>
                </Form>

                <Stack distribution="equalSpacing" alignment="trailing">
                  <Button 
                    plain 
                    onClick={handleSignupAction}
                  >
                    Don't have an account yet!
                  </Button>
                  
                  <Button 
                    primary 
                    loading={formik.isSubmitting}
                    onClick={formik.handleSubmit}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Stack>
      </div>
    </div>
  )
}