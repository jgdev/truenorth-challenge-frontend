<script lang="ts" setup>
import { Button, Spinner } from 'flowbite-vue';
import { formatAmount } from '../utils/format';
import { FetchAction, FetchResources, Record, User } from '../types';

type Props = {
  onPerformOperation: () => void;
  user: FetchAction<User>;
  authLogout: FetchAction<void>
  authSession: FetchAction<string>
  records: FetchResources<Record>
}

const props = defineProps<Props>()

const handleLogout = (e: Event) => {
  e.preventDefault();
  props.authLogout.postAction().finally(() => {
    props.authSession.result = ''
  })
}
</script>

<template>
  <div class="sm:top-auto sm:relative sm:border-b p-4 pr-4 sm:p-6 bg-gray-100 w-full border main-header">
    <div class="sm:max-w-2xl sm:m-auto">
      <div class="w-full flex justify-between items-center border-b mb-4 pb-4 text-gray-600">
        <h1 class="text-sm">Arithmetic App</h1>
        <a href="#" @click="handleLogout" class="text-sm font-bold">Logout</a>
      </div>
      <div class="w-full flex justify-between items-center gap-2">
        <Button size="sm" color="light" class="shadow" :disabled="records.loading || user.loading"
          @click="() => onPerformOperation()">Perform
          operation</Button>
        <div class="flex flex-col balance items-center justify-center">
          <span class="text-xs font-bold" v-if="!user.loading">User balance</span>
          <div class="text-right w-full text-xs">
            <Spinner size="4" color="blue" v-if="!!user.loading" id="loading-user-balance" />
            <span v-if="!user.loading" id="user-balance">{{ formatAmount(user.result?.balance) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-header {
  max-height: 8rem;
}
</style>