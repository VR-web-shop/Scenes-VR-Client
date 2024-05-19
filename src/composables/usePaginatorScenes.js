import { ref } from 'vue'

export const usePaginator = (findAllMethod, limitInitial=10, include=null) => {
    const entities = ref([])
    const limit = ref(limitInitial)
    const page = ref(1)
    const pages = ref(1)

    const refresh = async () => {
        const res = await findAllMethod(page.value, limit.value);

        entities.value = res.rows;
        pages.value = res.pages;
    };

    const nextPage = async () => {
        if (page.value < pages.value) {
            page.value++;
            await refresh();
        }
    };

    const previousPage = async () => {
        if (page.value > 1) {
            page.value--;
            await refresh();
        }
    };

    return {
        entities,
        page,
        limit,
        pages,
        refresh,
        nextPage,
        previousPage
    };
}
