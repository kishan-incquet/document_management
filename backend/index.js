import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const document = {
    id: "doc-1",
    created: "2025-03-03",
    review: "2025-03-04",
    deadline: "2025-03-05",
    publication: "2025-03-06",
    expiry: "2025-03-07",
    versions: [
        {
            id: "ver-1",
            name: "Version 1",
            created: "2025-03-01",
            status: "approved",
            author: "kishan",
            changes: "Updated this to that"
        },
        {
            id: "ver-2",
            name: "Version 2",
            created: "2025-03-05",
            status: "review",
            author: "kishan",
            changes: "Updated this to that"
        },
        {
            id: "ver-3",
            name: "Version 3",
            created: "2025-03-20",
            status: "Draft",
            author: "kishan",
            changes: "Updated this to that"
        }
    ]
}

app.get("/", (req, res) => {
    res.status(200).json(document);
});

app.post("/change-version", (req, res) => {
    const editedVersion = req.body;

    const newVersions = document.versions.map((version) => {
        if (version.id == editedVersion.id) {
            version.created = editedVersion.created;
            version.status = editedVersion.status;
            version.author = editedVersion.author;
            version.changes = editedVersion.changes;
        }
        return version;
    });
    document.versions = newVersions;

    res.status(200).send("success");
});


function calculateDateDiff(date1, date2) {
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
}

function calculateDate(date, diff) {
    date = new Date(date);
    while (diff > 0) {
        if (date.getDay() != 6 && date.getDay() != 0) {
            diff--;
        }

        date.setDate(date.getDate() + 1);
    }

    return date;
}

app.post("/change-date", (req, res) => {
    let { type, newDate } = req.body;
    newDate = new Date(newDate);

    let date;
    switch (type) {
        case "review":
            if (new Date(document.review).toString() == newDate.toString()) break;
            var diff = calculateDateDiff(document.deadline, document.review);
            document.review = newDate.toLocaleDateString('en-CA');
            newDate = calculateDate(document.review, diff);

        case "deadline":
            if (new Date(document.deadline).toString() == newDate.toString()) break;

            var diff = calculateDateDiff(document.publication, document.deadline);

            document.deadline = newDate.toLocaleDateString('en-CA');
            newDate = calculateDate(document.deadline, diff);

        case "publication":
            if (new Date(document.publication).toString() == newDate.toString()) break;

            var diff = calculateDateDiff(document.expiry, document.publication);
            document.publication = newDate.toLocaleDateString('en-CA');
            newDate = calculateDate(document.publication, diff);

        case "expiry":
            if (new Date(document.expiry).toString() == newDate.toString()) break;

            document.expiry = newDate.toLocaleDateString('en-CA');
            let newVersion = {
                id: `ver-${(document.versions.length + 1)}`,
                name: `Version  ${(document.versions.length + 1)}`,
                created: new Date().toLocaleDateString("en-CA"),
                status: "Draft",
                author: "kishan",
                changes: `Updated ${type} date to ${newDate.toLocaleDateString("en-CA")}`
            }

            document.versions.push(newVersion);
    }

    res.status(200).send("success");
});

app.post("/change-duration", (req, res) => {
    let { review, approval, expiry, publication } = req.body;

    let date = calculateDate(document.created, Number(review));
    document.review = date.toLocaleDateString('en-CA');

    date = calculateDate(document.review, Number(approval));
    document.deadline = date.toLocaleDateString('en-CA');

    date = calculateDate(document.deadline, Number(publication));
    document.publication = date.toLocaleDateString('en-CA');

    date = calculateDate(document.publication, Number(expiry));
    document.expiry = date.toLocaleDateString('en-CA');

    res.status(200).send("success")
});

app.listen(8001, () => {
    console.log(`Listening`);
})