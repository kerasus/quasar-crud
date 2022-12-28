'use strict'

const EntityCreate = require('./src/components/Entity/Create/EntityCreate')
const EntityShow = require('./src/components/Entity/Show/EntityShow')
const EntityEdit = require('./src/components/Entity/Edit/EntityEdit')
const EntityIndex = require('./src/components/Entity/Index/EntityIndex')
const EntityCrud = require('./src/components/EntityCrud')
const EntityIndexTable = require('./src/components/Entity/Index/EntityIndexTable')
const EntityInput = require('./src/components/Entity/Attachment/EntityInput')
const Portlet = require('./src/components/Portlet')
const EntityCrudFormBuilder = require('./src/components/Entity/EntityCrudFormBuilder')
const EntityAction = require('./src/components/Entity/EntityAction.vue')
const EntityCrudObject = { EntityCreate, EntityShow, EntityEdit, EntityIndex, EntityCrud, Portlet, EntityIndexTable, EntityInput, EntityCrudFormBuilder, EntityAction }

module.exports = EntityCrudObject;
module.exports.default = EntityCrudObject;
