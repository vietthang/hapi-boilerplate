import Model from '../components/orm'

export default class Resource extends Model {

  get tableName() {
    return 'Resource'
  }

  contents() {
    return this.hasMany('Content', 'resourceId')
  }

}
