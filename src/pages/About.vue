<template>
    <div>
        <div class="px-10 py-24 bg-black text-white">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Every item is special selected for you!
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    Our team spent many hours every day to find the best products for you. Are you looking for something we don't have? Let us know!
                </p>

                <div class="flex items-center justify-center px-10">

                    <img src="/images/Chairs2.png" alt="Chairs" class="w-full" />

                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-white text-black">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Our Selection Process
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    We have a strict selection process to ensure that we only offer the best products to our customers.
                </p>

                <div class="flex justify-center gap-16">
                    <p>
                    Every product is carefully tested by our team to ensure that it meets our high standards. We only offer products that we would use ourselves.
                    We only use high-quality materials in our products. This ensures that they are durable and long-lasting.
                    <br/><br/>
                    We work closely with our suppliers to ensure that they meet our ethical standards. We only work with suppliers who treat their employees fairly and pay them a living wage.
                    Our team is constantly looking for new products to add to our selection. 
                    <br/><br/>
                    If you have any suggestions, please let us know!
                </p>

                <img src="/images/pexels-kampus-production-8636613.jpg" alt="Photo by Kampus Production: https://www.pexels.com/da-dk/foto/kontor-arbejde-indendors-team-8636613/" class="h-64 rounded-md" />
                </div>

            </div>
        </div>

        <div class="px-10 py-24 bg-black text-white">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Meet Our Team
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    Find the members of our team below. We are here to help you find the right gear for your needs.
                </p>

                <div class="grid grid-cols-4 gap-6">
                    <div class="border border-gray-300 rounded-md p-3"
                        v-for="member in teamMembers" :key="member.name">
                        <p class="flex items-center justify-center border border-gray-300 rounded-full mx-auto h-24 w-24 mb-3">
                            <UserIcon fill="white" width="2em" />
                        </p>

                        <p class="font-bold text-center text-md">
                            {{ member.name }}
                        </p>

                        <p class="font-bold text-center text-md">
                            {{ member.role }}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup>
import UserIcon from '../components/icons/UserIcon.vue';
const teamMembers = [
    {
        name: 'John Doe',
        role: 'CEO'
    },
    {
        name: 'John Doe',
        role: 'CCO'
    },
    {
        name: 'John Doe',
        role: 'CTO'
    },
    {
        name: 'John Doe',
        role: 'Customer Service'
    },
    {
        name: 'John Doe',
        role: 'Technical Support'
    },
    {
        name: 'John Doe',
        role: 'Sales'
    },
    {
        name: 'John Doe',
        role: 'Marketing'
    },
    {
        name: 'John Doe',
        role: 'Logistics'
    },
    {
        name: 'John Doe',
        role: 'Finance'
    },
    {
        name: 'John Doe',
        role: 'HR'
    }
];
</script>