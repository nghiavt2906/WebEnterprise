const CloudConvert = require('cloudconvert')
const fs = require('fs')
const https = require('https')
const path = require('path')

const getThumbnail = async (filename) => {
    if (!fs.existsSync(__dirname + '\\..\\media\\thumbnails')) {
        fs.mkdirSync(__dirname + '\\..\\media\\thumbnails');
    }

    const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_API_KEY);

    let job = await cloudConvert.jobs.create({
        "tasks": {
            "import-docx": {
                "operation": "import/upload"
            },
            "docx-to-jpg": {
                "operation": "convert",
                "input_format": "docx",
                "output_format": "jpg",
                "engine": "office",
                "input": [
                    "import-docx"
                ],
                "pages": "1-1",
                "pixel_density": 300
            },
            "export-jpg": {
                "operation": "export/url",
                "input": [
                    "docx-to-jpg"
                ],
                "inline": false,
                "archive_multiple_files": false
            }
        }
    });

    const uploadTask = job.tasks.filter(task => task.name === 'import-docx')[0];

    const inputFile = fs.createReadStream(path.join(__dirname, '../media/docs', filename));

    await cloudConvert.tasks.upload(uploadTask, inputFile, filename);

    job = await cloudConvert.jobs.wait(job.id);

    const exportTask = job.tasks.filter(
        task => task.operation === 'export/url' && task.status === 'finished'
    )[0];
    const file = exportTask.result.files[0];

    const writeStream = fs.createWriteStream(path.join(__dirname, '../media/thumbnails', file.filename))

    https.get(file.url, function (response) {
        response.pipe(writeStream);
    });

    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

module.exports = {
    getThumbnail
}