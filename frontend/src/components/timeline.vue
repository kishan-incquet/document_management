<template>
    <div>
        <v-timeline>
            <v-timeline-item color="#3c82f6" small fill-dot>
                <template v-slot:opposite>
                    <div>
                        <span class="font-weight-bold d-block">Document Created</span>

                        <span>{{ doc.created }}</span> <br>
                        <span class="day-indicator">{{ calculateDateDiff(doc.review, doc.created) }}
                            days</span>
                    </div>
                </template>
                <span>Initial draft created</span>
            </v-timeline-item>

            <v-timeline-item color="#ebb305" small fill-dot>
                <template v-slot:opposite>
                    <v-btn v-on:click="changeDate(newReviewDate, 'review')">Save</v-btn>
                </template>

                <div class="text-right">
                    <span class="font-weight-bold">Review Phase</span>
                    <div class="text-right ml-auto text-field-container">
                        <v-text-field name="created" v-bind:value="newReviewDate" v-model="newReviewDate" type="date"
                            outlined dense></v-text-field>
                        <span class="day-indicator">{{ calculateDateDiff(doc.deadline, doc.review) }} days</span>
                    </div>
                </div>
            </v-timeline-item>

            <v-timeline-item color="#22c55d" small fill-dot>
                <template v-slot:opposite>
                    <div class="d-flex flex-column">
                        <span class="font-weight-bold">Approval Deadline</span>
                        <div class="text-right ml-auto text-field-container">
                            <v-text-field v-bind:value="newDeadline" v-model="newDeadline" type="date" outlined
                                dense></v-text-field>
                            <span class="day-indicator">{{ calculateDateDiff(doc.publication, doc.deadline) }}
                                days</span>
                        </div>
                    </div>
                </template>
                <v-btn class="mt-5" v-on:click="changeDate(newDeadline, 'deadline')">Save</v-btn>
            </v-timeline-item>

            <v-timeline-item color="#3c82f6" small fill-dot class="timeline-item">
                <template v-slot:opposite>
                    <v-btn v-on:click="changeDate(newPublication, 'publication')">Save</v-btn>
                </template>

                <div class="text-right">
                    <span class="font-weight-bold">Publication Date</span>
                    <div class="text-right ml-auto text-field-container">
                        <v-text-field v-bind:value="newPublication" v-model="newPublication" type="date" outlined
                            dense></v-text-field>
                        <span class="day-indicator">{{ calculateDateDiff(doc.expiry, doc.publication) }} days</span>
                    </div>
                </div>
            </v-timeline-item>

            <v-timeline-item color="#ef4444" small fill-dot>
                <template v-slot:opposite>
                    <div>
                        <span class="font-weight-bold">Expiration</span>
                        <div class="text-right ml-auto text-field-container">
                            <v-text-field v-bind:value="newExpiry" v-model="newExpiry" type="date" outlined
                                dense></v-text-field>
                        </div>
                    </div>
                </template>
                <v-btn class="mt-5" v-on:click="changeDate(newExpiry, 'expiry')">Save</v-btn>
            </v-timeline-item>
        </v-timeline>

        <v-card class="px-5 pt-2 mr-5">
            <v-form>
                <h3 class="my-5">Timeline Settings</h3>
                <v-row>
                    <v-col>
                        Review Duration (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="reviewDuration"
                            name="review-duration"></v-text-field>
                    </v-col>
                    <v-col>
                        Approval Duration (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="approvalDuration"
                            name="review-duration"></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        Publication Lead Time (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="publicationDuration"
                            name="review-duration"></v-text-field>
                    </v-col>
                    <v-col>
                        Document Validity (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="expiryDuration"
                            name="review-duration"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn v-on:click="calculateDuration">Recalculate Timeline</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "MyTimeline",
    props: {
        doc: {
            type: Object
        }
    },

    data() {
        return {
            newReviewDate: "",
            newDeadline: "",
            newPublication: "",
            newExpiry: "",
            expiryDuration: "",
            publicationDuration: "",
            approvalDuration: "",
            reviewDuration: ""
        }
    },


    methods: {
        calculateDateDiff(date1, date2) {
            let diffTime = new Date(date1) - new Date(date2);
            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
        },

        async changeDate(date, type) {
            const result = await fetch("http://localhost:8001/change-date", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "type": type,
                    "newDate": date
                }),
            });

            if (result.status == 200) {
                this.$emit("load");
            }
        },

        async calculateDuration() {
            const result = await fetch("http://localhost:8001/change-duration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "review": this.reviewDuration,
                    "approval": this.approvalDuration,
                    "expiry": this.expiryDuration,
                    "publication": this.publicationDuration
                }),
            });

            if (result.status == 200) {
                this.$emit("load");
            }
        }
    },
    watch: {
        doc(newVal) {
            if (newVal) {
                this.newExpiry = this.doc.expiry;
                this.newDeadline = this.doc.deadline;
                this.newPublication = this.doc.publication;
                this.newReviewDate = this.doc.review;

                this.reviewDuration = this.calculateDateDiff(this.doc.review, this.doc.created);
                this.approvalDuration = this.calculateDateDiff(this.doc.deadline, this.doc.review);
                this.expiryDuration = this.calculateDateDiff(this.doc.expiry, this.doc.publication);
                this.publicationDuration = this.calculateDateDiff(this.doc.publication, this.doc.deadline);
            }
        }
    },
}
</script>

<style>
.text-field-container {
    width: 150px;
}

.timeline-item {
    position: relative;
}

.day-indicator {
    position: absolute;
    left: 470px;
    width: max-content;
    word-wrap: none;
}
</style>