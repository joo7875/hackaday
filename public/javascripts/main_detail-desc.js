
// *************************************************************** CONTENT FUNCTION

function contentFunc(n) {
	var description = document.getElementById('description');
	var details = document.getElementById('details');
	var components = document.getElementById('components');
	var instructions = document.getElementById('instructions');
	var logs = document.getElementById('logs');

  if (n == 1) {
    description.style.display = "block";
    details.style.display = "none";
    components.style.display = "none";
    instructions.style.display = "none";
    logs.style.display = "none";

  } else (n == 2) {
    description.style.display = "none";
    details.style.display = "block";
    components.style.display = "none";
    instructions.style.display = "none";
    logs.style.display = "none";

  } else (n == 3) {
    description.style.display = "none";
    details.style.display = "none";
    components.style.display = "block";
    instructions.style.display = "none";
    logs.style.display = "none";

  } else (n == 5) {
    description.style.display = "none";
    details.style.display = "none";
    components.style.display = "none";
    instructions.style.display = "block";
    logs.style.display = "none";

  } else (n == 4) {
    description.style.display = "none";
    details.style.display = "none";
    components.style.display = "none";
    instructions.style.display = "none";
    logs.style.display = "block";
  }
}