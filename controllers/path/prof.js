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
        let data1 = await Ucer.findByIdAndUpdate(idAuthor)
        let num = 0
        if (data1.messages.length) {
            for (let i = 0; i < data1.messages.length; i++) {
                if (data1.messages[i].idGroup != idGroup) {
                    let data = await Ucer.findByIdAndUpdate(idAuthor, { $push: { messages: req.body } })
                    if (data) {
                        res.json({ title: 'Message send to user', data })
                    } else {
                        res.json({ title: 'Something error' })
                    }
                } else {
                    num += 1
                }
                console.log(num);
            }
            if (num >= 1) {
                res.json({ title: 'Member already added to group' })
            }
        } else {
            let data = await Ucer.findByIdAndUpdate(idAuthor, { $push: { messages: req.body } })
            if (data) {
                res.json({ title: 'Message send to user', data })
            } else {
                res.json({ title: 'Something error' })
            }
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

                let message1 = await Ucer.findOneAndUpdate(
                    {
                        _id: idStudent
                    },
                    {
                        $pull: {
                            messages: {
                                idGroup: idGroup
                            }
                        }
                    }
                );
            }
        }
    } else {
        res.json({ title: "DATA is not defined" })
    }
}

exports.removeStudentFromGroup = async (req, res) => {
    let { idTeacher, idGroup, idStudent } = req.query
    if (idTeacher && idGroup && idStudent) {
        let teacher = await Ucer.find({ 'email': idTeacher })
        if (!teacher) {
            res.json({ title: "Creator not found..." })
        } else {
            // console.log(teacher[0].jamoa[0].members[0]._id == idStudent);
            // console.log(idStudent);
            // let data = await Ucer.findByIdAndUpdate(teacher[0]._id)
            // console.log(data);
            // let data = await Ucer.findByIdAndUpdate(teacher[0]._id, { ...req.body })

            let group = await Ucer.findOneAndUpdate(
                {
                    _id: teacher[0]._id,
                    "jamoa.idGroup": idGroup
                },
                {
                    $pull: {
                        "jamoa.$.members": idStudent
                    }
                })
            console.log(group);

            res.json({ title: "Deleted" });
        }
    } else {
        res.json({ title: "Data is not defined..." })
    }
}


// exports.removeStudentFromGroup = async (req, res) => {
//     const { idTeacher, idGroup, idStudent } = req.query;

//     if (idTeacher && idGroup && idStudent) {
//         try {
//             const teacher = await Ucer.findOne({ 'email': idTeacher });

//             if (!teacher) {
//                 return res.json({ title: 'Creator not found...' });
//             }

//             const group = teacher.jamoa.find((j) => j.idGroup.toString() === idGroup);

//             if (!group) {
//                 return res.json({ title: 'Group not found...' });
//             }

//             const studentPosition = group.members.findIndex((m) => m._id.toString() === idStudent);

//             if (studentPosition === -1) {
//                 return res.json({ title: 'Student not found...' });
//             }

//             group.members.splice(studentPosition, 1);
//             await teacher.save();

//             return res.json({ title: 'Deleted' });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ title: 'Internal Server Error' });
//         }
//     } else {
//         return res.json({ title: 'Data is not defined...' });
//     }
// };

exports.showMem = async (req, res) => {
    try {
        const data = await Ucer.findById(req.params.id)
        let arr = []
        for (let i = 0; i < data.jamoa.length; i++) {
            if (data.jamoa[i].idGroup == req.query.idGroup) {
                arr.push(data.jamoa[i].members)
            }
        }
        let arr1 = []
        for (let i = 0; i < arr[0].length; i++) {
            const newData = await Ucer.findById(arr[0][i])
            arr1.push(newData)
        }
        res.json({ title: "Special group members", members: arr1 })
    } catch (e) {
        res.json({ title: "ERROR: ", e })
    }
}
