import uuid from 'uuid'

import Model from '../components/orm'
import { get as ResourceSchema } from '../schemas/models/resource.yaml'

export default class Resource extends Model {

  static schema = ResourceSchema;

  constructor(...args) {
    super(...args)

    this.on('creating', () => {
      this.set('id', uuid.v4())
    })
  }

  get tableName() {
    return 'Resource'
  }

  contents() {
    return this.hasMany('Content', 'resourceId')
  }

}
