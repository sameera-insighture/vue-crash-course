<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'

import axios from 'axios'
import type { TableColumns } from 'naive-ui/es/data-table/src/interface'

// Define the type of the data
interface Post {
  id: number
  title: string
  body: string
}

const data = ref<Post[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
})

const sorter = ref<{ columnKey: string; order: 'ascend' | 'descend' | null }>({
  columnKey: '',
  order: null,
})

const fetchData = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      _page: pagination.value.page,
      _limit: pagination.value.pageSize,
    }
    if (sorter.value.order) {
      params._sort = sorter.value.columnKey
      params._order = sorter.value.order === 'ascend' ? 'asc' : 'desc'
    }

    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', { params })
    data.value = response.data
    pagination.value.itemCount = Number(response.headers['x-total-count']) || 100
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const handlePageChange = (page: number) => {
  pagination.value.page = page
  fetchData()
}

const handlePageSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  fetchData()
}

const handleSorterChange = (sorterData: {
  columnKey: string
  order: 'ascend' | 'descend' | null
}) => {
  sorter.value = sorterData
  fetchData()
}

const columns: TableColumns<Post> = [
  { title: 'ID', key: 'id', width: 100, sorter: true },
  { title: 'Title', key: 'title', width: 200, sorter: true },
  { title: 'Body', key: 'body', minWidth: 300 },
]
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
    @update:pageSize="handlePageSizeChange"
    @update:sorter="handleSorterChange"
  />
</template>
