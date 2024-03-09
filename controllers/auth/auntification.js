const Ucer = require('../../model/Role')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signIn = async (req, res) => {
    const { email, password } = req.body
    const user = await Ucer.findOne({ email })
    if (!user) {
        res.json({ title: "ERROR", message: "Login topilmadi" })
    } else {
        let isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            res.json({ title: "ERROR", message: "Parol topilmadi" })
        } else {
            let payload = {
                id: user.id,
                status: user.status,
                name: user.name,
                surname: user.surname,
                email: user.email,
                university: user.university
            }
            let status = user.status
            let name = user.name
            let surname = user.surname
            let email = user.email
            let university = user.university
            const token = await jwt.sign(payload, "Key", { expiresIn: '1h' })
            res.status(200).json({ title: "Success", message: "WELCOME your room", token, status, name, surname, email, university })
        }
    }
}
exports.signUp = async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const { name, surname, email, password, university } = req.body
    const user = await Ucer.findOne({ email })
    if (!user) {
        if (name && surname && email && password && university) {
            try {
                let hash = await bcrypt.hash(password, 10)
                let student = new Ucer({
                    status: 'talaba',
                    name,
                    surname,
                    email,
                    password: hash,
                    university,
                    randomNumber
                })
                student.save()
                    .then(async (data) => {
                        if (data) {
                            let payload = {
                                id: data._id,
                                status: data.status,
                                name: data.name,
                                surname: data.surname
                            }
                            const token = await jwt.sign(payload, "Key", { expiresIn: '168h' })
                            res.json({ title: "Success", data, token })
                        }
                    })
            } catch (e) {
                res.json({ title: "Error", e })
            }
        }
        else {
            res.json({ title: "Barcha ma'lumotlarni kiriting!!!" })
        }
    } else if (user) {
        res.json({ title: "Ushbu login bilan boshqa foydalanuvchi ro`yxatdan o`tgan. Boshqa login tanlang!" })
    }
}