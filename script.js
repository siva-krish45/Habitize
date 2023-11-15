const input = document.getElementById("input");
const addHabit = document.getElementById("addHabit");
const cancel = document.getElementById("cancel");
const habitName = document.getElementById("habitName");
const reason = document.getElementById("reason");
const habit = document.getElementById("done");
const container = document.getElementById("habitContainer");
const days = document.querySelectorAll("input[type='radio']");
const today = new Date();
const date = today.getDate();
const month = today.getMonth()+1;
const year = today.getFullYear();

function updateHeart(existingHabits,number,bool){
  if(bool){
    return existingHabits[number].hearts;
  }
  
  existingHabits[number].hearts = (existingHabits[number].hearts) - 1;
}

function deleteHabit(number){
  const existingHabits = JSON.parse(localStorage.getItem("habits"));
  existingHabits.splice(number,1);
  localStorage.setItem("habits", JSON.stringify(existingHabits));
  drawTheHabitUI();
}

container.addEventListener("click", event =>{
  
  const innerContent = event.target.innerText;
  const number = event.target.parentElement.parentElement.getAttribute("data-habit-number");
  
  if(number !== null){
    const existingHabits = JSON.parse(localStorage.getItem("habits"));
    const selectedDay = existingHabits[number].habitDone["day"+innerContent].day;
    const selectedMonth = existingHabits[number].habitDone["day"+innerContent].month;
    const selectedYear = existingHabits[number].habitDone["day"+innerContent].year;
    const marked = existingHabits[number].habitDone["day"+innerContent]["marked"];
    if (event.target.classList.contains('eachDay') && isToday(selectedDay,selectedMonth,selectedYear)){
      event.target.classList.add("clicked");
      existingHabits[number].habitDone["day"+innerContent]["marked"] = true;
      localStorage.setItem("habits", JSON.stringify(existingHabits));
    }
    else if(dayClickedBeforeNotMarked(marked,selectedDay,selectedMonth,selectedYear)){
      alert("u have clicked the date u havent performed the habit");
      if(updateHeart(existingHabits,number,1) == "0"){
        alert("u dont have enough heart to perform this operation");
      }else{
        const useHeart = confirm("do you want to use your heart");
        if(useHeart){
          updateHeart(existingHabits, number,0);
          event.target.classList.add("clicked");
          existingHabits[number].habitDone["day"+innerContent]["marked"] = true;
          localStorage.setItem("habits", JSON.stringify(existingHabits));
          drawTheHabitUI();
          
        }else{
          alert("u cancelled the operation of using hearts");
        }
      }
      

      
    }
    else if(marked){
      alert("already marked");
    }
    else{
      alert("habit is not meant for today");
    }
  }
  if(event.target.classList.contains("deleteBtn")){
    const number = event.target.parentElement.getAttribute("data-habit-number");
    deleteHabit(number);
  }
})


function isToday(selectedDay,selectedMonth,selectedYear){
    
    if(selectedDay ===date && selectedMonth === month && selectedYear === year){
      return true;
    }
    return false;
}

function dayClickedBeforeNotMarked(marked,selectedDay,selectedMonth,selectedYear){
  
  if(marked === false && (selectedDay <= date && selectedMonth <= month && selectedYear <= year) ){
    return true;
  }else if (marked === false && (selectedMonth > month && selectedYear < year)){
    return true;
  }
  else if (marked === false && (selectedDay > date && selectedMonth < month)){
    return true;
  }
  return false;
}

addHabit.addEventListener("click", () => {
  input.showModal();
});

cancel.addEventListener("click", () => {
  input.close();
});



function validateInput(element, string) {
  if (element.value.trim() === "") {
    alert(`enter the ${string}`);
    return true;
  } else {
    return false;
  }
}

habit.addEventListener("click", () => {
  if (validateInput(habitName, "habit name")) return;
  if (validateInput(reason, "reason for the habit")) return;
  const habitDetails = getDetails();
  saveHabitToLocalStorage(habitDetails);
  habitName.value="";
  reason.value="";
  input.close();
});

function getDetails() {
  let noOfDays;
  let heart;
  for (let i = 0; i < 3; i++) {
    if (days[i].checked){
      noOfDays = days[i].value;
      break;
    }
  }

  const markingDay = {};

  switch (noOfDays){
    case "7":
      heart = 1;
      break;
    case "14":
      heart = 2;
      break;
    case "21":
      heart = 3;
      break;
  }


  for(let i=1; i<=noOfDays; i++){
    const day = {};
    day["marked"] = false;
    let dayy = new Date(year,month,date+i-1);
    day["day"] = dayy.getDate();
    day["month"] = dayy.getMonth();
    day["year"] = dayy.getFullYear();
    markingDay["day" + i] = day;
  }

  return {
    habit: habitName.value,
    days: noOfDays,
    hearts: heart,
    habitDone: markingDay,
    reason: reason.value,
  };
}

function saveHabitToLocalStorage(habitDetails) {
    // Get existing habits from local storage or initialize an empty array
    const existingHabits = JSON.parse(localStorage.getItem("habits")) || [];
  
    // Add the new habit details to the array
    existingHabits.push(habitDetails);
  
    // Save the updated habits array back to local storage
    localStorage.setItem("habits", JSON.stringify(existingHabits));
    drawTheHabitUI();
}



function drawTheHabitUI(){
    container.innerHTML = "";
    const habits = getStoredHabits();
    for(let j=0; j<habits.length; j++){
      const individualHabit = document.createElement("div");
      individualHabit.className = "habit";
      individualHabit.setAttribute("data-habit-number",j);
      const title = document.createElement("h2");
      title.innerText = habits[j].habit;
      const heartremaining = document.createElement("p");
      heartremaining.innerText = `${habits[j].hearts} heart remaining`;
      const marking = document.createElement("div");
      marking.className = "marking";
      for(let i=1; i<=habits[j].days; i++){
        const individualdaybox = document.createElement("button");
        individualdaybox.className ="eachDay";
        let x = habits[j].habitDone;
        if(x["day"+i].marked=== true){
          individualdaybox.classList.add("clicked");
        }
        
        if(x["day"+i].day === date && x["day"+i].month === month && x["day" + i].year === year){
          individualdaybox.classList.add("today");
        }

        individualdaybox.innerText = i;
        marking.appendChild(individualdaybox);
      }
      const reason = document.createElement("p");
      reason.innerText = habits[j].reason;
      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class","deleteBtn");
      deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
      individualHabit.appendChild(title);
      individualHabit.appendChild(heartremaining);
      individualHabit.appendChild(marking);
      individualHabit.appendChild(reason);
      individualHabit.appendChild(deleteBtn);
      container.appendChild(individualHabit);
    }
}
      

drawTheHabitUI();

function getStoredHabits() {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    return habits;
}
