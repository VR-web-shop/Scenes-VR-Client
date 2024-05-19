<template>
    <div>
        <div v-if="paginator.entities.length === 0" class="text-center text-gray-500">
            <slot name="empty"></slot>
        </div>

        <div v-else>
            <slot :entities="paginator.entities.value"></slot>
        </div>

        <div class="flex justify-start items-center gap-3 mt-3">
            <button type="button" @click="paginator.previousPage" class="bg-blue-500 text-white px-3 py-1 rounded-md">Previous</button>
            <button type="button" @click="paginator.nextPage" class="bg-blue-500 text-white px-3 py-1 rounded-md">Next</button>
            <div class="text-gray-500 border border-gray-100 px-3 py-1 rounded-md">Pages: {{ paginator.page }} / {{ paginator.pages }}</div>
        </div>
    </div>
</template>

<script setup>
import { usePaginator } from '../composables/usePaginatorScenes.js';
import { onBeforeMount, defineExpose } from 'vue'

const props = defineProps({
    findAllMethod: {
        type: Function,
        required: true
    },
    limit: {
        type: Number,
        required: false,
        default: 10
    },
    include: {
        type: Array,
        required: false,
        default: () => []
    }
});

const paginator = usePaginator(
    props.findAllMethod,
    props.limit,
    props.include
);

onBeforeMount(async () => {
    await paginator.refresh();
})

defineExpose({
    paginator
})
</script>
