<template>
    <v-card elevation="1" class="mx-5 my-2" v-on:click="showVersion">
        <v-card-title>
            <h6 class="d-flex flex-column mr-auto">
                {{ name }}
                <span class="caption"> {{ date }}</span>
            </h6>

            <v-chip v-if="status == 'approved'" small color="#defee9" text-color="#408649">Approved</v-chip>
            <v-chip v-else-if="status == 'review'" small color="#fef9c3" text-color="#bb9c65">In Review</v-chip>
            <v-chip v-else small color="#dbe9fe" text-color="#758dd3">Draft</v-chip>
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    name: "DocumentCard",

    props: {
        id: {
            type: String
        },
        name: {
            type: String,
        },
        date: {
            type: String
        },
        status: {
            type: String
        }
    },

    methods: {
        showVersion() {
            this.$emit("showVersion", this.id)
        }
    }
}</script>