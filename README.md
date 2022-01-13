# quasar-crud
This package includes 4 main component that combine several feature of Quasar like q-table, q-input , q-time and etc:  

+ EntityIndex => For list of items.
+ EntityEdit => For edit information of any item of list
+ EntityCreate => For create new item
+ EntityShow =>  For show information of item  

It also has:
+ Portlet => You can make every customized component that you want
+ EntityIndexTable => For make table in a specific structure

## install
```
npm i quasar-crud
```

## Usage

To use it in vue files, you need to import the component you want and use it like a regular component, for example:

```vue
<template>
    <entity-index/>
</template>

<script>
    import EntityIndex from 'quasar-crud'
    export default {
        components: { EntityIndex }
    }
</script>
```

## Features:

+ ### EntityIndex

| props               |           default           | type             | description                                |
|---------------------|:---------------------------:|:-----------------|--------------------------------------------|
| value               |             [ ]             | Array            |                                            |
| title               |             ' '             | String           |                                            |
| api                 |             ' '             | String           |                                            |
| createRouteName     |             ' '             | String, Boolean  |                                            |
| tableKeys           |  { data: ' ', total: ' ' }  | Object           | query params of response                   |
| table               | { columns: [ ], data: [ ] } | Object           | column include  props of column in q-table | 
| beforeLoadInputData |          () => { }          | Function         |                                            |
| afterLoadInputData  |          () => { }          | Function         |                                            |

+ ### EntityEdit

| props               |           default           | type      | description                  |
|---------------------|:---------------------------:|:----------|------------------------------|
| value               |             [ ]             | Array     |                              |
| title               |             ' '             | String    |                              |
| api                 |             ' '             | String    |                              |
| entityIdKey         |           ' id '            | String    | Id of selected item          |
| entityParamKey      |           ' id '            | String    | need for router param        |
| showRouteName       |             ' '             | String    | route name of show component |
| table               | { columns: [ ], data: [ ] } | Object    |                              |
| beforeGetData       |          () => { }          | Function  |                              |
| beforeLoadInputData |          () => { }          | Function  |                              |
| afterLoadInputData  |          () => { }          | Function  |                              |

+ ### EntityCreate

| props                 |           default           | type     | description                                      |
|-----------------------|:---------------------------:|:---------|--------------------------------------------------|
| value                 |             [ ]             | Array    |                                                  |
| title                 |             ' '             | String   |                                                  |
| api                   |             ' '             | String   |                                                  |
| showRouteName         |             ' '             | String   | route name of show component                     |
| showRouteParamKey     |             ' '             | String   | router param of show component                   |
| entityIdKeyInResponse |           ' id '            | String   | ned for value of  router param of show component |
| indexRouteName        |             ' '             | String   | route name of index component                    |
| table                 | { columns: [ ], data: [ ] } | Object   |                                                  |
| beforeLoadInputData   |          () => { }          | Function |                                                  |
| afterLoadInputData    |          () => { }          | Function |                                                  |
+ ### EntityShow


| props               |           default           | type     | description                   |
|---------------------|:---------------------------:|:---------|-------------------------------|
| value               |             [ ]             | Array    |                               |
| title               |             ' '             | String   |                               |
| api                 |             ' '             | String   |                               |
| entityIdKey         |           ' id '            | String   | Id of selected item           |
| entityParamKey      |           ' id '            | String   | need for router param         |
| editRouteName       |             ' '             | String   | route name of edit component  |
| indexRouteName      |             ' '             | String   | route name of index component |
| table               | { columns: [ ], data: [ ] } | Object   |                               |
| beforeGetData       |          () => { }          | Function |                               |
| beforeLoadInputData |          () => { }          | Function |                               |
| afterLoadInputData  |          () => { }          | Function |                               |


+ ### Portlet:

it has 3 slot that you can use them in all previous components:
	
    #title
    #toolbar
    #content
+ ### EntityIndexTable:
it has 3 slot that you can use them in **EntityIndex** component: 

    #top="props"
    #body-cell="props"  
    # content  

| props      |                                                              default                                                              | type      |
|------------|:---------------------------------------------------------------------------------------------------------------------------------:|:----------|
| value      | { data: [ ], </br>pagination:{ </br>sortBy: 'desc',</br>descending: false,</br>page: 1, </br>rowsPerPage: 0 }</br>rowsNumber: 0 } | Object    |
| title      |                                                                ' '                                                                | String    |
| loading    |                                                               false                                                               | Boolean   |
| columns    |                                                                [ ]                                                                | Array     |
| changePage |                                                             () => {}                                                              | Function  |


>### Notice!
>You can create forms in all previous components using [quasar-form-builder](https://www.npmjs.com/package/quasar-form-builder).  
>To access them you can v-model an array of input's props as value prop in quasar-crud's components


 
