function verifyAdmin(klaytnAddress) {
    return klaytnAddress.toLowerCase() === process.env.ADMIN_ADDRESS.toLowerCase();
}

module.exports = {
    verifyAdmin
}