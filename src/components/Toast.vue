<template>
    <div class="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        <div v-for="toast in toasts" :key="toast.id" class="p-4 rounded-md shadow-md" :class="type[toast.type]">
            <div class="flex gap-3 items-center justify-between">
                <div>{{ toast.msg }}</div>
                <button @click="toastCtrl.remove(toast.id)">X</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js';

const toastCtrl = useToast()
const toasts = toastCtrl.toasts
const type = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
}
type.danger = type.error
</script>

