// var distance=document.getElementById("distance").value;
// var milage=document.getElementById("milage").value;
// var petrol=document.getElementById("petrol").value;
// var service=document.getElementById("service-p").value;
// var consumption=document.getElementById("e-consumption").value;
// var charges=document.getElementById("e-charges").value;
// var range = document.getElementById("range").value;
//
// // for petrol
// let kms=distance*365;
//
// let ltrs=kms/milage;
//
// let petrol_total = petrol*ltrs;
//
// let petrol_Total=parseFloat(petrol_total)+parseFloat(service);
//
// // for ev
// // cost per charge
// let cpc = consumption*charges;
// let total_num_charges = kms / range;
// let cpy = total_num_charges * cpc;
//
// function confirm(){
//   document.getElementById("result").innerHTML="<h3> Your spend Rs."+petrol_Total+" in 1 year for your Petrol/Diesel vehicle<br> Whereas with your EV you spend only "+cpy+" per year";
//   return false;
// }

function hide(){
  document.getElementById("hide").classList.add("hidden");
}

function nothidden(){
  alert("Please enter your vehicle's range and electricity consumption manually ->");
  document.getElementById("hide").classList.remove("hidden");
  document.getElementById("key").value = "1";
}

function carbon(){
if(document.getElementById("petrol_vehicle").selected){
  var vehicle="Petrol"
  console.log(vehicle);
}else{
  var vehicle="Diesel"
  console.log(vehicle);
}
var elements = document.getElementsByClassName("PorD");
for (var i = 0; i < elements.length; i++) {
  elements[i].innerHTML = vehicle ;
}
}
