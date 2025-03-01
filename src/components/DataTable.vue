<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable } from 'naive-ui'
import type { TableColumns } from 'naive-ui/es/data-table/src/interface'

type DataTableProps<T> = {
  columns: TableColumns<T>
  data: T[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    itemCount: number
    showSizePicker?: boolean
    pageSizes?: number[]
  }
}

const props = defineProps<DataTableProps<any>>()

const emit = defineEmits<{
  (event: 'update:page', page: number): void
  (event: 'update:pageSize', pageSize: number): void
  (event: 'update:sorter', sorter: { columnKey: string; order: 'ascend' | 'descend' | null }): void
}>()

const computedPagination = computed(() => ({
  ...props.pagination,
  onChange: (page: number) => emit('update:page', page),
  onUpdatePageSize: (size: number) => emit('update:pageSize', size),
}))

const handleSorterChange = (sorter: { columnKey: string; order: 'ascend' | 'descend' | null }) => {
  emit('update:sorter', sorter)
}
</script>

<template>
  <n-data-table
    remote
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="computedPagination"
    :row-key="(row) => (row as any).id"
    @update:sorter="handleSorterChange"
  />
</template>
