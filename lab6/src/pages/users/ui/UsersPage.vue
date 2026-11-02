<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useUsersStore } from '@/entities/user'
import { WinnersBoard } from '@/features/lottery'
import { CreateUserCard } from '@/features/user-form'
import { UsersTable } from '@/widgets/users-table'
import { PAGE_SIZE, useUsersQuery } from '../model/useUsersQuery'

const usersStore = useUsersStore()
const { users } = storeToRefs(usersStore)
const { page, search, sortBy, order, setPage, setSearch, setSort } = useUsersQuery()

function load(): void {
  usersStore.fetchUsers({
    page: page.value,
    limit: PAGE_SIZE,
    search: search.value,
    sortBy: sortBy.value,
    order: order.value,
  })
}

// будь-яка зміна query-параметрів (сторінка, пошук, сортування) перезавантажує список
watch([page, search, sortBy, order], load, { immediate: true })
</script>

<template>
  <WinnersBoard :pool="users" />
  <CreateUserCard />
  <UsersTable
    :page="page"
    :page-size="PAGE_SIZE"
    :search="search"
    :sort-by="sortBy"
    :order="order"
    @update:page="setPage"
    @update:search="setSearch"
    @sort="setSort"
    @retry="load"
  />
</template>
