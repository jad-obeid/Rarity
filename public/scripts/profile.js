function RemoveNFT(Id) {
    console.log(Id);
    fetch("/deleteNFT", {
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
    let IdOnly = ID.substring(0, ID.length - 1);
    
    fetch(`/getUserNFT/:${IdOnly}`, {
        method: 'GET',
        headers: {
            'Content-type': 'Application/json',
            Accept: 'Application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log("response from server ==>", res);
        $(`#editNameInput${IdOnly}`).val(res.nftName);
        $(`#editPriceInput${IdOnly}`).val(res.nftPrice);
        $(`#editDescInput${IdOnly}`).val(res.nftDesc);
    })
    .catch(e => {
        console.log("Failed to fetch NFTs", e);
    })
    
    if (formdiv.style.display == 'none') {
        formdiv.style.display = 'flex';
    }
    else {
        formdiv.style.display = 'none';
    }


}
function List(Id) {
    console.log(Id);
    fetch("/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `ID=${Id}`,
    }).then(function (response) {
        return response.text();
    })
    .then(function (data) {
        console.log(data);
        if (data == "success") {
            let listbutton = "'"+Id+"'button"
            console.log()
            console.log()
            const row = document.getElementById(listbutton);
            row.remove();
        }
    })
    .catch(function (err) {
        console.error(err);
    });;
}