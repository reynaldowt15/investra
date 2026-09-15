const {
    User,
    UserProfile,
    Portofolio,
    PortofolioCompany,
    Company
} = require ("../models/index")


class Controller {
    static async home (req,res){
        try {
            
        } catch (error) {
            // console.log(error)
            res.send (error)
        }
    }

}

module.exports = Controller