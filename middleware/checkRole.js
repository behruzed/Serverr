exports.checkAdmin = async (req, res, next) => {
    if (req.user.status === 'superAdmin') {
        next()
    } else {
        res.json({ title: "Error: ", message: "No authorization on this route" })
    }
}

exports.checkStudent = async (req, res, next) => {
    if (req.user.status === 'talaba' || req.user.status === 'superAdmin') {
        next()
    } else {
        res.json({ title: "Error: ", message: "No authorization on this route" })
    }
}

exports.checkTeacher = async (req, res, next) => {
    if (req.user.status === 'admin' || req.user.status === 'superAdmin') {
        next()
    } else {
        res.json({ title: "Error: ", message: "No authorization on this route" })
    }
}