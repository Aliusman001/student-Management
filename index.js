const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const multer = require("multer");
var uniqueValidator = require('mongoose-unique-validator');

// ...............Connections..............
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", { useNewUrlParser: true });
app.use(express.static("public"));
//......................... Image upload..............
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });
// .........................local Variable................
let username = "admin@gmail.com";
//.............. mongoose collections ...........
const options = { year: "numeric", month: "long", day: "numeric" };
const todaydate = new Date();
const date = todaydate.toLocaleDateString("en-US", options)
const studentSchema = mongoose.Schema({
  Name: String,
  RollNumber: String,
  DateOfBirth: String,
  Email: String,
  PhoneNumber: String,
  CNIC: Number,
  Address: String,
  Courses: String,
  Semester: String,
  Gender: String,
  Session: String,
  Attandance: {
    type: String,
    default: "Absent"
  },
})
const Student = mongoose.model("Student", studentSchema);
const attendanceSchema = mongoose.Schema({
  Student: Array,
  Date: String,
  Course: String,
  Semester: String,
  Session: String

});
const resultSchema = mongoose.Schema({
  SubjectOne: String,
  Subject2: String,
  Subject3: String,
  Subject4: String,
  Subject5: String,
  Subject1Marks: String,
  Subject2Marks: String,
  Subject3Marks: String,
  Subject4Marks: String,
  Subject5Marks: String,
  Subject1ObtainedMarks: String,
  Subject2ObtainedMarks: String,
  Subject3ObtainedMarks: String,
  Subject4ObtainedMarks: String,
  Subject5ObtainedMarks: String,
  Subject1Grade: String,
  Subject2Grade: String,
  Subject3Grade: String,
  Subject4Grade: String,
  Subject5Grade: String,
  Subject1Persentage: String,
  Subject2Persentage: String,
  Subject3Persentage: String,
  Subject4Persentage: String,
  Subject5Persentage: String,
  TotalMarks: String,
  TotalObtainedMarks: String,
  TotalPersentage: String,
  TotalGrade: String,
  Name: String,
  RollNumber: String,
  CNIC: Number,
  Courses: String,
  Semester: String,
  Gender: String,
  Session: String
});
const userSchema = mongoose.Schema({
  Name: String,
  UserName: {
    type: String,
    required: true,
    unique: true,

  },
  Gender: String,
  Password: String,
  Profile: String
})
const User = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator);
const Result = mongoose.model("Result", resultSchema);
const Attandance = mongoose.model("Attendance", attendanceSchema);



// .............Pages..................
app.get("/", function (req, res) {
  res.render("loginpage", { massage: null });
})
//.............Home page route.........
app.get("/home", function (req, res) {
  res.render("home", { massage: null, active: 'home' });
})
// .................Register Your Self........
app.get("/registration", function (req, res) {
  res.render("registration", { error: null });
})
// .....................Attendance Page Render..........
app.get("/attendance", function (req, res) {
  res.render("attendance", { data: null, active: 'attendance', massage: null })
})
// ..................Registrations ...........
app.post("/registration", async (req, res) => {
  const name = _.toLower(req.body.name);
  const usernames = _.toLower(req.body.username);
  const gender = req.body.Gender;
  const password = req.body.password;
  console.log(usernames)
  try {
    let user = new User({
      Name: name,
      UserName: usernames,
      Gender: gender,
      Password: password
    })
    await user.save();
    username = usernames;
    if (usernames == "admin@gmail.com" && password == "Admin123.") {
      res.redirect("home")
    }
    else {
      res.redirect("/studentPage")
    }
  }


  catch (error) {

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(({ message }) => message);
      return res.render("registration", { error: errors });
    }
  }


})
// ----------------------Student Page--------------------------------------------
app.get('/studentPage', function (req, res) {
  res.render('studentPage', { post: null, user: username, active: 'studentPage' })
})
// .................login page....................
app.post("/login", function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;

  username = userName;

  User.find({ UserName: userName, Password: password }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      if (data.length == 0) {
        res.render("loginPage", { massage: "Check you Email or Password" });
      }
      else {
        if (userName == "admin@gmail.com" && password == "Admin123.") {
          res.redirect("home");
        } else {
          res.redirect("/studentPage")

        }
      }
    }
  })

})
// ..................Students Added Home page............
app.post("/home", function (req, res) {
  const studentName = req.body.studentname;
  const studentRollnumber = req.body.studentrollnumber;
  const dateOfBirth = req.body.DOB;
  const studentEmail = req.body.studentemail;
  const studentNumber = req.body.studentNumber;
  const studentCNIC = req.body.studentCNIC;
  const studentAddress = req.body.address;
  const studentCourses = req.body.courses;
  const studentSemester = req.body.semester;
  const studentGender = req.body.Gender;
  const session = req.body.session;

  const student1 = new Student({
    Name: studentName,
    RollNumber: studentRollnumber,
    DateOfBirth: dateOfBirth,
    Email: studentEmail,
    PhoneNumber: studentNumber,
    CNIC: studentCNIC,
    Address: studentAddress,
    Courses: studentCourses,
    Semester: studentSemester,
    Gender: studentGender,
    Session: session
  })
  student1.save((error) => { if (error) { console.log(error); } else { res.render("home", { massage: "Student is Successfully Added!", active: 'home' }) } });





})
// ......................Forget password...............
app.get("/forget", function (req, res) {
  res.render("forgetpage", { massage: null })
})
// ......................Forget password...............
app.post("/forget", function (req, res) {
  let forgetUsername = req.body.username;
  let forgetPassword = req.body.password;
  username = forgetUsername;
  console.log(forgetUsername);
  User.find({ UserName: forgetUsername }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
      if (data.length == 0) {
        res.render("forgetpage", { massage: "Username not find Sorry!" })
      }
      else {
        User.updateOne({ UserName: forgetUsername }, { $set: { Password: forgetPassword } }, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            res.redirect("/studentPage")
          }
        })
      }
    }
  })
})
//....................... account Page..................
app.get("/account", function (req, res) {

  User.find({ UserName: username }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data)
      res.render("account", { information: data, active: 'account' })
    }
  })


})
// .........................image route..................
app.post('/account', upload.single('image'), function (req, res) {
  let imagePath = req.file.filename;
  let user = req.body.newusername;
  let image = "uploads/" + imagePath

  User.updateOne({ UserName: user }, { $set: { Profile: image } }, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      User.find({ UserName: user }, function (err, data) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(data)
          res.render("account", { information: data, active: 'account' });
        }
      })
    }
  })

});
// ..........................Result Page Route.................
app.get("/result", function (req, res) {
  res.render("result", { data: null, active: 'result', massage: null })
})
// .................Update reault By Searching specific.......
app.post("/result", function (req, res) {
  const semester = req.body.semester;
  const courses = req.body.courses;
  const session = req.body.session;
  Student.find({ Semester: semester, Courses: courses, Session: session }, function (err, data) { if (err) { console.log(err); } else { res.render('result', { data: data, active: 'result', massage: null }) } })
})
// ...................Student Page Route...........
app.get("/students", function (req, res) {
  res.render("students", { data: null, active: 'students', massage: null })
})
// ..................Students Find By semester and courses..........
app.post("/students", function (req, res) {
  const semester = req.body.semester;
  const courses = req.body.courses;
  const session = req.body.session;
  Student.find({ Semester: semester, Courses: courses, Session: session }, function (err, data) { if (err) { console.log(err); } else { res.render('students', { data: data, active: 'students', massage: null }) } })
})
// .................Student Deleted By Id........
app.post("/studentdelete", function (req, res) {
  const deletes = req.body.delete;
  const update = req.body.update;
  console.log(deletes, update);
  if (update) {
    Student.findOne({ _id: update }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render('studentUpdate', { data: data, active: 'students', massage: null })
      }
    })
  } else {
    Student.deleteOne({ _id: deletes }, function (error) {
      if (error) {
        console.log(error);
      }
      else {
        res.render('students', { data: null, active: 'students', massage: "Student Deleted SuccessFully!" })
      }
    })
  }

})
// ------------------Student Updated-----------------
app.post('/studentUpdate', function (req, res) {
  const id = req.body.id;
  const studentName = req.body.studentname;
  const studentRollnumber = req.body.studentrollnumber;
  const dateOfBirth = req.body.DOB;
  const studentEmail = req.body.studentemail;
  const studentNumber = req.body.studentNumber;
  const studentCNIC = req.body.studentCNIC;
  const studentAddress = req.body.address;
  const studentCourses = req.body.courses;
  const studentSemester = req.body.semester;
  const studentGender = req.body.Gender;
  const session = req.body.session;
  console.log(studentName, studentRollnumber);
  Student.updateOne({ _id: id }, {
    Name: studentName,
    RollNumber: studentRollnumber,
    DateOfBirth: dateOfBirth,
    Email: studentEmail,
    PhoneNumber: studentNumber,
    CNIC: studentCNIC,
    Address: studentAddress,
    Courses: studentCourses,
    Semester: studentSemester,
    Gender: studentGender,
    Session: session
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render('students', { data: null, active: 'students', massage: "Student Updated SuccessFully!" })
    }
  })
})
// ............Students Attandance..........
app.post("/attendance", function (req, res) {
  const semester = req.body.semester;
  const courses = req.body.courses;
  const session = req.body.session;
  Student.find({ Semester: semester, Courses: courses, Session: session }, function (err, data) {
    if (err) { console.log(err); } else { res.render('attendance', { data: data, active: 'attendance', massage: null }) }
  })
})
// ..............Update Attendance...............
app.post("/updateattendance", function (req, res) {
  const presents = req.body.attendancePresent;
  const absents = req.body.attendanceAbsent;
  const completeData = [];

  if (typeof absents === 'object') {
    completeData.push(...absents)

  }
  if (typeof absents === 'string') {
    completeData.push(absents)
  }
  if (typeof presents === 'object') {
    completeData.push(...presents)
  }
  if (typeof presents === 'string') {
    completeData.push(presents)
  }

  if (presents) {
    Student.updateMany({ _id: { $in: presents } }, { Attandance: "Present" }, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Present updated");
      }
    })
  }

  if (absents) {
    Student.updateMany({ _id: { $in: absents } }, { Attandance: "Absent" }, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Absent updated");
      }
    })
  }


  Student.find({ _id: { $in: completeData } }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      const attendance = Attandance({
        Student: data,
        Date: date,
        Course: data[0].Courses,
        Semester: data[0].Semester,
        Session: data[0].Session
      })
      attendance.save(function (err) {
        if (err) { console.log(err); } else {
          res.render('attendance', { data: null, active: 'attendance', massage: "Student attendance SuccessFully Added!" })

        }
      });
    }
  })

})

// -------------------Attendance Delete---------------------
app.post('/attendanceDelete', function (req, res) {
  const date = req.body.date;
  Attandance.deleteOne({ Date: date }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/studentAttendance');
      console.log('Attendance Deleted SuccesSFully');
    }
  })
})

// ..............Attendance Page .................
app.get("/studentAttendance", function (req, res) {
  res.render("studentAttendance", { data: null, user: username, active: 'studentAttendance' })
})
// ..............Attendance Show..................
app.post("/showAttendance", function (req, res) {
  const semester = req.body.semester;
  const courses = req.body.courses;
  const session = req.body.session;
  const searchDate = req.body.attendancedate;
  let formatedDate;
  if (searchDate) {
    let monthfree;
    let day;
    const seperateDate = searchDate.split('-');
    const month = (a) => {
      switch (a) {
        case 1:

          monthfree = "January"
          break;
        case 2:

          monthfree = "February"
          break;
        case 3:

          monthfree = "March";
          break;
        case 4:

          monthfree = "April"
          break;
        case 5:

          monthfree = "May"
          break;
        case 6:

          monthfree = "June"
          break;
        case 7:

          monthfree = "July"
          break;
        case 8:

          monthfree = "August"
          break;
        case 9:

          monthfree = "Septemper"
          break;
        case 10:

          monthfree = "Octomber"
          break;
        case 11:

          monthfree = "November"
          break;
        case 12:

          monthfree = "December"
          break;

        default:
          console.log("invalid input of date");
          break;
      }
    }
    if (seperateDate[1].slice(0, 1) === "0") {
      const a = Number(seperateDate[1].replace('0', ''))
      month(a)
    } else {
      month(Number(searchDate[1]));
    }
    if (seperateDate[2].slice(0, 1) === "0") {
      day = seperateDate[2].replace('0', '')
    } else {
      day = seperateDate[2];
    }
    formatedDate = `${monthfree} ${day}, ${seperateDate[0]}`;
  }

  if (formatedDate) {
    Attandance.find({ Semester: semester, Courses: courses, Session: session, Date: formatedDate }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("studentAttendance", { data: data, user: username, active: 'studentAttendance' })
      }
    })
  } else {

    Attandance.find({ Semester: semester, Courses: courses, Session: session }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("studentAttendance", { data: data, user: username, active: 'studentAttendance' })
      }
    })
  }
})

// .................Submit Result.................
app.post("/submitResult", function (req, res) {
  const result = req.body.result;
  const update = req.body.update;
  const semester = req.body.semester;
  const session = req.body.session;
  console.log(result, update, semester, session);
  if (result) {
    Result.findOne({ RollNumber: result, Semester: semester, Session: session }, function (err, data) {
      if (err) {
        console.log(err);
      } else if (data) {
        console.log(data);
        res.render("result", { data: data, active: 'result', massage: 'Result is already submitted,Now you can Update!' })
        // res.render('updateResult', { data: data, user: username, active: 'result' })
      } else {
        Student.findOne({ RollNumber: result, Semester: semester, Session: session }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.render("submitResult", { data: data, active: 'result' })
          }
        })
      }
    })
  }
  else {
    Result.findOne({ RollNumber: update, Semester: semester, Session: session }, function (err, data) {
      if (err) {
        console.log(err);
      } else if (data) {
        res.render('updateResult', { data: data, user: username, active: 'result' })
      } else {
        console.log('Result is not submit');
        res.render("result", { data: null, active: 'result', massage: 'First you submit the result, then you can Update!' })
      }
    })
  }
});
// -----------------------------Update Result------------------
app.post('/updateResult', function (req, res) {
  const subject1 = req.body.Subject1;
  const subject2 = req.body.Subject2;
  const subject3 = req.body.Subject3;
  const subject4 = req.body.Subject4;
  const subject5 = req.body.Subject5;
  const subject1Marks = req.body.Subject1Marks;
  const subject2Marks = req.body.Subject2Marks;
  const subject3Marks = req.body.Subject3Marks;
  const subject4Marks = req.body.Subject4Marks;
  const subject5Marks = req.body.Subject5Marks;
  const subject1ObtainedMarks = req.body.Subject1ObtainedMarks;
  const subject2ObtainedMarks = req.body.Subject2ObtainedMarks;
  const subject3ObtainedMarks = req.body.Subject3ObtainedMarks;
  const subject4ObtainedMarks = req.body.Subject4ObtainedMarks;
  const subject5ObtainedMarks = req.body.Subject5ObtainedMarks;
  const subject1Grade = req.body.Subject1Grade;
  const subject2Grade = req.body.Subject2Grade;
  const subject3Grade = req.body.Subject3Grade;
  const subject4Grade = req.body.Subject4Grade;
  const subject5Grade = req.body.Subject5Grade;
  const subject1Persentage = req.body.Subject1Persentage;
  const subject2Persentage = req.body.Subject2Persentage;
  const subject3Persentage = req.body.Subject3Persentage;
  const subject4Persentage = req.body.Subject4Persentage;
  const subject5Persentage = req.body.Subject5Persentage;
  const totalMarks = req.body.totalMarks;
  const totalObtainedMarks = req.body.totalObtainedMarks;
  const totalGrade = req.body.totalGrade;
  const totalPersentage = req.body.totalPersentage;
  const name = req.body.Name;
  const rollNumber = req.body.RollNumber;
  const gender = req.body.Gender;
  const semester = req.body.Semester;
  const courses = req.body.Courses;
  const session = req.body.session;

  console.log(session);

  Result.updateOne({ RollNumber: rollNumber }, {
    SubjectOne: subject1,
    Subject2: subject2,
    Subject3: subject3,
    Subject4: subject4,
    Subject5: subject5,
    Subject1Marks: subject1Marks,
    Subject2Marks: subject2Marks,
    Subject3Marks: subject3Marks,
    Subject4Marks: subject4Marks,
    Subject5Marks: subject5Marks,
    Subject1ObtainedMarks: subject1ObtainedMarks,
    Subject2ObtainedMarks: subject2ObtainedMarks,
    Subject3ObtainedMarks: subject3ObtainedMarks,
    Subject4ObtainedMarks: subject4ObtainedMarks,
    Subject5ObtainedMarks: subject5ObtainedMarks,
    Subject1Grade: subject1Grade,
    Subject2Grade: subject2Grade,
    Subject3Grade: subject3Grade,
    Subject4Grade: subject4Grade,
    Subject5Grade: subject5Grade,
    Subject1Persentage: subject1Persentage,
    Subject2Persentage: subject2Persentage,
    Subject3Persentage: subject3Persentage,
    Subject4Persentage: subject4Persentage,
    Subject5Persentage: subject5Persentage,
    TotalMarks: totalMarks,
    TotalObtainedMarks: totalObtainedMarks,
    TotalPersentage: totalPersentage,
    TotalGrade: totalGrade,
    Name: name,
    RollNumber: rollNumber,
    Courses: courses,
    Semester: semester,
    Gender: gender,
    Session: session
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("updated");
      res.render('result', { data: null, user: username, active: 'result', massage: 'Result is Updated SuccessFully!' })
    }
  })

})

// .................Submit Result Card..........
app.post("/submitResultCard", function (req, res) {
  const subject1 = req.body.Subject1;
  const subject2 = req.body.Subject2;
  const subject3 = req.body.Subject3;
  const subject4 = req.body.Subject4;
  const subject5 = req.body.Subject5;
  const subject1Marks = req.body.Subject1Marks;
  const subject2Marks = req.body.Subject2Marks;
  const subject3Marks = req.body.Subject3Marks;
  const subject4Marks = req.body.Subject4Marks;
  const subject5Marks = req.body.Subject5Marks;
  const subject1ObtainedMarks = req.body.Subject1ObtainedMarks;
  const subject2ObtainedMarks = req.body.Subject2ObtainedMarks;
  const subject3ObtainedMarks = req.body.Subject3ObtainedMarks;
  const subject4ObtainedMarks = req.body.Subject4ObtainedMarks;
  const subject5ObtainedMarks = req.body.Subject5ObtainedMarks;
  const subject1Grade = req.body.Subject1Grade;
  const subject2Grade = req.body.Subject2Grade;
  const subject3Grade = req.body.Subject3Grade;
  const subject4Grade = req.body.Subject4Grade;
  const subject5Grade = req.body.Subject5Grade;
  const subject1Persentage = req.body.Subject1Persentage;
  const subject2Persentage = req.body.Subject2Persentage;
  const subject3Persentage = req.body.Subject3Persentage;
  const subject4Persentage = req.body.Subject4Persentage;
  const subject5Persentage = req.body.Subject5Persentage;
  const totalMarks = req.body.totalMarks;
  const totalObtainedMarks = req.body.totalObtainedMarks;
  const totalGrade = req.body.totalGrade;
  const totalPersentage = req.body.totalPersentage;
  const name = req.body.Name;
  const rollNumber = req.body.RollNumber;
  const gender = req.body.Gender;
  const semester = req.body.Semester;
  const courses = req.body.Courses;
  const session = req.body.session;
  console.log(session);

  const student1 = Result({
    SubjectOne: subject1,
    Subject2: subject2,
    Subject3: subject3,
    Subject4: subject4,
    Subject5: subject5,
    Subject1Marks: subject1Marks,
    Subject2Marks: subject2Marks,
    Subject3Marks: subject3Marks,
    Subject4Marks: subject4Marks,
    Subject5Marks: subject5Marks,
    Subject1ObtainedMarks: subject1ObtainedMarks,
    Subject2ObtainedMarks: subject2ObtainedMarks,
    Subject3ObtainedMarks: subject3ObtainedMarks,
    Subject4ObtainedMarks: subject4ObtainedMarks,
    Subject5ObtainedMarks: subject5ObtainedMarks,
    Subject1Grade: subject1Grade,
    Subject2Grade: subject2Grade,
    Subject3Grade: subject3Grade,
    Subject4Grade: subject4Grade,
    Subject5Grade: subject5Grade,
    Subject1Persentage: subject1Persentage,
    Subject2Persentage: subject2Persentage,
    Subject3Persentage: subject3Persentage,
    Subject4Persentage: subject4Persentage,
    Subject5Persentage: subject5Persentage,
    TotalMarks: totalMarks,
    TotalObtainedMarks: totalObtainedMarks,
    TotalPersentage: totalPersentage,
    TotalGrade: totalGrade,
    Name: name,
    RollNumber: rollNumber,
    Courses: courses,
    Semester: semester,
    Gender: gender,
    Session: session
  });

  student1.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("result", { data: null, active: 'result', massage: "Result is Submitted SuccessFully!" });
    }
  });

})
// ..................Search Result................
app.get("/searchResult", function (req, res) {
  res.render("searchResult", { data: null, user: username, active: 'searchResult' })
})
//....................Search Result by Query........
app.post("/searchResult", function (req, res) {
  const search = req.body.search;
  const semester = req.body.semester;
  const session = req.body.session;
  console.log(search, semester, session);
  Result.findOne({ RollNumber: search, Semester: semester, Session: session }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
      res.render("searchResult", { data: data, user: username, active: 'searchResult' })
    }
  })
})


app.listen(3000, function () {
  console.log("server running in port 3000")
})































































