import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { NConfigProvider } from 'naive-ui' // Import NConfigProvider
import type { ComponentPublicInstance } from 'vue'
import DataTable from './DataTable.vue'

// Define the type for the component instance
interface DataTableInstance extends ComponentPublicInstance {
  data: { id: number; title: string; body: string }[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    itemCount: number
    onChange: (page: number) => void
    onUpdatePageSize: (size: number) => void
  }
  sorter: {
    columnKey: string
    order: 'ascend' | 'descend' | null
  }
  fetchData: () => Promise<void>
  handleSorterChange: (sorterData: {
    columnKey: string
    order: 'ascend' | 'descend' | null
  }) => void
}

describe('DataTable', () => {
  let mockAxios: MockAdapter

  beforeEach(() => {
    // Create a mock instance of axios
    mockAxios = new MockAdapter(axios)
  })

  it('renders the component', () => {
    const wrapper = mount(DataTable, {
      global: {
        components: {
          NConfigProvider, // Add NConfigProvider
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('fetches data on mount', async () => {
    // Mock the API response
    const mockData = [
      { id: 1, title: 'Test Title 1', body: 'Test Body 1' },
      { id: 2, title: 'Test Title 2', body: 'Test Body 2' },
    ]
    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockData, {
      'x-total-count': '100',
    })

    const wrapper = mount(DataTable, {
      global: {
        components: {
          NConfigProvider, // Add NConfigProvider
        },
      },
    })
    await wrapper.vm.$nextTick() // Wait for the component to update

    // Cast wrapper.vm to the custom type
    const vm = wrapper.vm as unknown as DataTableInstance
  })

  // Other tests...
})
