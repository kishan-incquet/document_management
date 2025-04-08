<template>
    <div>
        <v-timeline style="background-color: #f9fafb;">
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
                    <v-btn v-on:click="changeDate(review, 'review')" depressed color="#eff6ff"
                        class="blue--text text-capitalize">Save</v-btn>
                    <v-btn v-on:click="resetReviewDate" v-if="reviewDateChange" depressed color="gray"
                        class="red--text ml-2 text-capitalize">Reset</v-btn>
                </template>

                <div class="text-right">
                    <span class="font-weight-bold">Review Phase</span>
                    <div class="text-right ml-auto text-field-container">
                        <v-text-field name="created" v-bind:value="doc.review" v-bind:min="doc.created" v-model="review"
                            type="date" v-on:input="reviewDateChange = true" outlined dense></v-text-field>
                        <span class="day-indicator">{{ calculateDateDiff(doc.deadline, doc.review) }} days</span>
                    </div>
                </div>
            </v-timeline-item>

            <v-timeline-item color="#22c55d" small fill-dot>
                <template v-slot:opposite>
                    <div class="d-flex flex-column">
                        <span class="font-weight-bold">Approval Deadline</span>
                        <div class="text-right ml-auto text-field-container">
                            <v-text-field v-bind:value="doc.deadline" v-bind:min="review" v-model="deadline" type="date"
                                outlined dense v-on:input="deadlineDateChange = true"></v-text-field>
                            <span class="day-indicator">{{ calculateDateDiff(doc.publication, doc.deadline) }}
                                days</span>
                        </div>
                    </div>
                </template>

                <v-btn v-on:click="changeDate(deadline, 'deadline')" depressed color="#eff6ff"
                    class="blue--text text-capitalize mt-5">Save</v-btn>
                <v-btn v-on:click="resetDeadlineDate" v-if="deadlineDateChange" depressed color="gray"
                    class="red--text text-capitalize ml-2 mt-5">Reset</v-btn>
            </v-timeline-item>

            <v-timeline-item color="#3c82f6" small fill-dot class="timeline-item">
                <template v-slot:opposite>
                    <v-btn v-on:click="changeDate(publication, 'publication')" depressed color="#eff6ff"
                        class="blue--text text-capitalize">Save</v-btn>
                    <v-btn v-on:click="resetPublicationDate" v-if="publicationDateChange" depressed color="gray"
                        class="red--text ml-2 text-capitalize">Reset</v-btn>
                </template>

                <div class="text-right">
                    <span class="font-weight-bold">Publication Date</span>
                    <div class="text-right ml-auto text-field-container">
                        <v-text-field v-bind:value="publication" v-bind:min="deadline" v-model="publication" type="date"
                            outlined dense v-on:input="publicationDateChange = true"></v-text-field>
                        <span class="day-indicator">{{ calculateDateDiff(doc.expiry, doc.publication) }} days</span>
                    </div>
                </div>
            </v-timeline-item>

            <v-timeline-item color="#ef4444" small fill-dot>
                <template v-slot:opposite>
                    <div>
                        <span class="font-weight-bold">Expiration</span>
                        <div class="text-right ml-auto text-field-container">
                            <v-text-field v-bind:value="expiry" v-bind:min="publication" v-model="expiry" type="date"
                                outlined dense v-on:input="expiryDateChange = true"></v-text-field>
                        </div>
                    </div>
                </template>

                <v-btn v-on:click="changeDate(expiry, 'expiry')" depressed color="#eff6ff"
                    class="blue--text text-capitalize mt-5">Save</v-btn>
                <v-btn v-on:click="resetExpiryDate" v-if="expiryDateChange" depressed color="gray"
                    class="red--text text-capitalize ml-2 mt-5">Reset</v-btn>
            </v-timeline-item>
        </v-timeline>

        <v-card class="px-5 pt-2 mr-5 mt-5">
            <v-form>
                <h3 class="my-5">Timeline Settings</h3>
                <v-row>
                    <v-col>
                        Review Duration (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="reviewDuration"></v-text-field>
                    </v-col>
                    <v-col>
                        Approval Duration (Business Days)
                        <v-text-field type="number" outlined hide-details dense
                            v-model="approvalDuration"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>

                    <v-col>
                        Publication Lead Time (Business Days)
                        <v-text-field type="number" outlined hide-details dense
                            v-model="publicationDuration"></v-text-field>
                    </v-col>
                    <v-col>
                        Document Validity (Business Days)
                        <v-text-field type="number" outlined hide-details dense v-model="expiryDuration"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn block v-on:click="calculateDuration" depressed class="white--text" small
                            color="#2463eb">Recalculate
                            Timeline</v-btn>
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
            review: "",
            deadline: "",
            publication: "",
            expiry: "",
            reviewDateChange: false,
            deadlineDateChange: false,
            publicationDateChange: false,
            expiryDateChange: false,
            expiryDuration: "",
            publicationDuration: "",
            approvalDuration: "",
            reviewDuration: ""
        }
    },


    methods: {
        calculateDateDiff(date1, date2) {
            let diffDays = 0;
            date1 = new Date(date1);
            date2 = new Date(date2);

            while (date2 < date1) {
                if (date2.getDay() != 6 && date2.getDay() != 0) {
                    diffDays++;
                }

                date2.setDate(date2.getDate() + 1);
            }

            return diffDays;
        },

        async changeDate(date, type) {
            this.deadlineDateChange = false;
            this.expiryDateChange = false;
            this.reviewDateChange = false;
            this.publicationDateChange = false;

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
        },

        resetDeadlineDate() { this.deadline = this.doc.deadline; this.deadlineDateChange = false; },
        resetExpiryDate() { this.expiry = this.doc.expiry; this.expiryDateChange = false; },
        resetReviewDate() { this.review = this.doc.review; this.reviewDateChange = false; },
        resetPublicationDate() { this.publication = this.doc.publication; this.publicationDateChange = false; }
    },

    watch: {
        doc(newVal) {
            if (newVal) {
                this.expiry = this.doc.expiry;
                this.deadline = this.doc.deadline;
                this.publication = this.doc.publication;
                this.review = this.doc.review;

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