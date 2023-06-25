<script lang="ts" setup>
import { Spinner } from 'flowbite-vue'
import { user, records } from '../api'
import { Record } from '../types'
import Pagination from './Pagination.vue'

type Column<T> = {
  label?: string
  render?: (row: T) => any
  flex?: number;
  slotName?: string
}

export type Props<T> = {
  columns: Column<T>[]
  data: any[]
  emptyMessage?: string;
  loading?: boolean
}

defineProps<Props<Record>>()
</script>

<template>
  <div class="flex flex-col justify-between">
    <div class="grow block overflow-y-scroll w-full table-container sm:max-w-2xl sm:m-auto">
      <div class="flex flex-col justify-center items-center w-full">
        <div class="grow p-8 transition duration-300 ease-in-out" v-if="user.loading || records.loading">
          <Spinner size="4" color="blue" />
        </div>
        <div class="w-full">
          <table class="table table-auto w-full" v-if="!!data.length && !records.loading && !user.loading">
            <thead class="text-left text-xs font-medium text-gray-700 uppercase border-b">
              <tr>
                <th v-for="(column) in columns" scope="col" class="px-6 py-3 w-auto no-wrap">
                  {{ column.label || '' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in data || []" class="bg-white border-b hover:bg-gray-50">
                <td class="group px-6 py-4 text-xs font-normal text-gray-700 w-full" v-for="(column) in columns">
                  {{ column.render && column.render(item) || ''}}
                  <slot :name="column.slotName" v-bind="item" v-if="!!column.slotName"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="w-full bg-gray-100 border-t pagination flex items-center justify-center" v-show="!user.loading && !records.loading && !!data.length">
      <Pagination />
    </div>
  </div>
</template>

<style scoped>
.balance {
  min-height: 45px;
}

.pagination {
  padding: 4svh;
  padding-top: 3svh;
}

.table-container {
  max-height: 72.5svh;
  height: 100svh;
}

.table tbody tr:last-child {
  border-bottom: none;
}
</style>