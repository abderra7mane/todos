import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  Banner,
  Card, EmptyState, Form, FormLayout, Frame, Icon, Layout, Modal, 
  Page, ResourceItem, ResourceList, Select, Stack, TextContainer, TextField, TextStyle, TopBar 
} from '@shopify/polaris'
import { ClockMinor, DeleteMinor, EditMinor, LogOutMinor } from '@shopify/polaris-icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ITask, { TaskPriorityEnum, TaskStatusEnum } from '../../models/Task'
import { addTask, deleteTask, getTasks, updateTask } from '../../services/tasks'
import { clearSessionToken, isAuthenticated } from '../../services/users'


const priorityOptions = [
  { label: 'Normal', value: 1 },
  { label: 'Priority', value: 2 },
  { label: 'Critical', value: 3 },
  { label: 'Urgent', value: 4 },
]

const statusOptions = [
  { label: 'New', value: 1 },
  { label: 'Started', value: 2 },
  { label: 'Done', value: 3 },
  { label: 'Canceled', value: 4 },
]

/**
 * Initial value for a new task.
 */
const defaultTask: ITask = {
  _id: null,
  user: null,
  title: '',
  description: '',
  due: null,
  status: TaskStatusEnum.New,
  priority: TaskPriorityEnum.Normal,
  tags: [],
  attachments: [],
}

/**
 * Validation schema for task form.
 */
const validationSchema = Yup.object({
  id: Yup.string().nullable(true),
  user: Yup.string().nullable(true),
  title: Yup.string()
    .min(5, 'Title must be 5 characters or more')
    .required('Title is required'),
  description: Yup.string(),
  due: Yup.date().nullable(true),
  status: Yup.number().oneOf(statusOptions.map(o => o.value)),
  priority: Yup.number().oneOf(priorityOptions.map(o => o.value)),
  tags: Yup.array().of(Yup.string()),
  attachments: Yup.array().of(Yup.object())
})


/**
 * Format the provided date value with the format 
 * supported by 'date' input type (yyyy-MM-dd).
 * 
 * @param date Date value
 * @returns date as a string
 */
function getInputDateString(date: any) {
  if ( !date ) return ''

  const _date = new Date(date);
  const time = _date.getTime()

  if ( isNaN(time) ) return ''

  const y = `${_date.getFullYear()}`.padStart(4, '0'),
        m = `${_date.getMonth()}`.padStart(2, '0'),
        d = `${_date.getDate()}`.padStart(2, '0')

  return `${y}-${m}-${d}`
}

/**
 * Format the provided date using 'dd/MM/yyyy' format,
 * to be displayed in task list.
 * 
 * @param date Date value
 * @returns date as a string
 */
function getDateString(date: any) {
  if ( !date ) return ''

  const _date = new Date(date);
  const time = _date.getTime()

  if ( isNaN(time) ) return ''

  const y = `${_date.getFullYear()}`.padStart(4, '0'),
        m = `${_date.getMonth()}`.padStart(2, '0'),
        d = `${_date.getDate()}`.padStart(2, '0')

  return `${d}/${m}/${y}`
}


export default function Signin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [tasks, setTasks] = useState([])

  const [editDailogOpened, setEditDialogOpened] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const router = useRouter()

  const formik = useFormik<ITask>({
    validationSchema,
    initialValues: defaultTask,
    onSubmit: handleSubmitChanges,
  })
  
  useEffect(() => {
    if ( isAuthenticated() )
      fetchTasks()
    else
      router.push('/auth/signin')
  }, [])

  /**
   * Fetch the list of tasks.
   */
  function fetchTasks() {
    setError(null)
    setIsLoading(true)

    getTasks()
      .then((tasks) => {
        setTasks(tasks)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  /**
   * Trigger task form dialog to create a new task.
   */
  function handleAddAction() {
    setEditDialogOpened(true)
  }

  /**
   * Trigger task form dialog to edit a task
   * from the list.
   * 
   * @param task edited task
   */
  function handleEditAction(task: ITask) {
    formik.setValues(task)
    setEditDialogOpened(true)
  }

  /**
   * Trigger task deletion action.
   * 
   * @param id task id
   */
  function handleDeleteAction(id: string) {
    setError(null)
    setIsLoading(true)

    deleteTask(id)
      .then(() => {
        setIsLoading(false)
        fetchTasks()
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  /**
   * Close task edit form dialog and reset form values.
   */
  function handleCloseEditDialog() {
    if ( formik.isSubmitting ) 
      return

    formik.resetForm()
    setEditDialogOpened(false)
  }

  /**
   * Save the task changes or create a new one.
   * 
   * @param task 
   */
  function handleSubmitChanges(task: ITask) {
    let promise: Promise<any> = null

    if ( task._id )
      promise = updateTask(task)
    else
      promise = addTask(task)

    setError(null)
    setIsLoading(true)

    promise
      .then(function() {
        setIsLoading(false)
        formik.resetForm()
        setEditDialogOpened(false)
        fetchTasks()
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  /**
   * Renders a single task item.
   * 
   * @param task task object
   * @returns ReactNode
   */
  function renderTaskItem(task: ITask) {
    const shortcutActions = [
      { 
        content: <Icon source={EditMinor} />,
        onAction: () => handleEditAction(task),
      },
      { 
        content: <Icon source={DeleteMinor} />,
        onAction: () => handleDeleteAction(task._id),
      },
    ]

    const props: any = { id: task._id, shortcutActions }

    const due = task.due ? (
      <Stack.Item>
        <Stack spacing="tight" alignment="center">
          <Icon source={ClockMinor} />
          <div>Due: {getDateString(task.due)}</div>
        </Stack>
      </Stack.Item>
    ) : null

    return (
      <ResourceItem {...props}>
        <Stack distribution="equalSpacing" alignment="trailing">
          <Stack spacing="tight" vertical>
            <h3>
              <TextStyle variation="strong">{task.title}</TextStyle>
            </h3>

            <TextContainer>
              <p>{task.description}</p>
            </TextContainer>
          </Stack>

          {due}
        </Stack>
      </ResourceItem>
    )
  }

  /**
   * Empty state element.
   */
  const emptyState = (
    <EmptyState
      heading="Add some tasks to get started"
      image="images/add-task.png"
      action={{
        content: 'Add Task', 
        onAction: handleAddAction,
        disabled: isLoading || error,
      }}
    />
  )

  /**
   * Task edit form modal.
   */
  const editModal = editDailogOpened ? (
    <Modal
      open={true}
      title={`${formik.values._id ? 'Update' : 'Add'} Task`}
      primaryAction={{
        content: formik.values._id ? 'Update' : 'Add',
        onAction: formik.handleSubmit,
        loading: formik.isSubmitting,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleCloseEditDialog,
          disabled: formik.isSubmitting,
        }
      ]}
      onClose={handleCloseEditDialog}
    >
      <Modal.Section>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <FormLayout>
            <TextField 
              label="Title" 
              value={formik.values.title}
              onChange={(value) => formik.setFieldValue('title', value)}
              error={formik.submitCount ? formik.errors.title : undefined}
            />
            
            <TextField 
              label="Description"
              value={formik.values.description}
              multiline={4}
              onChange={(value) => formik.setFieldValue('description', value)}
              error={formik.submitCount ? formik.errors.description : undefined}
            />

            <TextField
              label="Due Date"
              value={getInputDateString(formik.values.due)}
              type="date"
              onChange={(value) => formik.setFieldValue('due', value)}
              error={formik.submitCount ? (formik.errors.due as any) : undefined}
            />

            <Select
              label="Priority"
              options={priorityOptions as any}
              value={formik.values.priority as any}
              onChange={(value) => formik.setFieldValue('priority', value)}
              error={formik.submitCount ? (formik.errors.priority as any) : undefined}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  ) : null

  /**
   * Error display banner.
   */
  const errorBanner = error ? (
    <Banner status="critical">
      <p>{error}</p>
    </Banner>
  ) : null

  /**
   * Top Bar user menu.
   */
  const userMenuActions = [
    {
      items: [
        { 
          content: 'Sign out', 
          icon: LogOutMinor, 
          onAction: handleSignoutAction,
        }
      ]
    }
  ]

  // TODO: change user model
  const userName = "Abdou"

  const userMenu = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={userName}
      initials={null}
      open={userMenuOpen}
      onToggle={toggleUserMenu}
    />
  )

  function toggleUserMenu() {
    setUserMenuOpen(!userMenuOpen)
  }

  function handleSignoutAction() {
    clearSessionToken()
    router.push('/auth/signin')
  }

  /**
   * Tob bar.
   */

  const topBar = (
    <TopBar 
      userMenu={userMenu}
    />
  )

  return (
    <Frame
      topBar={topBar}
    >
      <Page 
        title="Todo List"
        primaryAction={{ 
          content: 'Add Task', 
          onAction: handleAddAction,
          disabled: isLoading || error,
        }}
      >
        <Head>
          <title>Todo List</title>
        </Head>

        <Layout>
          <Layout.Section>
            {editModal}

            <Stack vertical>
              {errorBanner}

              <Card>
                <ResourceList 
                  items={tasks}
                  renderItem={renderTaskItem}
                  emptyState={emptyState}
                  loading={isLoading}
                />
              </Card>
            </Stack>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  )
}