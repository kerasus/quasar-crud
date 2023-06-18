const Portlet = require('./src/components/Portlet.vue').default
const EntityCrud = require('./src/components/EntityCrud.vue').default
const EntityAction = require('./src/components/Entity/EntityAction.vue').default
const EntityShow = require('./src/components/Entity/Show/EntityShow.vue').default
const EntityEdit = require('./src/components/Entity/Edit/EntityEdit.vue').default
const EntityIndex = require('./src/components/Entity/Index/EntityIndex.vue').default
const EntityCreate = require('./src/components/Entity/Create/EntityCreate.vue').default
const EntityInput = require('./src/components/Entity/Attachment/EntityInput.vue').default
const EntityIndexTable = require('./src/components/Entity/Index/EntityIndexTable.vue').default
const EntityCrudFormBuilder = require('./src/components/Entity/EntityCrudFormBuilder.vue').default

const EntityCrudObject = { EntityCreate, EntityShow, EntityEdit, EntityIndex, EntityCrud, Portlet, EntityIndexTable, EntityInput, EntityCrudFormBuilder, EntityAction }

module.exports = EntityCrudObject
module.exports.default = EntityCrudObject