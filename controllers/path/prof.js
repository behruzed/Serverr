const Ucer = require('../../model/Role')
const jwt = require('jsonwebtoken')
const Turnir = require('../../model/Role2')

exports.profileSt = async (req, res) => {
    jwt.verify(req.headers.authorization, 'Key', async function (err, decoded) {
        if (err) {
            res.json(err)
        } else if (decoded) {
            let data = await Ucer.findById(decoded.id)
            if (data) {
                res.json({ title: "Your profile", data })
            }
        }
    });
}

exports.turners = async (req, res) => {
    let data = await Turnir.find({ status: 'progressing' })
    if (data) {
        res.json({ title: "All turners", data })
    }
}

exports.rand = async (req, res) => {
    let { idUcer } = req.query
    let data = await Ucer.find({ status: "talaba" })
    let arr = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].randomNumber == idUcer) {
            arr.push(data[i])
        }
    }
    if (arr) {
        res.json({ title: "Ucer", arr })
    } else {
        res.json({ title: "Error! User not found..." })
    }
}

exports.sendMess = async (req, res) => {
    let { message, idGroup, idTeacher } = req.body
    let { idAuthor } = req.query
    if (message && idGroup && idTeacher) {
        let data = await Ucer.findByIdAndUpdate(idAuthor, { $push: { message: req.body } })
        if (data) {
            res.json({ title: 'Message send to user', data })
        } else {
            res.json({ title: 'Something error' })
        }
    }
    else {
        res.json({ title: "Message not found!" })
    }

}

exports.crGroup = async (req, res) => {
    let { university, author, name, idGroup, members } = req.body
    let { idAuthor } = req.query
    try {
        if (university && author && name && idGroup && members) {
            let data = await Ucer.findByIdAndUpdate(idAuthor, { $push: { jamoa: req.body } })
            if (data) {
                res.json({ title: 'Group added to author', data })
            } else {
                res.json({ title: 'Something error' })
            }
        }
        else {
            res.json({ title: "Enter all data for turnament!!!" })
        }
    } catch (e) {
        res.json({ title: 'Error', e })
    }
}

exports.crTurnir = async (req, res) => {
    let { gameName, date, author, code } = req.body
    if (gameName && date && author) {
        try {
            let turnir = new Turnir({
                gameName,
                date,
                author,
                code,
                status: 'progressing'
            })
            turnir.save()
                .then(data => {
                    if (data) {
                        res.json({ title: "Turnament created", data: data })
                    }
                })
        } catch (e) {
            res.json({ title: "Error", e })
        }
    }
    else {
        res.json({ title: "Enter all data for turnament!!!" })
    }
}

exports.addStudentToGroup = async (req, res) => {
    let { idTeacher, idGroup, idStudent } = req.body
    if (idTeacher && idGroup && idStudent) {
        let teacher = await Ucer.findById(idTeacher)
        if (!teacher) {
            res.json({ title: "Creator not found" })
        } else {
            let student = await Ucer.findById(idTeacher, { jamoa: { $elemMatch: { idGroup } } })
            let lol = student.jamoa[0].members.filter(elem => elem == idStudent)
            if (lol.length > 0) {
                res.json({ title: "Member already added to group" })
            } else {
                let group = await Ucer.findOneAndUpdate(
                    {
                        _id: idTeacher,
                        "jamoa.idGroup": idGroup
                    },
                    {
                        $push: {
                            "jamoa.$.members": idStudent
                        }
                    })
                res.json({ title: "Success", group })

                // varyant 1

                // let student = await Ucer.findById(idStudent)
                // let arr = []
                // for (let i = 0; i < student.message.length; i++) {
                //     if (student.message[i].idGroup != idGroup) {
                //         arr.push(student.message[i])
                //     }
                // }
                // let data = await Ucer.findByIdAndUpdate(idStudent, { $push: { message: arr } })


                // varyant 2
                
                // let message1 = await Ucer.findOneAndUpdate(
                //     {
                //         _id: idStudent,
                //         "message.idGroup": idGroup
                //     },
                //     {
                //         $pull: {
                //             "message.$.idGroup": idGroup
                //         }
                //     })
                // console.log(message1);
            }
        }
    } else {
        res.json({ title: "DATA is not defined" })
    }
}

exports.removeStudentFromGroup = async (req, res) => {
    let { idTeacher, idGroup, idStudent } = req.query
    if (idTeacher && idGroup && idStudent) {
        let teacher = await Ucer.findById(idTeacher)
        if (!teacher) {
            res.json({ title: "Teacher not found..." })
        } else {
            let group = await Ucer.findOneAndUpdate(
                {
                    _id: idTeacher,
                    "group._id": idGroup
                },
                {
                    $pull: {
                        "group.$.students": idStudent
                    }
                })
            res.json({ title: "Deleted" })
        }
    } else {
        res.json({ title: "Data is not defined..." })
    }
}