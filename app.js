import { getTrendingCourses, getCategories } from "./data/dataHandler.js";

async function routers() {
  const hash = window.location.hash;
  console.log(hash);
  const aapContainer = document.getElementById("app");
  console.log(aapContainer);
  aapContainer.innerHTML = "";

  switch (hash) {
    case "#home":
      aapContainer.innerHTML = await renderHomePage();
      break;

    case "#courses":
      aapContainer.innerHTML = "<h1>Helo welcom to the courses page!</h1>";
      break;
    case "#dashboard":
      aapContainer.innerHTML = "<h1>Helo welcom to the dashboard page!</h1>";
      break;
    default:
      if (hash.startsWith("#course=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = `<h1>Course Detail Page</h1><p>Course ID: ${coureID}</p>`;
      }
  }
}
// routers()

window.addEventListener("hashchange", routers);
window.addEventListener("load", routers);
if (!window.location.hash) {
  window.location.hash = "#home";
}
async function renderHomePage() {
  // try {
  //     const courseCategories = await getCategories()

  //     console.log("categories fetched", courseCategories)
  // } catch (error) {
  //     console.log("error fetching catordory in app",error)
  // }
  try {
    const trendingCourses = await getTrendingCourses();
    console.log(trendingCourses);
    let trendingSECHTML = "<h1>welcome to the trending courese</h1>";
    trendingSECHTML += '<div class="d-flex flex-wrap justify-content-center">';
    trendingCourses.forEach((data) => {
      trendingSECHTML += `<div class="card text-center mx-2 my-2" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <p class="card-text">${data.short_description}</p>
<a href="#course=${data.id}">View Course</a>  </div>
</div>`;
    });
    return trendingSECHTML;
  } catch (error) {}
}
