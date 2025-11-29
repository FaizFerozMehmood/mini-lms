import {
  getTrendingCourses,
  getCategories,
  getRawData,
} from "./data/dataHandler.js";

async function routers() {
  const hash = window.location.hash;
  // console.log(hash);
  const aapContainer = document.getElementById("app");
  // console.log(aapContainer);
  aapContainer.innerHTML = "";

  switch (hash) {
    case "#home":
      aapContainer.innerHTML = await renderHomePage();
      break;

    case "#courses":
      aapContainer.innerHTML = await renderCoursesPage();
      break;
    case "#dashboard":
      aapContainer.innerHTML = renderDashboard();
      break;
    default:
      if (hash.startsWith("#course=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = await renderCourseDetailPage(coureID);
        const courses = await getRawData();
        const currentCourse = courses.find((c) => c.id == coureID);
        updateCourseProgress(currentCourse);
      }
      if (hash.startsWith("#quiz=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = await renderQuizpage(coureID);
        // const courses = await getRawData();
        // const currentCourse = courses.find((c) => c.id == coureID);
        // updateCourseProgress(currentCourse);
      }

      if (hash.startsWith("#lesson=")) {
        const lessonId = hash.split("=")[1];
        aapContainer.innerHTML = await renderLessonPage(lessonId);
        console.log("lessonID===>", lessonId);
        const saved = localStorage.getItem(lessonId);
        const safeId = lessonId.replace(/:/g, "\\:");

        const box = document.querySelector(`#checkbox-${safeId}`);
        console.log(box);
        console.log("saved===>", saved);
        if (box && saved === "true") {
          box.checked = true;
        }
      }
      if (hash.startsWith("#category=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = await renderCategoryPage(coureID);
      }
  }
}
function updateCourseProgress(course) {
  const tottlLessons = course.lessons.length;
  let completed = 0;
  course.lessons.forEach((isn) => {
    if (localStorage.getItem(isn.lesson_id) === "true") {
      completed++;
    }
  });
  const progressPercent = Math.round((completed / tottlLessons) * 100);

  const progressBar = document.querySelector(
    `.progress-bar[data-course="${course.id}"]`
  );

  if (progressBar) {
    progressBar.style.width = progressPercent + "%";
    progressBar.setAttribute("aria-valuenow", progressPercent);
    progressBar.innerText = progressPercent + "%";
  }
}
// routers()

window.addEventListener("hashchange", routers);
window.addEventListener("load", routers);
if (!window.location.hash) {
  window.location.hash = "#home";
}
async function renderHomePage() {
  const heroSec = `<div id="heroSection" class="p-5 mb-4 bg-light rounded-3 text-center">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Learn Anything, Anytime.</h1>
        <p class="col-md-8 fs-4 mx-auto">
          Explore thousands of courses taught by expert instructors. 
          Start your learning journey today!
        </p>
        <a href="#courses" class="btn btn-primary btn-lg" type="button">
          Explore All Courses
        </a>
      </div>
    </div>
  `;
  let categoreisSec = "";
  let trendingSECHTML = "";
  try {
    const [trendingCourses, courseCategories] = await Promise.all([
      getTrendingCourses(),
      getCategories(),
    ]);
    console.log("trendingCourses", trendingCourses);
    console.log("courseCategories", courseCategories);
    trendingSECHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center mb-2 text-center p-3 p-sm-4 border-top">
    <h1 class="display-5 fw-bold">Trending Courses</h1>
</div> `;
    trendingSECHTML += '<div class="d-flex flex-wrap justify-content-center">';
    trendingCourses.forEach((data) => {
      trendingSECHTML += `<div class="card text-center mx-2 my-2 bg-light" id="TrendingCARD" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <p class="card-text">${data.short_description}</p>
<a href="#course=${data.id}">View Course</a>  </div>
</div>`;
    });
    trendingSECHTML += "</div>";
    categoreisSec += ` 
      <div class="text-center mx-auto mt-5 pt-4 border-top">
        <h2 class="mb-4"> Browse Categories</h2>
      </div>`;
    categoreisSec += `<div  class="d-flex flex-wrap justify-content-center mb-5">`;
    for (let category in courseCategories) {
      const count = courseCategories[category].length;
      categoreisSec += `
             <a id="categorySec" href="#category=${category}" class="btn btn-outline-dark m-2">
                ${category} (${count})
            </a>`;
    }
    categoreisSec += `</div>`;
    return heroSec + trendingSECHTML + categoreisSec;
  } catch (error) {
    console.error("data fetching failed", error);
  }
}
async function renderCoursesPage() {
  let courseCards = "";
  try {
    const courses = await getRawData();

    courseCards += '<div class="d-flex flex-wrap justify-content-center">';
    courses.forEach((data) => {
      courseCards += `
      <div class="card course-card mx-3 mt-4 mb-4" style="width: 18rem;">
        
        <img src="${
          data.image_url
        }" class="card-img-top course-image" alt="Course Image">
        
        <div class="card-body">
          <h5 class="card-title fw-bold">${data.title}</h5>
          
          <div class="card-info mb-3">
            <span class="badge bg-secondary me-2">${data.category}</span>
            <span class="badge ${
              data.level === "Beginner"
                ? "bg-success"
                : data.level === "Intermediate"
                ? "bg-warning text-dark"
                : "bg-danger"
            }">${data.level}</span>
          </div>
          
          <a href="#course=${
            data.id
          }" class="btn btn-primary w-100">Start Course</a>
           <a href="#quiz=${
             data.id
           }" class="btn btn-primary w-100 mt-2">Take Quiz</a>
        </div>
      </div>
      
      `;
    });
    courseCards += `</div>`;

    console.log("courses==>", courses);
    return courseCards;
  } catch (error) {}
}
async function renderCourseDetailPage(CourseId) {
  const savedScore = JSON.parse(localStorage.getItem("lastQuizScore"));

  let cardDetails = "";
  let restHtml = "";
  //  const savedScore = JSON.parse(localStorage.getItem("lastQuizScore"));

  if (savedScore) {
    const statusClass =
      savedScore.percentage >= 50
        ? "border-success bg-light-success"
        : "border-danger bg-light-danger";
    const statusText =
      savedScore.percentage >= 50
        ? "Passed 🎉"
        : "You failed, but never give up, dude!";

    restHtml += `
      <div class="container py-3">
        <div class="card shadow-sm border ${statusClass} mx-auto" style="max-width: 800px;">
          <div class="card-body">
            <h3 class="card-title text-center mb-3 fw-bold">${
              " Your Last Quiz Result=>  " + savedScore.ccourseId ||
              "Last Quiz Result"
            }</h3>
            <div class="row text-center">
              <div class="col-4">
                <p class="mb-0 text-muted">Score</p>
                <h4 class="fw-bold text-primary">${savedScore.correct}/${
      savedScore.total
    }</h4>
              </div>
              <div class="col-4">
                <p class="mb-0 text-muted">Percentage</p>
                <h4 class="fw-bold text-info">${savedScore.percentage}%</h4>
              </div>
              <div class="col-4">
                <p class="mb-0 text-muted">Status</p>
                <h5 class="fw-bold ${
                  savedScore.percentage >= 50 ? "text-success" : "text-danger"
                }">${statusText}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  try {
    console.log("CourseId===>", CourseId);
    const courses = await getRawData();

    console.log("courses=====>", courses);
    const filteredData = courses.filter((data) => data.id == CourseId);

    if (filteredData.length === 0) {
      return '<div class="alert alert-warning text-center fw-bold mt-5" role="alert">Course not found. Please check the Course ID.</div>';
    }

    cardDetails += '<div class="container pb-5">';

    filteredData.forEach((data) => {
      console.log("leassons==>", data?.lessons);

      const lessonHtml = data?.lessons
        .map((lsn) => {
          return `
            <li class="list-group-item px-0 py-2 border-0 border-bottom">
              <a href="#lesson=${
                lsn.lesson_id
              }" class="btn btn-outline-dark btn-sm d-flex justify-content-between align-items-center w-100 text-start">
                <span class="text-truncate">${
                  lsn.title || "Lesson Title"
                }</span>
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>`;
        })
        .join("");

      console.log(lessonHtml);

      cardDetails += `
        <div class="card shadow-lg mx-auto border-0" style="max-width: 900px;">
          <div class="row g-0">

            <div class="col-md-5 d-flex align-items-stretch bg-light rounded-start p-3">
              <div class="p-3 w-100 d-flex justify-content-center align-items-center">
                <img src="${
                  data.image_url
                }" class="img-fluid rounded-3 shadow-sm border" alt="Course Image">
              </div>
            </div>

            <div class="col-md-7">
              <div class="card-body p-4">

                <h3 class="card-title fw-bolder mb-3 text-primary">${
                  data.description
                }</h3>
                <p class="text-muted fst-italic">An insightful look into the course curriculum.</p>

                <h5 class="mt-4 mb-2 text-dark">Course Progress</h5>
                <div class="progress mb-4 rounded-pill" style="height: 30px;">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-course="${
                    data.id
                  }">
                    <span class="fw-bold">0% Complete</span>
                  </div>
                </div>

                <h5 class="card-subtitle mb-3 text-dark border-bottom pb-2 pt-2"><i class="bi bi-list-task me-2"></i>Lessons Outline</h5>
                <ul class="list-group list-group-flush">
                  ${
                    lessonHtml ||
                    '<li class="list-group-item text-center text-muted fst-italic py-3">No lessons have been added to this course yet.</li>'
                  }
                </ul>

              </div>
            </div>
          </div>
        </div>
      `;
    });

    cardDetails += `</div>`;
    return restHtml + cardDetails;
  } catch (error) {
    console.error("Error in renderCourseDetailPage:", error);
    return '<div class="alert alert-danger text-center fw-bold mt-5" role="alert">An unexpected error occurred loading the course details. Please try again later.</div>';
  }
}
const renderCategoryPage = async (id) => {
  let categoryHtml = "";
  const dedeed = decodeURIComponent(id);
  console.log(dedeed);
  const categoreis = await getCategories();
  console.log("data by id", categoreis[dedeed]);

  categoreis[dedeed].forEach((d) => {
    categoryHtml += '<div class="d-flex p-4 flex-wrap justify-content-center">';
    categoryHtml += `
<div class="card course-card p-3 " style="width: 18rem;">
  <img src=${d.image_url} class="card-img-top course-image" alt="...">
  <div class="card-body ">
    <h5 class="card-title">${d.category}</h5>
    <p class="card-text txtx ">${d.description}</p>
    <a href="#course=${d.id}" class="btn btn-primary ">Explore Lessons</a>
  </div>
</div>
`;
  });
  categoryHtml += "</div>";
  return categoryHtml;
};
async function renderLessonPage(lessonId) {
  let lessonHtml = "";
  try {
    const courses = await getRawData();
    console.log(courses);
    courses.forEach((data) => {
      // console.log(data.lessons)
      const filterLesson = data.lessons.filter(
        (lsn) => lsn.lesson_id === lessonId
      );
      console.log(filterLesson);
      // if(filterLesson)
      filterLesson.length > 0
        ? filterLesson.forEach((sbq) => {
            lessonHtml += `
<div class="container mt-4 mb-5">
  <div class="row">
    <div class="col-lg-8 offset-lg-2">
      <header class="mb-4 pb-2 border-bottom">
        <h1 class="display-4 text-primary">${sbq.title}</h1>
      </header>
      <section class="mb-4">
        <div class="ratio ratio-16x9">
          <iframe
            src="${sbq.video_url}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </section>
      <section class="card shadow-sm mb-4">
        <div class="card-body">
          <h4 class="card-title text-secondary">Lesson Content</h4>
          <p class="card-text">${sbq.text_content}</p>
        </div>
      </section>
      <section class="d-flex justify-content-end align-items-center bg-light p-3 rounded shadow-sm">
        <div class="form-check form-switch fs-5">
          <input 
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="checkbox-${sbq.lesson_id}"
            data-lesson="${sbq.lesson_id}"
          >
          <label class="form-check-label ms-2" for="checkbox-${sbq.lesson_id}">
            **Mark as Completed**


          </label>
        </div>


      </section>

    </div>
  </div>
</div>
        `;
          })
        : "";
      // getCheckBoxData(lessonId)
    });
    return lessonHtml;
  } catch (error) {}
}
// https://www.youtube.com/embed/W6NZfCO5SIk

document.addEventListener("change", (e) => {
  if (e.target.matches(".form-check-input")) {
    const id = e.target.dataset.lesson;
    const done = e.target.checked;
    localStorage.setItem(`${id}`, done);

    console.log("id=>", id);
    console.log("compledted=>", done);
  }
});

const renderQuizpage = async (id) => {
  let quizHtml = "";
  const courses = await getRawData();
  const course = courses.find((c) => c.id === id);

  course?.quiz.forEach((q) => {
    quizHtml += `
      <h6 class ="mt-3">${q.question_id} => ${q.text}</h6>
      <ul class="list-group"">
        ${q.options
          .map(
            (opt, idx) =>
              `<li class="option list-group-item" id="list" data-question="${q.question_id}" data-index="${idx}">${opt}</li>`
          )
          .join("")}
      </ul>
    `;
  });
  quizHtml += `<button type="button" class="btn btn-success m-2" id="submitQuiz">Submit Quiz</button>`;
  return quizHtml;
};

// let score = {}
let quizScore = {};

document.addEventListener("click", async function (e) {
  // console.log(e)
  if (e.target.classList.contains("option")) {
    const quesId = e.target.dataset.question;
    const clickInd = Number(e.target.dataset.index);

    const courses = await getRawData();
    // console.log("id",courses.id)
    let question;

    for (const c of courses) {
      question = c.quiz.find((q) => q.question_id === quesId);
      if (question) break;
    }

    if (!question) return;

    const isCorrect = clickInd === question.correct_index;
    quizScore[quesId] = isCorrect;

    e.target.style.background = isCorrect ? "green" : "red";

    const siblings = e.target.parentElement.querySelectorAll(".option");
    siblings.forEach((li) => (li.style.pointerEvents = "none"));
  }

  if (e.target.id === "submitQuiz") {
    const totalQuestions = Object.keys(quizScore).length;
    const correctAnswers = Object.values(quizScore).filter((v) => v).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const courseId = window.location.hash.split("=")[1];
    // console.log(quizId)

    localStorage.setItem(
      "lastQuizScore",
      JSON.stringify({
        ccourseId: courseId,
        total: totalQuestions,
        correct: correctAnswers,
        percentage,
      })
    );

    alert(
      `You answered ${correctAnswers} out of ${totalQuestions} correctly. Score: ${percentage}%`
    );

    if (percentage >= 50) {
      alert("Passed!");
    } else {
      alert("Failed!");
    }
  }
})


function renderDashboard(){

  let dashboardHtml=`
  <div class="container my-5">
  <h2 class="mb-4">Dashboard Overview</h2>

  <div   class="row g-4">
    
    
    <div  class="col-md-3 ">
      <div id ="d" class="card shadow-sm text-center p-3 bg-secondary text-white ">
        <h6 class=" mb-1 text-muted ">Courses Enrolled</h6>
        <h3 id="coursesCount">0</h3>
      </div>
    </div>

   
    <div class="col-md-3">
      <div id ="d" class="card shadow-sm text-center p-3 bg-warning text-dark"">
        <h6 class="text-muted mb-1">Progress</h6>
        <h3 id="progressPercent">0%</h3>
      </div>
    </div>

    
    <div class="col-md-3">
      <div  id ="d" class="card shadow-sm text-center p-3 bg-info text-white">
        <h6 class="text-muted mb-1">Last Lesson</h6>
        <h5 id="lastLesson">N/A</h5>
      </div>
    </div>


    <div class="col-md-3">
      <div  id ="d" class="card shadow-sm text-center p-3 bg-success text-white">
        <h6 class="text-muted mb-1">Quiz Score</h6>
        <h3 id="quizScore">—</h3>
      </div>
    </div>

  </div>
</div>

  `
  return dashboardHtml
}