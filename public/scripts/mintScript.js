$('#uploaded-file').change((e) => {
    let fileName = e.target.files[0].name;
    $("#upload-file-mint").html(fileName);
    $("#upload-file-mint").css("font-size", "16px");
});