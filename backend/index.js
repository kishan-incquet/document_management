import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const document = {
    id: "doc-1",
    created: "2025-03-01",
    review: "2025-03-10",
    deadline: "2025-03-20",
    publication: "2025-03-30",
    expiry: "2035-04-10",
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
            created: "2025-03-15",
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
    let diffTime = new Date(date1) - new Date(date2);
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

app.post("/change-date", (req, res) => {
    let { type, newDate } = req.body;
    newDate = new Date(newDate);
    let date;

    switch (type) {
        case "review":
            var diff = calculateDateDiff(document.deadline, document.review);
            document.review = newDate.toLocaleDateString('en-CA');
            date = new Date(document.review);
            date.setDate(date.getDate() + diff);
            newDate = date;

        case "deadline":
            var diff = calculateDateDiff(document.publication, document.deadline);

            document.deadline = newDate.toLocaleDateString('en-CA');
            date = new Date(document.deadline);
            date.setDate(date.getDate() + diff);
            newDate = date;

        case "publication":
            var diff = calculateDateDiff(document.expiry, document.publication);
            document.publication = newDate.toLocaleDateString('en-CA');
            date = new Date(document.publication);
            date.setDate(date.getDate() + diff);
            newDate = date;

        case "expiry":
            document.expiry = newDate.toLocaleDateString('en-CA');
    }

    res.status(200).send("success");
});

app.post("/change-duration", (req, res) => {
    let { review, approval, expiry, publication } = req.body;

    let date = new Date(document.created);
    date.setDate(date.getDate() + Number(review));
    document.review = date.toLocaleDateString('en-CA');


    date = new Date(document.review);
    date.setDate(date.getDate() + Number(approval));
    document.deadline = date.toLocaleDateString('en-CA');

    date = new Date(document.deadline);
    date.setDate(date.getDate() + Number(publication));
    document.publication = date.toLocaleDateString('en-CA');

    date = new Date(document.publication);
    date.setDate(date.getDate() + Number(expiry));
    document.expiry = date.toLocaleDateString('en-CA');

    res.status(200).send("success")
});

app.listen(8001, () => {
    console.log(`Listening`);
})