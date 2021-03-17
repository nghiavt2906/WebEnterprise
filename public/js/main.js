document.querySelector(".fixed-button").style.visibility = "hidden";

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

let recommendContributions = document.getElementById('recommendContributions');
if (window.innerWidth <= 770) recommendContributions.classList.add('order-12');
window.addEventListener("resize", function (event) {
    if (window.innerWidth <= 770) recommendContributions.classList.add('order-12');
    else recommendContributions.classList.remove('order-12');
});
