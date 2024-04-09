<template>
    <div class="px-10 py-24 bg-white text-black">
        <div class="max-w-3xl mx-auto">
            <h2 class="font-bold text-center text-5xl mb-6">
                Cookie Policy
            </h2>

            <div class="flex items-center gap-3 text-gray-500 mb-6">
                <p>
                    Effective date: January 01, 2024
                </p>

                <p>
                    Modified date: January 01, 2024
                </p>
            </div>

            <div class="flex flex-col gap-3">
                <div v-for="n in repeat" :key="n">
                    <p class="text-md font-bold mb-1">
                        {{ randomTitle('Lorem ipsum dolor sit amet, consectetur adipiscing elit.') }}
                    </p>
                    <p class="text-md">
                        {{ text }}
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
const text = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium,
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                        dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                        fugit,
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                        quisquam
                        est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
                        eius
                        modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                        veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                        commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
                        nihil
                        molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;
const randomTitle = (text) => {
    return text.split(' ').sort(() => Math.random() - 0.5).join(' ')
}
const repeat = 10;
</script>