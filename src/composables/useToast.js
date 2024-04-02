import { ref } from 'vue'

const toasts = ref([])
const id = ref(0)

export function useToast() {
    const add = (msg, time = 5000, type = 'primary') => {
        const toast = { id: id.value++, msg, time, type }
        toast.timeout = setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== toast.id)           
        }, time)

        toasts.value.push(toast)
    }

    const remove = id => {
        clearTimeout(toasts.value.find(t => t.id === id).timeout)
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        toasts,
        add,
        remove
    }
}
