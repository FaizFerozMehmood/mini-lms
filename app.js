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
      aapContainer.innerHTML = "<h1>Helo welcom to the dashboard page!</h1>";
      break;
    default:
      if (hash.startsWith("#course=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = await renderCourseDetailPage(coureID);
        const courses = await getRawData();
        const currentCourse = courses.find((c) => c.id == coureID);
        updateCourseProgress(currentCourse);
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
          Browse All Courses
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
  let cardDetails = "";
  try {
    console.log("CourseId===>", CourseId);
    const courses = await getRawData();

    console.log("courses=====>", courses);
    const filteredData = courses.filter((data) => data.id == CourseId);

    cardDetails +=
      '<div  id="heroSection" class="p-5 mb-4 bg-light rounded-3 text-center">';
    cardDetails += '<div class="container-fluid py-5">';
    filteredData.forEach((data) => {
      console.log("leassons==>", data?.lessons);
      const lessonHtml = data?.lessons
        .map((lsn) => {
          return `<li class="p-1"><a href="#lesson=${
            lsn.lesson_id
          }" class="card-link btn btn-primary w-100"">${
            lsn.title || "Lesson Title"
          }</a></li>`;
        })
        .join("");
      console.log(lessonHtml);
      cardDetails += `
      <div >
        
        <img src="${
          data.image_url
        }" class="card-img-top course-image p-10"alt="Course Image">
        
        <div class="card-body">
          <h5 class="card-title p-10 mt-3 fw-bold">${data.description}</h5>
          
                
          
             <ul class="list-unstyled"> 
        ${lessonHtml || "No lessons available."}
      </ul>

          
          <div class="progress mt-4 mb-3">
<div class="progress-bar" role="progressbar" style="width: 0%; min-width: 30px;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-course="${
        data.id
      }">0%</div>
</div>
        </div>
      </div>
      </div>

      `;
    });
    cardDetails += `</div>`;
    return cardDetails;
  } catch (error) {
    console.error(error);
  }
}

async function renderLessonPage(lessonId) {
  let lessonHtml = "";
  try {
    const courses = await getRawData();
    console.log(courses.lesson);
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
        <h1>${sbq.title}</h1>
        <h4>${sbq.text_content}</h4>
        <div class="form-check">
<input 
  class="form-check-input"
  type="checkbox"
  id="checkbox-${sbq.lesson_id}"
  data-lesson="${sbq.lesson_id}"
>
  <label class="form-check-label" for="checkbox-${sbq.lesson_id}">
    completed
  </label>
</div>
<div class="container-fluid d-flex flex-wrap justify-content-center">
  <iframe
width="%"
height="205"
src=${sbq.video_url}
title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin"
allowfullscreen
></iframe>
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

const renderCategoryPage = async (id) => {
  let categoryHtml =""
  const dedeed = decodeURIComponent(id)
  console.log(dedeed)
  const categoreis = await getCategories();
console.log("data by id",categoreis[dedeed]) 

categoreis[dedeed].forEach((d)=>{
  categoryHtml+='<div class="d-flex p-4 flex-wrap justify-content-center">'
categoryHtml+= `
<div class="card course-card p-3 " style="width: 18rem;">
  <img src=${d.image_url} class="card-img-top course-image" alt="...">
  <div class="card-body ">
    <h5 class="card-title">${d.category}</h5>
    <p class="card-text txtx ">${d.description}</p>
    <a href="#" class="btn btn-primary ">Explore Lessons</a>
  </div>
</div>
`
})
categoryHtml+='</div>'
return categoryHtml

};

