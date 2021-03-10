
function randomId() {
  return `${Math.random() * Math.pow(10, 10)}`
}

export function createQuery(data: any, Store: any[]): Promise<any> {
  return new Promise((resolve) => {
    data._id = randomId()
    Store.push(data)
    resolve(data._id)
  })
}

export function updateOneQuery(data: any, Store: any[]): Promise<string> {
  return new Promise((resolve) => {
    const item = Store.find(i => i._id === data._id)
    if ( item ) Object.assign(item, data)
    resolve('Updated Successfully')
  })
}

export function getQuery(data: any, Store: any[]): Promise<any[]> {
  return Promise.resolve(Store)
}

export function getOneQuery(data: any, Store: any[]): Promise<any> {
  return new Promise((resolve) => {
    resolve(Store.find(item => item.email === data.query.email))
  })
}

export function deleteQuery(data: any, Store: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const itemIndex = Store.findIndex(i => i._id === data._id)
    if ( itemIndex >= 0 ) Store.splice(itemIndex, 1)
    resolve('Deleted Successfully!')
  })
}
