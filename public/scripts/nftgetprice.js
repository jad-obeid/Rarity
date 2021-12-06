
async function fetchNftPrice(price) {
    let response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ADAUSDT");
    let data = await response.json();
    nftprice = data.price * price;
    return nftprice;
  }
  