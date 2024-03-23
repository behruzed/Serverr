import axios from "axios";
import config from "../../qwe/config";
import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Loading from '../Main/Loading';
function Groups() {
  // Modal ochish uchun state lar
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  // Modalni yopish funksiyalari
  const handleCloseModal1 = () => setShowModal1(false);
  const handleCloseModal2 = () => setShowModal2(false);
  const handleCloseModal3 = () => setShowModal3(false);

  // Modalni ochish funksiyalari
  const handleShowModal1 = () => setShowModal1(true);
  const handleShowModal2 = () => setShowModal2(true);
  const handleShowModal3 = () => setShowModal3(true);

  const [searchMod, setSearchMod] = useState(false)

  const [username, setUsername] = useState('');
  const [univer, setUniver] = useState('');
  const [id, setId] = useState('');
  const [rand, setRand] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [idUcer, setIdUcer] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [idGroup, setIdGroup] = useState('');
  const [jamoa, setJamoa] = useState([]);
  const [mem, setMem] = useState([]);


  // Global API lar uchun ozgaruvchilar
  const me = 'l';
  const number = 3; //jamoa azolari soni

  const gcv = (inp) => { return inp.current.value; };

  let inp1 = useRef(null);
  let inp2 = useRef(null);

  const searchUser = async () => {
    let res1 = await axios.get(`${config.url}/prof/search?idUcer=${inp2.current.value}`, {
      headers: {
        authorization: window.localStorage.getItem("token")
      }
    })
    console.log(res1);
    if (res1.data.message === "No authorization on this route" || res1.data.message === "Token is not defined" || res1.data.message === "Token wrong") {
      window.localStorage.clear()
      window.location.replace('/')
    }
    setSearchMod(false)
    if (res1.data.arr[0].email) {
      setEmail(res1.data.arr[0].email)
      setSearchMod(true)
      setIdUcer(res1.data.arr[0]._id)
    }
  };

  const sendMess = async () => {
    let dat = {
      message: `Sizni ${fullName} ${groupName} guruhiga taklif qildi.`,
      idGroup: idGroup,
      idTeacher: id
    }
    let res = await axios.post(`${config.url}/prof/sendMess?idAuthor=${idUcer}`, dat, {
      headers: {
        authorization: window.localStorage.getItem("token")
      }
    })
    if (res.data.message === "No authorization on this route" || res.data.message === "Token is not defined" || res.data.message === "Token wrong") {
      window.localStorage.clear()
      navigate('/home')
    }
    console.log(res);
    alert(res.data.title)
  }

  const showMem = async (idGroup) => {
    let res1 = await axios.get(`${config.url}/prof/group/members/${id}?idGroup=${idGroup}`, {
      headers: {
        authorization: window.localStorage.getItem("token")
      }
    })
    if (res1.data.message === "No authorization on this route" || res1.data.message === "Token is not defined" || res1.data.message === "Token wrong") {
      window.localStorage.clear()
      window.location.replace('/')
    }
    setMem(res1.data.members)
  };

  const delMem = async (idStudent) => {
    // let getId = await axios(`${config.url}/groups/getId`, {
    //     headers: {
    //         authorization: window.localStorage.getItem("token")
    //     }
    // })
    let res = await axios.delete(`${config.url}/prof/delMem?idTeacher=${authorEmail}&idGroup=${idGroup}&idStudent=${idStudent}`, {
        headers: {
            authorization: window.localStorage.getItem("token")
        }
    })
    console.log(res);
    // alert(res.data.title)
  };

  const getJamoa = async () => {
    let res1 = await axios.get(`${config.url}/prof/profilest`, {
      headers: {
        authorization: window.localStorage.getItem("token")
      }
    })
    if (res1.data.message === "No authorization on this route" || res1.data.message === "Token is not defined" || res1.data.message === "Token wrong") {
      window.localStorage.clear()
      window.location.replace('/')
    }
    setJamoa(res1.data.data.jamoa)
  };

  const getData = async () => {
    let res1 = await axios.get(`${config.url}/prof/profilest`, {
      headers: {
        authorization: window.localStorage.getItem("token")
      }
    })
    if (res1.data.message === "No authorization on this route" || res1.data.message === "Token is not defined" || res1.data.message === "Token wrong") {
      window.localStorage.clear()
      window.location.replace('/')
    }
    const fullName1 = res1.data.data.name + ' ' + res1.data.data.surname
    setUsername(res1.data.data.name)
    setUniver(res1.data.data.university)
    setRand(res1.data.data.randomNumber)
    setId(res1.data.data._id)
    setAuthorEmail(res1.data.data.email)
    setFullName(fullName1)
  };

  const addGroup = async () => {
    if (inp1.current.value == '') {
      alert("Complete input...")
    } else if (1) {
      const randomNumber = Math.floor(Math.random() * 1000000);
      let addGr = {
        university: univer,
        author: authorEmail,
        name: gcv(inp1),
        idGroup: randomNumber + rand,
        members: []
      }
      let res = await axios.post(`${config.url}/prof/crGroup?idAuthor=${id}`, addGr, {
        headers: {
          authorization: window.localStorage.getItem("token")
        }
      })
      if (res.data.title === "Group added to author") {
        alert(res.data.title)
      }
      if (res.data.message === "No authorization on this route" || res.data.message === "Token is not defined" || res.data.message === "Token wrong") {
        window.localStorage.clear()
        navigate('/home')
      }
    }
  };

  useEffect(() => {
    getData()
    getJamoa()
  }, [])

  return (
    <>
      <Loading />
      <div>
        <div className="creategr">
          <button className="" onClick={handleShowModal1}>
            <i className="fa-solid fa-plus"></i> Yangi jamoa yaratish
          </button>
        </div>
        <div className="mygroups">
          <h1 className="h11">Mening jamoalarim</h1>
          {
            jamoa.map((item, i) => {
              return (
                <>
                  <div className="mygr shad">
                    <h5>{item.name}</h5>
                    A'zolar soni: {item.members.length}
                    <br></br>
                    <Link>
                      <button onClick={() => { setGroupName(item.name), setIdGroup(item.idGroup) }} onClickCapture={handleShowModal2} className="addnewuser">
                        Yangi a'zo qo`shish
                      </button>
                    </Link>
                    <br></br>
                    <button onClick={() => { showMem(item.idGroup), setIdGroup(item.idGroup) }} onClickCapture={handleShowModal3} className="seeusers">
                      <i>A'zolarni ko`rish</i>
                    </button>
                  </div>
                </>
              )
            })
          }
        </div >
      </div >

      {/* Modal 1 */}
      < Modal className="errt" show={showModal1} onHide={handleCloseModal1} >
        <Modal.Header closeButton>
          <Modal.Title>Yangi jamoa yaratish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <label htmlFor="nameofuniver">Universitetingiz:</label>
            <br></br>
            <div>{univer}</div>
            <br></br>
            <br></br>
            <label htmlFor="nameofowner">Jamoa sardori:</label>
            <br></br>
            <div>{username}</div>
            <br></br>
            <br></br>
            <label htmlFor="nameofgroup">Jamoa nomi:</label>
            <br></br>
            <input ref={inp1} required name="nameofgroup" id="nameofgroup" type="text" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal1}>
            Yopish
          </Button>
          <Button variant="primary" onClick={addGroup}>
            Yaratish
          </Button>
        </Modal.Footer>
      </Modal >

      {/* Modal 2 */}
      < Modal className="errt" show={showModal2} onHide={handleCloseModal2} >
        <Modal.Header closeButton>
          <Modal.Title>Yangi a'zo qo`shish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <label htmlFor="gr">
              Yangi a'zoning ID raqami yoki ism familiyasini kiriting:
            </label>
            <br></br>
            <input ref={inp2} type="text" id="gr" />
            <br></br>
            <br></br>
            <Button variant="primary" onClick={searchUser}>Qidirish</Button>
          </div>
        </Modal.Body>
        {
          searchMod && <div className="d-flex align-items-center justify-content-between userlist">
            <div>{email}</div>{" "}
            <button className="d-flex hhh taklif" onClick={sendMess}>Taklif qilish</button>
          </div>
        }
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>
            Yopish
          </Button>
        </Modal.Footer>
      </Modal >

      {/* Modal 3 */}
      < Modal className="errt" show={showModal3} onHide={handleCloseModal3} >
        <Modal.Header closeButton>
          <Modal.Title>Jamoadagi a'zolar ro`yxati</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="align-items-center justify-content-center">
            <thead>
              <tr>
                <th>i</th>
                <th>Jamoa a'zolari</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mem.map((item, i) => {
                return (
                  <>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{item.name} {item.surname}</td>
                      <td onClick={() => { delMem(item._id) }} className="redtrash"><button><i className="fa-solid fa-trash"></i></button></td>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal3}>
            Close
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
}

export default Groups;
