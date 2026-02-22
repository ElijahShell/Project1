const calendar = document.querySelector(".calendar");
const eventModal = document.getElementById("eventModal");
const closeModal = document.querySelector(".close-btn");
const saveEventBtn = document.getElementById("saveEventBtn")
const deleteEventBtn = document.getElementById("deleteEventBtn");
const eventTitle = document.getElementById("eventTitle");
const eventDesc = document.getElementById("eventDesc");

let selectedDate = null;
let events = JSON.parse(localStorage.getItem("events")) || {};
let yearDetails = [];
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let currentMonthIndex = currentDate.getMonth();
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.appendChild(tooltip);

//generates whole year object
const getYearlyCalenderDetails = ()=> {
    let calendarParams = [];
    for(let month=0;month<12;month++){
        let date = new Date(currentYear, month + 1, 0);
        const monthName = date.toLocaleString("default", {month: "long"});
        calendarParams.push({
        year: currentYear,
        month: monthName,
        days: date.getDate(),
        });
    }
    return calendarParams
};
//Generate calendar for each month
function GenerateCalendar(){
    calendar.innerHTML = "";
    if(yearDetails.length == 0){
        yearDetails = getYearlyCalenderDetails();
    }
    const monthObj = yearDetails[currentMonthIndex];
    const daysInMonth = monthObj.days;
    const month = document.createElement("div");
    month.classList.add("month")
    //Head Part
    const monthHead= document.createElement("div");
    monthHead.classList.add("month-head");
    monthHead.innerHTML=`<button id="prevBtn">Previous</button>
    <span>${monthObj.month} ${monthObj.year}</span>
    <button id="nextBtn">Next</button>`;
    calendar.appendChild(monthHead);
    monthHead.querySelector("#prevBtn").addEventListener("click",
    showPreviousMonth);
    monthHead.querySelector("#nextBtn").addEventListener("click",showNextMonth);
    for(let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;
        //Mark the day with event
        if(events[`${currentMonthIndex}_${i}`]){
            const marker = document.createElement("div");
            marker.classList.add("event-marker");
            day.appendChild(marker);

            //Add hover event to show tooltip
            day.addEventListener("mouseenter", (e)=> 
            showTooltip(e, events[`${currentMonthIndex}_${i}`].title)
            );
            //hide tooltip
            day.addEventListener("mouseleave", hideTooltip);
        }
        //modal for input
       day.addEventListener("click", ()=>openModal(currentMonthIndex, i));
       month.appendChild(day);
       
    }
    calendar.appendChild(month);   
}

//Handle month navigation
function showPreviousMonth(){
    if(currentMonthIndex>0){
        currentMonthIndex-= 1;
        GenerateCalendar();
    }

}
function showNextMonth(){
    if(currentMonthIndex <11){
        currentMonthIndex+=1;
        GenerateCalendar();
    }
}

//Tooltip functions
function showTooltip(e,title){
    tooltip.textContent = title;
    tooltip.style.left=`${e.pageX + 10}px`;
    tooltip.style.top=`${e.pageY + 10}px`;
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
}

function hideTooltip(){
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
}

function openModal(currentMonth,date){
    selectedDate = `${currentMonth}_${date}`;
    eventTitle.value= events[`${currentMonth}_${date}`]?.title || "";
    eventDesc.value=events[`${currentMonth}_${date}`]?.description || "";
    eventModal.style.display = "block";
}

function closeModalWindow(){
    eventModal.style.display = "none";
    selectedDate = null;
}
function saveEvent(){
    if(selectedDate && eventTitle.value.trim()){
        events[selectedDate] = {
            title:eventTitle.value.trim(),
            description: eventDesc.value.trim(),
        };
        localStorage.setItem("events", JSON.stringify(events));
        GenerateCalendar();
        closeModalWindow();
    }
}
function deleteEvent(){
    if(selectedDate){
        delete events[selectedDate];
        localStorage.setItem("events", JSON.stringify(events));
        GenerateCalendar();
        closeModalWindow();
    }
}
//Close modal button
closeModal.addEventListener("click", closeModalWindow);
//save Button(inside Modal)
saveEventBtn.addEventListener("click", saveEvent);
//Delete Button(inside Modal)
deleteEventBtn.addEventListener("click", deleteEvent);

//If user clicks on anywhere except the input are close the Modal
window.addEventListener("click", (e)=>{
    if(e.target == eventModal) 
    closeModalWindow();
});

window.onload = () => {
    GenerateCalendar();
};
