document.addEventListener("DOMContentLoaded", function(){
  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));
});
