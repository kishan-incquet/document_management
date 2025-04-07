<template>
    <v-row col="10">
        <v-col cols="4" class="pt-5 ">
            <v-card height="99vh">
                <div class="d-flex">
                    <h3 class="pl-2">Document Versions</h3>
                    <v-btn class="ml-auto mr-5" v-on:click="compare">Compare</v-btn>
                </div>
                <DocumentCard v-for="version in doc.versions" v-bind:key="version.id" v-bind:id="version.id"
                    v-bind:name="version.name" v-bind:date="version.created" v-bind:status="version.status"
                    v-on:showVersion="showVersionDetails" />

                <v-card v-if="selectedVersion != null" class="version-details mx-5 my-2 mt-auto">
                    <v-card-title>
                        <h5>Version Details</h5>
                        <v-btn class="ml-auto" v-if="!editingVersion" small elevation="0"
                            v-on:click="enableEditing()">Edit
                            Details</v-btn>

                        <div v-else class="ml-auto">
                            <v-btn class="mr-2" small elevation="0" v-on:click="saveData()">Save</v-btn>
                            <v-btn small elevation="0" v-on:click="editingVersion = null">Cancel</v-btn>
                        </div>
                    </v-card-title>

                    <v-card-text v-if="!editingVersion">
                        <div class="d-flex mb-2">
                            <span>Name: </span>
                            <h5 class="ml-auto">{{ versionDetails.name }}</h5>
                        </div>
                        <div class="d-flex mb-2">
                            <span>Created: </span>
                            <h5 class="ml-auto">{{ versionDetails.created }}</h5>
                        </div>
                        <div class="d-flex mb-2">
                            <span>State: </span>
                            <div class="ml-auto">
                                <v-chip v-if="versionDetails.status == 'approved'" small color="#defee9"
                                    text-color="#408649">Approved</v-chip>
                                <v-chip v-else-if="versionDetails.status == 'review'" small color="#fef9c3"
                                    text-color="#bb9c65">In
                                    Review</v-chip>
                                <v-chip v-else small color="#dbe9fe" text-color="#758dd3">Draft</v-chip>
                            </div>
                        </div>
                        <div class="d-flex mb-2">
                            <span>Author: </span>
                            <h5 class="ml-auto">{{ versionDetails.author }}</h5>
                        </div>
                        <div class="d-flex mb-2">
                            <span>Changes: </span>
                            <h5 class="ml-auto">{{ versionDetails.changes }}</h5>
                        </div>
                    </v-card-text>

                    <v-card-text v-else>
                        <div class="d-flex mb-2">
                            <span>Name: </span>
                            <h5 class="ml-auto">{{ editingVersion.name }}</h5>
                        </div>
                        <div class="d-flex">
                            <span>Created: </span>
                            <div class="text-right ml-auto text-field-container">
                                <v-text-field name="created" v-model="editingVersion.created"
                                    v-bind:value="editingVersion.created" type="date" outlined dense></v-text-field>
                            </div>
                        </div>
                        <div class="d-flex">
                            <span>State: </span>
                            <div class="text-right ml-auto text-field-container">
                                <v-select v-bind:items="versionStatuses" v-model="newStatus" v-bind:value="newStatus"
                                    dense outlined></v-select>
                            </div>
                        </div>
                        <div class="d-flex">
                            <span>Author: </span>
                            <div class="text-right ml-auto text-field-container">
                                <v-text-field v-model="editingVersion.author" type="text" outlined dense></v-text-field>
                            </div>
                        </div>
                        <div class="d-flex">
                            <span>Changes: </span>
                            <div class="text-right ml-auto text-field-container">
                                <v-text-field v-model="editingVersion.changes" type="text" outlined
                                    dense></v-text-field>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <v-card class="version-comparison mx-5 my-2 mt-auto">
                    <v-card-title>
                        <span class="body-1 font-weight-bold">Version comparison</span>
                    </v-card-title>

                    <v-card-text>
                        <div class="pl-2">
                            <div class="d-flex align-center">
                                <div class="rounded-pill mr-2 dot added-dot">
                                </div>
                                <span class="caption"> Added content</span>
                            </div>
                            <div class="d-flex align-center">
                                <div class="rounded-pill mr-2 dot removed-dot">
                                </div>
                                <span class="caption"> Removed content</span>
                            </div>
                            <div class="d-flex align-center">
                                <div class="rounded-pill mr-2 dot modified-dot">
                                </div>
                                <span class="caption"> Modified content</span>
                            </div>
                        </div>

                        {{ comparedText }}
                    </v-card-text>

                </v-card>
            </v-card>
        </v-col>

        <v-col cols="8">
            <v-card height="99vh" class="pt-2" flat>

                <h3>
                    Document Timeline
                </h3>
                <MyTimeline v-bind:doc="doc" v-on:load="loadDocument" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import DocumentCard from './documentCard.vue';
import Timeline from './timeline.vue';

export default {
    name: "docDashboard",

    components: {
        "DocumentCard": DocumentCard,
        "MyTimeline": Timeline
    },

    data() {
        return {
            doc: {},
            versionDetails: "",
            selectedVersion: null,
            editingVersion: null,
            newStatus: null,
            comparedText: "",
            oldSelectedId: null,
            versionStatuses: [{ text: "Draft", value: "draft" }, { text: "In review", value: "review" }, { text: "Approved", value: "approved" }]
        }
    },

    methods: {
        showVersionDetails(id) {
            this.oldSelectedId = this.selectedVersion;
            this.selectedVersion = id;
            const version = this.doc.versions.filter((version) => version.id == id);

            this.versionDetails = version[0];
        },

        compare() {
            console.log(this.selectedVersion, this.oldSelectedId);

        },
        enableEditing() {
            this.editingVersion = this.versionDetails;
            this.newStatus = this.versionDetails.status;
        },

        async loadDocument() {
            const result = await fetch("http://localhost:8001/");
            const data = await result.json();

            this.doc = { ...data };
        },

        async saveData() {
            this.editingVersion.status = this.newStatus;

            const result = await fetch("http://localhost:8001/change-version", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.editingVersion),
            });

            if (result.status == 200) {
                await this.loadDocument();
            }

            this.editingVersion = null;
        },



    },

    created() {
        this.loadDocument();
    }
}
</script>

<style scoped>
.dot {
    width: 10px !important;
    height: 10px !important;
}

.added-dot {
    background-color: green;
}

.removed-dot {
    background-color: red;
}

.modified-dot {
    background-color: yellow;
}
</style>