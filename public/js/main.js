document.querySelector(".fixed-button").style.visibility = "hidden";

try {
    let fileName = document.getElementById("fileName").value;

    WebViewer(
        {
            path: '/',
            initialDoc: `/docs/${fileName}`,
        },
        document.getElementById('viewer')
    ).then(instance => {
        const { annotManager } = instance;
        annotManager.setReadOnly(true);
    });
} catch (err) {
    console.log(err)
}

try {
    let recommendContributions = document.getElementById('recommendContributions');
    if (window.innerWidth <= 770) recommendContributions.classList.add('order-12');
    window.addEventListener("resize", function (event) {
        if (window.innerWidth <= 770) recommendContributions.classList.add('order-12');
        else recommendContributions.classList.remove('order-12');
    });
} catch (err) {
    console.log(err)
}

try {
    document.getElementById('submit-btn').addEventListener('click', () => {
        if (!document.getElementById('flexCheckDefault').checked)
            return alert('You need to check the terms & conditions before submitting.')

        let content = document.querySelector(".ql-editor").innerHTML
        document.getElementById("content").value = content

        document.getElementById('submit').click()
    })
} catch (err) {
    console.log(err)
}

