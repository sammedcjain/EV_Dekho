document.getElementById("compare-form").addEventListener("submit", function(event) {
  event.preventDefault();
  if (check()) {
    var v1=document.getElementById("vehicle1").value;
    var v2=document.getElementById("vehicle2").value;
    if(document.getElementById("hide").classList.contains("hidden")){
      document.getElementById("compare-form").action="compare/"+v1+"/"+v2;
    }else{
      var v3=document.getElementById("vehicle3").value;
      document.getElementById("compare-form").action="compare/"+v1+"/"+v2+"/"+v3;
    }
    this.submit();
  }
});

function check() {
  var index1 = document.getElementById("vehicle1").selectedIndex;
  var index2 = document.getElementById("vehicle2").selectedIndex;
  var index3 = document.getElementById("vehicle3").selectedIndex;
  if (index1 == index2 || index1 == index3 || index2 == index3) {
    alert("Please select different vehicles");
    return false;
  }
  return true;
}

function addv3(){
  document.getElementById("hide").classList.remove("hidden");
}

function removev3(){
  document.getElementById("hide").classList.add("hidden");
}
