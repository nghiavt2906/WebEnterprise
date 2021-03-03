WebViewer(
    {
        initialDoc: 'docs/Frontsheet 2.docx',
    },
    document.getElementById('viewer')
).then(instance => {
    console.log(instance)
});
