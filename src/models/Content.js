import Model from '../components/orm'
import { get as ContentSchema } from '../schemas/models/content.yaml'

export default class Content extends Model {

  static schema = ContentSchema;

  get tableName() {
    return 'Content'
  }

  resource() {
    return this.belongsTo('Resource', 'resourceId')
  }

}
