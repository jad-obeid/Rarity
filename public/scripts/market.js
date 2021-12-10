function buynft(Id) {
   
    fetch("/buynft", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `id=${Id}`,
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