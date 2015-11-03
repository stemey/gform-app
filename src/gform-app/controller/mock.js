if (parent) {
    parent.appController.subscribe("/attribute/focus", function (event) {
        var el = document.querySelector(".c4a_path_" + event.path.replace(/\./g, "_"));
        if (el) {
            el.scrollIntoView()
        }
    });
}

preview= function(id) {
    parent.appController.followPreviewLink(id);
}
previewByPath= function(path) {
    parent.appController.followPreviewLinkByPath(path);
}
