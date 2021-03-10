import mongoose from 'mongoose'
import MongoClient from 'mongodb'
import { mongoOptions, mongoString } from './config'


export function dbConnect() {
  return new Promise((resolve, reject) => {
    const state = mongoose.connection.readyState
    if (state === 0) {
      mongoose.connect(
        mongoString,
        mongoOptions
      ).then(() => {
        resolve(null)
      }).catch(error => {
        console.log(JSON.stringify(error))
        reject('Error while connecting to DB')
      })
    } else if (state === 1) {
      resolve(null)
    } else if (state === 2 || state === 3) {
      const handler = () => {
        dbConnect().then(() => {
          resolve(null)
        }).catch((error) => {
          reject(error)
        })
      }

      mongoose.connection.once('connected', handler)
      mongoose.connection.once('disconnected', handler)
    } else {
      reject('DB connection in invalid state!')
    }
  })
}

export function runQuery(func) {
  return new Promise((resolve, reject) => {
    dbConnect().then(() => {
      func().then((result) => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

export function createQuery(data, Model): Promise<any> {
  return new Promise((resolve, reject) => {
    const {
      returnId,
      returnInstance,
      ...obj
    } = data

    runQuery(() => {
      var instance = new Model()
      Object.assign(instance, obj)

      var error = instance.validateSync()
      if (error) {
        console.log(JSON.stringify(obj),
          JSON.stringify(error))
        return Promise.reject('Invalid data was submitted!')
      } else {
        return instance.save()
      }
    }).then((dbInstance: any) => {
      if (returnId) {
        resolve(dbInstance._id)
      } else if (returnInstance) {
        resolve(dbInstance)
      } else {
        resolve('Successfully Created!')
      }
    }).catch((error) => {
      console.log(JSON.stringify(error))
      reject('Error while saving!')
    })
  })
}

export function updateOneQuery(data, Model): Promise<string> {
  return new Promise((resolve, reject) => {
    runQuery(() => {
      const query = {
        _id: data._id
      },
        update = {
          $set: {}
        },
        options = {
          new: true
        }
      Object.keys(data).forEach((key) => {
        if (key.startsWith('$')) {
          update[key] = data[key]
        } else if (key !== '_id') {
          update['$set'][key] = data[key]
        }
      })

      return Model.findOneAndUpdate(
        query, update, options)
    }).then(() => {
      resolve('Successfully Updated!')
    }).catch((error) => {
      console.log(JSON.stringify(error))
      reject('Error while updating!')
    })
  })
}

export function getQuery(data, Model): Promise<any[]> {
  return new Promise((resolve, reject) => {
    runQuery(() => {
      data = data || {}

      const query = data.query || {},
        populate = data.populate || [],
        sort = data.sort || {},
        select = data.select || {}

      if (typeof query.deleted === 'undefined') {
        query.deleted = {
          $ne: true
        }
      }

      if (typeof query._id === 'string') {
        query._id = new MongoClient.ObjectID(query._id)
      }

      const offset = data.offset || 0,
        limit = data.limit || 0

      return Model.find(query)
        .select(select)
        .populate(populate)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .lean()
    }).then((results: any) => {
      resolve(results)
    }).catch((error) => {
      console.log(error)
      reject('Error while searching!')
    })
  })
}

export function getOneQuery(data, Model): Promise<any> {
  return new Promise((resolve, reject) => {
    runQuery(() => {
      const query = data.query || {},
        populate = data.populate || [],
        select = data.select || {}

      if (query.deleted === 'any') {
        delete query.deleted
      } else if (typeof query.deleted === 'undefined') {
        query.deleted = {
          $ne: true
        }
      }

      if (typeof query._id === 'string') {
        query._id = new MongoClient.ObjectID(query._id)
      }

      return Model.findOne(query)
        .select(select)
        .populate(populate)
        .lean()
    }).then((result) => {
      resolve(result)
    }).catch((error) => {
      console.log(error)
      reject('Error while searching!')
    })
  })
}

export function deleteQuery(query, Model): Promise<string> {
  return new Promise((resolve, reject) => {
    runQuery(() => {
      return Model.remove(query)
    }).then(() => {
      resolve('Successfully Deleted!')
    }).catch((error) => {
      console.log(JSON.stringify(error))
      reject('Error while deleting!')
    })
  })
}
