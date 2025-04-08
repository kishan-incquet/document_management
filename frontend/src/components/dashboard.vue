<template>
    <v-row col="10">
        <v-col cols="4" class="overflow-auto" height="100vh">
            <v-card min-height="100vh" class="pt-2">
                <div class="d-flex">
                    <h3 class="pl-2">Document Versions</h3>
                    <v-btn class="ml-auto mr-5 text-capitalize" depressed v-if="!comparison"
                        v-on:click="comparison = true" v-bind:disabled="!selectedVersion" color="#e5e7eb"
                        style="color: #444e5d !important;">Compare</v-btn>
                    <v-btn class="ml-auto mr-5 text-capitalize white--text" color="#2463eb" depressed v-else
                        v-on:click="comparison = false">Cancel
                        Compare</v-btn>

                </div>
                <DocumentCard v-for="version in doc.versions" v-bind:key="version.id" v-bind:version="version"
                    v-bind:original="selectedVersion" v-on:showVersion="showVersionDetails" v-on:compare="compare"
                    v-bind:compare="comparison" v-bind:compareWith="compareWith" />

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
                                    text-color="#bb9c65">In Review</v-chip>
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
                                <v-select v-bind:items="versionStatuses" v-model="newStatus" dense outlined></v-select>
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

                <v-card v-if="comparedHTML != ''" class="version-comparison mx-5 my-2 mt-auto">
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
                        <div v-html="comparedHTML"
                            style="background-color: #f9fafb !important; border: 1px solid #f9fafb !important;"
                            class="mt-0 px-2 py-2"></div>
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
            newStatus: "",
            comparedHTML: "",
            comparison: false,
            compareWith: '',
            versionStatuses: [{ text: "Draft", value: "Draft" }, { text: "In review", value: "review" }, { text: "Approved", value: "approved" }]
        }
    },

    methods: {
        showVersionDetails(id) {
            this.comparison = false;
            this.compareWith = '';
            this.editingVersion = null;
            this.selectedVersion = id;
            const version = this.doc.versions.filter((version) => version.id == id);

            this.versionDetails = version[0];
        },

        compare(id) {
            this.compareWith = id;
            const originalVersion = this.doc.versions.filter((version) => version.id == id)[0];
            const compareVersion = this.doc.versions.filter((version) => version.id == this.selectedVersion)[0];

            this.comparedHTML = `<span class="body-1">Comparing ${originalVersion.name} with ${compareVersion.name}</span><br />`;

            if (originalVersion.created.toString() != compareVersion.created.toString()) {
                this.comparedHTML += `<span class="yellow--text"> - Changed created date from ${originalVersion.created} to ${compareVersion.created} </span><br/>`;
            }

            if (originalVersion.status != compareVersion.created) {
                this.comparedHTML += `<span class="yellow--text"> - Changed status from ${originalVersion.status} to ${compareVersion.status} </span><br/>`;
            }

            if (originalVersion.author == "" && compareVersion.author != "") {
                this.comparedHTML += `<span class="red--text">- Removed Author ${compareVersion.author} </span><br/>`;
            } else if (originalVersion.author != "" && compareVersion.author == "") {
                this.comparedHTML += `<span class="green--text">- Added Author ${originalVersion.author} </span><br/>`;
            } else if (originalVersion.author != compareVersion.author) {
                this.comparedHTML += `<span class="yellow--text">- Change Author from ${originalVersion.author} to ${compareVersion.author} </span><br/>`;
            }
            if (originalVersion.changes == "" && compareVersion.changes != "") {
                this.comparedHTML += `<span class="red--text">- Removed Description ${compareVersion.author} </span><br/>`;
            } else if (originalVersion.changes != "" && compareVersion.changes == "") {
                this.comparedHTML += `<span class="green--text">- Added Description ${originalVersion.author} </span><br/>`;
            } else if (originalVersion.changes != compareVersion.changes) {
                this.comparedHTML += `<span class="yellow--text">- Changed Description from ${originalVersion.changes} to  ${compareVersion.changes} </span><br />`;
            }
        },

        enableEditing() {
            this.editingVersion = this.versionDetails;
            this.newStatus = this.versionDetails.status;
            console.log(this.newStatus);

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