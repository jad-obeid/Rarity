function RemoveNFT(Id) {
    console.log(Id);
    fetch("http://localhost:5050/deleteNFT", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `ID=${Id}`,
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            console.log(data);
            if (data == "success") {
                //Remove the row of the table via DOM manipulation
                const row = document.getElementById(Id);
                row.remove();
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}
function Edit(ID) {
    let formdiv = document.getElementById(ID);
    
    if (formdiv.style.display == 'none') {
        formdiv.style.display = 'flex';
    }
    else {
        formdiv.style.display = 'none';
    }
}