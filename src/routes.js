import * as resources from './controllers/resources'
import * as contents from './controllers/contents'

export default {

  findResource: resources.find,

  createResource: resources.create,

  getResource: resources.get,

  updateResource: resources.update,

  deleteResource: resources.destroy,

  getResourceUrl: resources.getUrl,

  findContent: contents.find,

  createContent: contents.create,

  getContent: contents.get,

  updateContent: contents.update,

  deleteContent: contents.destroy,

}
