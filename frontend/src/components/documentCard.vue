<template>
    <v-card elevation="1" class="mx-5 my-2" v-bind:class="(original == version.id) ? 'card-border' : ''"
        v-on:click.prevent="showVersion" v-bind:color="(original == version.id) ? cardColor : 'white'" outlined>
        <v-card-title>
            <h6 class=" d-flex flex-column mr-auto">
                {{ version.name }}
                <span class="caption"> {{ version.created }}</span>
            </h6>

            <v-chip v-if="version.status == 'approved'" small color="#defee9" text-color="#408649">Approved</v-chip>
            <v-chip v-else-if="version.status == 'review'" small color="#fef9c3" text-color="#bb9c65">In
                Review</v-chip>
            <v-chip v-else small color="#dbe9fe" text-color="#758dd3">Draft</v-chip>
        </v-card-title>

        <v-card-text class="d-flex align-end pt-0 pb-2" v-if="compare && original != version.id">
            <v-btn class="ml-auto text-capitalize " depressed
                v-bind:color="compareWith == version.id ? 'blue' : '#e5e7eb'"
                v-bind:class="compareWith == version.id ? 'white--text' : ''" dense small
                v-on:click.stop="compareVersion">Select for
                Compare</v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "DocumentCard",

    props: {
        version: {
            type: Object
        },
        original: {
            type: String
        },
        compare: {
            type: Boolean
        },
        compareWith: {
            type: String
        }
    },

    data() {
        return {
            cardColor: "#eff6ff"
        }
    },

    methods: {
        showVersion() {
            this.$emit("showVersion", this.version.id)
        },

        compareVersion() {
            this.$emit("compare", this.version.id);
        }
    }
}</script>

<style scoped>
.card-border {
    border: 1px solid #8aacf9 !important;
}
</style>