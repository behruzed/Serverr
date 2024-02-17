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
                person: user.firstName + " " + user.lastName
            }
            let status = user.status
            let person = user.firstName + " " + user.lastName
            const token = await jwt.sign(payload, "Key", { expiresIn: '1h' })
            res.status(200).json({ title: "Success", message: "WELCOME your room", token, status, person })
        }
    }
}
exports.signUp = async (req, res) => {
    const { name, surname, email, password } = req.body
    const user = await Ucer.findOne({ email })
    if (!user) {
        if (name && surname && email && password) {
            try {
                let hash = await bcrypt.hash(password, 10)
                let student = new Ucer({
                    name,
                    surname,
                    email,
                    password: hash,
                    status: 'talaba'
                })
                student.save()
                    .then(data => {
                        if (data) {
                            console.log(data);
                            res.json({ title: "Success", data: data })
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
        res.json({ title: "Allaqachon ro'yhatdan o'tgansiz!" })
    }
}