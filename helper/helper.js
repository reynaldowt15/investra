class Helper {
    static formatRupiah(value) {
        return Intl.NumberFormat(`id-ID`, { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(value)
    }
}

module.exports = Helper