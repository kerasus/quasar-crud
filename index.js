import Portlet from './src/components/Portlet.vue'
import EntityCrud from './src/components/EntityCrud.vue'
import EntityAction from './src/components/Entity/EntityAction.vue'
import EntityShow from './src/components/Entity/Show/EntityShow.vue'
import EntityEdit from './src/components/Entity/Edit/EntityEdit.vue'
import EntityIndex from './src/components/Entity/Index/EntityIndex.vue'
import EntityCreate from './src/components/Entity/Create/EntityCreate.vue'
import EntityInput from './src/components/Entity/Attachment/EntityInput.vue'
import EntityIndexTable from './src/components/Entity/Index/EntityIndexTable.vue'
import EntityCrudFormBuilder from './src/components/Entity/EntityCrudFormBuilder.vue'
const EntityCrudObject = { EntityCreate, EntityShow, EntityEdit, EntityIndex, EntityCrud, Portlet, EntityIndexTable, EntityInput, EntityCrudFormBuilder, EntityAction }

export {
  EntityCrudObject as default,
  EntityCreate,
  EntityShow,
  EntityEdit,
  EntityIndex,
  EntityCrud,
  Portlet,
  EntityIndexTable,
  EntityInput,
  EntityCrudFormBuilder,
  EntityAction
}
