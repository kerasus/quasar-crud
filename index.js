'use strict'

const Portlet = require('./src/components/Portlet.vue')
const EntityCrud = require('./src/components/EntityCrud.vue')
const EntityAction = require('./src/components/Entity/EntityAction.vue')
const EntityShow = require('./src/components/Entity/Show/EntityShow.vue')
const EntityEdit = require('./src/components/Entity/Edit/EntityEdit.vue')
const EntityIndex = require('./src/components/Entity/Index/EntityIndex.vue')
const EntityCreate = require('./src/components/Entity/Create/EntityCreate.vue')
const EntityInput = require('./src/components/Entity/Attachment/EntityInput.vue')
const EntityIndexTable = require('./src/components/Entity/Index/EntityIndexTable.vue')
const EntityCrudFormBuilder = require('./src/components/Entity/EntityCrudFormBuilder.vue')
const EntityCrudObject = { EntityCreate, EntityShow, EntityEdit, EntityIndex, EntityCrud, Portlet, EntityIndexTable, EntityInput, EntityCrudFormBuilder, EntityAction }

module.exports = EntityCrudObject;
module.exports.default = EntityCrudObject;
