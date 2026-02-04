/* ================= THEME ================= */
const themeBtn=document.querySelector(".theme-btn");
if(themeBtn){
  themeBtn.onclick=()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark")?"dark":"light"
    );
  };
}
if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

/* ================= CLOCK ================= */
setInterval(()=>{
  const c=document.getElementById("clock");
  if(c) c.textContent=new Date().toLocaleTimeString();
},1000);

/* ================= SLIDER ================= */
const slides=document.querySelectorAll(".hero-slide");
let s=0;
if(slides.length){
  setInterval(()=>{
    slides.forEach(x=>x.classList.remove("active"));
    s=(s+1)%slides.length;
    slides[s].classList.add("active");
  },3000);
}

/* ================= TOP POPUP ================= */
function topPopup(msg){
  const p=document.getElementById("topPopup");
  if(!p) return;
  p.textContent=msg;
  p.style.display="block";
  setTimeout(()=>p.style.display="none",4000);
}

/* ================= GEO ================= */
const geo=document.getElementById("geo");
if(geo && navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    pos=>{
      geo.textContent=`📍 ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
    },
    ()=>{
      geo.textContent="📍 Location unavailable";
    }
  );
}

/* ================= ATTENDANCE SYSTEM ================= */
function getAttendance(){
  return JSON.parse(localStorage.getItem("attendance")||"{}");
}
function saveAttendance(a){
  localStorage.setItem("attendance",JSON.stringify(a));
}
function today(){
  return new Date().toISOString().split("T")[0];
}

function markAttendance(status){
  const a=getAttendance();
  a[today()]={
    status,
    time:new Date().toLocaleTimeString()
  };
  saveAttendance(a);
}

/* DASHBOARD ACTIONS → ATTENDANCE */
function clockIn(){
  markAttendance("Present");
  topPopup("🚀 Clocked in! You’re officially building progress today.");
}
function takeBreak(){
  topPopup("☕ Break time. Strong results come from balanced energy.");
}
function clockOut(){
  topPopup("💜 Clocked out. You earned your rest today.");
}

/* ================= ATTENDANCE TABLE ================= */
const table=document.getElementById("attendanceTable");
if(table){
  const a=getAttendance();
  table.innerHTML="";
  Object.keys(a).forEach(d=>{
    table.innerHTML+=`
      <tr>
        <td>${d}</td>
        <td>${a[d].time || "-"}</td>
        <td>
          <span class="status ${
            a[d].status==="Present"?"done":
            a[d].status==="Late"?"process":"open"
          }">
          ${a[d].status}
          </span>
        </td>
      </tr>`;
  });
}

/* ================= ATTENDANCE CALENDAR ================= */
const cal=document.getElementById("calendar");
if(cal){
  const a=getAttendance();
  const now=new Date();
  const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  for(let i=1;i<=days;i++){
    const d=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
    const st=a[d]?.status||"Absent";
    cal.innerHTML+=`
      <div class="day ${st.toLowerCase()} ${d===today()?"today":""}">
        ${i}
      </div>`;
  }
}


/* ================= PROFILE WITH HISTORY ================= */
const historyKey="profileHistory";

function loadProfile(){
  const p=JSON.parse(localStorage.getItem("profile")||
   '{"name":"Keerthika","role":"Intern","email":"keerthika@fortumars.com"}');

  if(name){name.value=p.name;}
  if(role){role.value=p.role;}
  if(email){email.value=p.email;}

  loadProfileHistory();
}

function saveProfile(){
  const newProfile={
    name:name.value,
    role:role.value,
    email:email.value
  };

  localStorage.setItem("profile",JSON.stringify(newProfile));
  addProfileHistory("Profile updated");
  topPopup("✅ Profile updated successfully");
}

function addProfileHistory(action){
  const h=JSON.parse(localStorage.getItem(historyKey)||"[]");
  h.unshift({
    action,
    time:new Date().toLocaleString()
  });
  localStorage.setItem(historyKey,JSON.stringify(h));
  loadProfileHistory();
}

function loadProfileHistory(){
  const list=document.getElementById("profileHistory");
  if(!list) return;

  const h=JSON.parse(localStorage.getItem(historyKey)||"[]");
  list.innerHTML="";
  h.forEach(i=>{
    list.innerHTML+=`
      <li>
        <strong>${i.action}</strong>
        <span>${i.time}</span>
      </li>`;
  });
}

loadProfile();


/* ================= LEAVE ================= */
function applyLeave(){
  const p=document.getElementById("leaveProgress");
  const s=document.getElementById("leaveStatus");
  if(p && s){
    p.style.width="60%";
    s.textContent="Leave Pending Approval";
    topPopup("📨 Leave request submitted");
  }
}

/* ================= ISSUES ================= */
function raiseIssue(){
  const t=document.getElementById("issueTitle");
  if(!t || !t.value) return;

  const row=document.createElement("tr");
  row.innerHTML=`
    <td>${t.value}</td>
    <td><span class="status open">Open</span></td>
    <td>
      <button onclick="processIssue(this)">Process</button>
      <button onclick="closeIssue(this)">Rectify</button>
    </td>`;
  document.getElementById("issueTable").appendChild(row);
  t.value="";
  topPopup("🛠 Issue logged successfully");
}

function processIssue(btn){
  btn.parentElement.previousElementSibling.innerHTML=
   '<span class="status process">In Process</span>';
}

function closeIssue(btn){
  btn.parentElement.previousElementSibling.innerHTML=
   '<span class="status done">Rectified</span>';
}
