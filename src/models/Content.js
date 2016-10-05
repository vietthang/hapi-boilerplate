import Model from '../components/orm'

export default class Content extends Model {

  get tableName() {
    return 'Content'
  }

  resource() {
    return this.belongsTo('Resource', 'resourceId')
  }

}
